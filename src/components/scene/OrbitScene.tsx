"use client";

import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { sceneConstants as C, sceneStates, type SceneValues } from "./sceneStates";

// The hero group sits far right for wide screens; on phones that pushes the planet off-screen.
const COMPACT_HERO_GROUP_X = 6;
import { sceneStore } from "./sceneStore";
import { PlanetTouchToggle } from "./PlanetTouchToggle";
import { diskFragmentShader, diskVertexShader } from "./diskShader";
import { playIgnitionZap, readBlipLevels, readCueLevels, setPlanetSoundscape } from "@/components/ui/menuChord";

const DEG = Math.PI / 180;
const MAIN_PURPLE = new THREE.Color(0x9b6dff);
const W_MODEL = "/models/orbiting-w.gltf";
const Z_MODEL = "/models/orbiting-z.gltf";
const B_MODEL = "/models/orbiting-b.gltf";

/**
 * Each orbiting mark has its own source and visual configuration: the glow colour and
 * resting intensity, its place on the orbit (`phase`, tilt) and its spark timing.
 * `wobble` adds the slow tilt oscillation to the orbit plane.
 */
const ORBIT_MODELS = [
  {
    src: W_MODEL,
    emissive: C.wEmissive,
    baseGlow: C.wEmissiveIntensity,
    phase: (4 * Math.PI) / 3,
    tiltX: C.orbitTiltX * DEG,
    tiltY: C.orbitTiltY * DEG,
    wobble: true,
    recenter: false,
    sparkleSeed: 7,
    sparkIndex: 0,
  },
  {
    src: Z_MODEL,
    emissive: 0x9b6dff,
    baseGlow: 0,
    phase: 0,
    tiltX: 0,
    tiltY: 0,
    wobble: false,
    recenter: true,
    sparkleSeed: 13,
    sparkIndex: 1,
  },
  {
    src: B_MODEL,
    emissive: 0x78bfff,
    baseGlow: 0,
    phase: (2 * Math.PI) / 3,
    tiltX: Math.PI / 2,
    tiltY: 0,
    wobble: false,
    recenter: true,
    sparkleSeed: 29,
    sparkIndex: 2,
  },
] as const;

const SceneEffects = lazy(() => import("./SceneEffects"));

function sparkCycle(time: number, index: number) {
  return (time + index * C.orbitSparkStagger) % C.orbitSparkPeriod;
}

function sparkPulse(time: number, index: number) {
  const cycle = sparkCycle(time, index);
  const flash = Math.exp(-0.5 * ((cycle - C.orbitSparkFlashAt) / C.orbitSparkFlashWidth) ** 2);
  const echo =
    C.orbitSparkEchoStrength *
    Math.exp(-0.5 * ((cycle - C.orbitSparkEchoAt) / C.orbitSparkEchoWidth) ** 2);
  return Math.min(1, flash + echo);
}

function createStarGeometry(count: number) {
  let randomSeed = 4242;
  const random = () => {
    randomSeed = (randomSeed * 1664525 + 1013904223) >>> 0;
    return randomSeed / 0x100000000;
  };
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (random() * 2 - 1) * C.starField.halfWidth;
    positions[index * 3 + 1] = (random() * 2 - 1) * C.starField.halfHeight;
    positions[index * 3 + 2] = C.starField.nearZ - random() * C.starField.depth;
    const brightness = 0.35 + random() ** 2 * 0.65;
    const tint = random();
    colors[index * 3] = brightness * (tint > 0.8 ? 0.85 : 1);
    colors[index * 3 + 1] = brightness * (tint > 0.8 ? 0.9 : 1);
    colors[index * 3 + 2] = brightness;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function createGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create the glow texture canvas.");
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.18, "rgba(255,255,255,0.85)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.18)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createSparkleGeometry(radius: number, seed: number, count = 20) {
  let randomSeed = seed;
  const random = () => {
    randomSeed = (randomSeed * 1664525 + 1013904223) >>> 0;
    return randomSeed / 0x100000000;
  };
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const z = random() * 2 - 1;
    const angle = random() * Math.PI * 2;
    const radial = radius * (0.82 + random() * 0.34);
    const planar = Math.sqrt(1 - z * z) * radial;
    positions[index * 3] = Math.cos(angle) * planar;
    positions[index * 3 + 1] = Math.sin(angle) * planar;
    positions[index * 3 + 2] = z * radial;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geometry;
}

const TEXTURES = [
  "/textures/planet-albedo.webp",
  "/textures/planet-normal.webp",
  "/textures/planet-roughness.png",
  "/textures/planet-clouds.webp",
];

const PAGE_CONTENT_SELECTOR = [
  "header",
  ".skip-link",
  "footer",
  "#main > :not([data-scene-track])",
  "[data-scene-track] > #hero-section",
  "[data-scene-track] > [data-scene-state]",
  "[data-scene-track] > #journey-section",
  "[data-planet-hint]",
  "[data-site-cursor]",
].join(", ");

function playProjectChord(clientX: number) {
  const audioContext = new AudioContext();
  const now = audioContext.currentTime;
  const filter = audioContext.createBiquadFilter();
  const panner = audioContext.createStereoPanner();
  const volume = audioContext.createGain();
  const pan = (clientX / window.innerWidth) * 2 - 1;

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(620, now);
  filter.frequency.exponentialRampToValueAtTime(2100, now + 0.28);
  filter.frequency.exponentialRampToValueAtTime(900, now + 0.95);
  panner.pan.setValueAtTime(pan, now);
  panner.pan.linearRampToValueAtTime(0, now + 0.8);
  volume.gain.setValueAtTime(0.0001, now);
  volume.gain.exponentialRampToValueAtTime(0.16, now + 0.09);
  volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.98);
  filter.connect(panner);
  panner.connect(volume);
  volume.connect(audioContext.destination);

  for (const [index, frequency] of [130.81, 261.63, 329.63, 392, 523.25].entries()) {
    const oscillator = audioContext.createOscillator();
    const voice = audioContext.createGain();
    oscillator.type = index < 2 ? "sine" : "triangle";
    oscillator.frequency.value = frequency;
    oscillator.detune.value = index > 1 ? (index - 2) * 2 : 0;
    voice.gain.value = [0.38, 0.2, 0.16, 0.14, 0.08][index];
    oscillator.connect(voice);
    voice.connect(filter);
    oscillator.start(now);
    oscillator.stop(now + 1.02);
  }

  if (audioContext.state === "suspended") {
    void audioContext.resume().catch((error: unknown) => {
      console.error("Could not start the project transition sound.", error);
    });
  }
  window.setTimeout(() => {
    void audioContext.close();
  }, 1500);
}

type Props = {
  reducedMotion: boolean;
  compact: boolean;
  onReady?: () => void;
  projectsLabel: string;
  touchToggleLabel: string;
};

type RigProps = Omit<Props, "locale" | "projectsLabel" | "touchToggleLabel"> & {
  cursorTarget: React.RefObject<HTMLAnchorElement | null>;
  entering: React.RefObject<{ progress: number; boom: number }>;
};

/**
 * The Home WebGL scene: a textured planet and orbiting glTF mark inside a
 * shader-driven accretion disk, lit by one violet key light. It animates toward the
 * state the scroll choreography puts in `sceneStore`, over 1 s eased in and out,
 * like the live Framer component.
 *
 * On larger screens a post-processing pass adds bloom, a touch of chromatic aberration
 * and a vignette; phones skip it and the disk shader compresses its own highlights.
 */
export default function OrbitScene({ reducedMotion, compact, onReady, projectsLabel, touchToggleLabel }: Props) {
  const [active, setActive] = useState(sceneStore.active);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const cursorTarget = useRef<HTMLAnchorElement>(null);
  const entering = useRef({ progress: 0, boom: 0 });
  const navigating = useRef(false);
  const projectsHref = "/cases";

  useEffect(() => sceneStore.subscribeActive(setActive), []);

  // Coming back from the back/forward cache must not leave the page faded out mid-transition.
  useEffect(() => {
    const target = entering.current;
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      gsap.killTweensOf(target);
      target.progress = 0;
      target.boom = 0;
      navigating.current = false;
      gsap.set(PAGE_CONTENT_SELECTOR, { clearProps: "opacity" });
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(
    () => () => {
      gsap.killTweensOf(entering.current);
    },
    [],
  );

  const onPlanetClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    if (navigating.current) return;

    navigating.current = true;
    playProjectChord(event.clientX);
    if (reducedMotion) {
      window.location.assign(projectsHref);
      return;
    }

    gsap.to(entering.current, {
      progress: 1,
      duration: 1.05,
      ease: "power3.in",
      onComplete: () => {
        gsap.to(entering.current, {
          boom: 1,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => window.location.assign(projectsHref),
        });
      },
    });
    const pageContent = document.querySelectorAll<HTMLElement>(PAGE_CONTENT_SELECTOR);
    gsap.to(pageContent, {
      opacity: 0,
      duration: 1.05,
      ease: "power3.in",
      overwrite: "auto",
    });
  };

  return (
    <>
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
          powerPreference: "high-performance",
        }}
        camera={{ fov: C.fov, near: 0.1, far: 2000, position: [C.cameraX, C.cameraY, sceneStates.hero.cameraZ] }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        style={{ position: "absolute", inset: 0 }}
      >
        <Rig
          reducedMotion={reducedMotion}
          compact={compact}
          onReady={onReady}
          cursorTarget={cursorTarget}
          entering={entering}
        />
        {!compact && (
          <Suspense fallback={null}>
            <SceneEffects />
          </Suspense>
        )}
      </Canvas>
      {portalRoot &&
        createPortal(
          <>
            <Link
              ref={cursorTarget}
              href={projectsHref}
              prefetch={false}
              onClick={onPlanetClick}
              data-cursor-target
              data-cursor-hit-area
              data-cursor-shape="circle"
              data-cursor-label="Explore"
              aria-label={projectsLabel}
              onPointerEnter={() => setPlanetSoundscape(true)}
              onPointerLeave={() => setPlanetSoundscape(sceneStore.touchHover)}
              style={{ position: "fixed", zIndex: 99, pointerEvents: "auto", display: active ? undefined : "none" }}
            />
            {compact && active && <PlanetTouchToggle label={touchToggleLabel} reducedMotion={reducedMotion} />}
          </>,
          portalRoot,
        )}
    </>
  );
}

function Rig({ reducedMotion, compact, onReady, cursorTarget, entering }: RigProps) {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const group = useRef<THREE.Group>(null);
  const planet = useRef<THREE.Group>(null);
  const clouds = useRef<THREE.Group>(null);
  const modelOrbits = useRef<Array<THREE.Group | null>>(ORBIT_MODELS.map(() => null));
  const modelGroups = useRef<Array<THREE.Group | null>>(ORBIT_MODELS.map(() => null));
  const lastCycle = useRef<number[]>(ORBIT_MODELS.map(() => 0));
  const flare = useRef<THREE.Group>(null);
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const lightAngle = useRef(0);
  const flareCore = useRef<THREE.Sprite>(null);
  const flareHalo = useRef<THREE.Sprite>(null);
  const disk = useRef<THREE.Group>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());
  const pointerActive = useRef(false);
  const planetHovered = useRef(false);
  const hoverProgress = useRef(0);
  const planetWorldPosition = useRef(new THREE.Vector3());
  const planetWorldScale = useRef(new THREE.Vector3());
  const planetNdc = useRef(new THREE.Vector3());
  const spin = useRef({ planet: 0, clouds: 0, orbit: 0, w: 0, disk: 0, time: 0 });
  const stateValues = (name: typeof sceneStore.state): SceneValues =>
    compact && name === "hero" ? { ...sceneStates.hero, groupX: COMPACT_HERO_GROUP_X } : sceneStates[name];
  const values = useRef<SceneValues>({ ...stateValues(sceneStore.state) });

  const [albedo, normal, roughness, cloudsMap] = useLoader(THREE.TextureLoader, TEXTURES);
  albedo.colorSpace = THREE.SRGBColorSpace;
  cloudsMap.colorSpace = THREE.SRGBColorSpace;

  const orbitingGltfs = useLoader(
    GLTFLoader,
    ORBIT_MODELS.map(({ src }) => src),
  );
  const orbitalScenes = useMemo(
    () =>
      orbitingGltfs.map((gltf, index) => {
        const config = ORBIT_MODELS[index];
        const scene = gltf.scene.clone(true);
        const materials: THREE.MeshStandardMaterial[] = [];

        // Match W_MODEL's material preparation: clone every material, disable
        // transmission, preserve opaque rendering, and apply the model glow.
        scene.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;

          const sourceMaterials = Array.isArray(object.material) ? object.material : [object.material];
          const preparedMaterials = sourceMaterials.map((sourceMaterial) => {
            const material = sourceMaterial.clone();
            if (material instanceof THREE.MeshPhysicalMaterial) {
              material.transmission = 0;
              material.transparent = true;
              material.opacity = 1;
              material.depthTest = true;
              material.emissive.set(config.emissive);
              material.emissiveIntensity = config.baseGlow;
              materials.push(material);
            } else if (material instanceof THREE.MeshStandardMaterial) {
              material.emissive.set(config.emissive);
              material.emissiveIntensity = config.baseGlow;
              materials.push(material);
            }
            material.depthTest = true;
            material.needsUpdate = true;
            return material;
          });

          object.material = Array.isArray(object.material) ? preparedMaterials : preparedMaterials[0];
          object.renderOrder = C.wRenderOrder;
        });

        const bounds = new THREE.Box3().setFromObject(scene);
        const sphere = bounds.getBoundingSphere(new THREE.Sphere());
        if (!Number.isFinite(sphere.radius) || sphere.radius <= 0) {
          throw new Error(`Orbiting model at ${config.src} has invalid bounds`);
        }

        // Centre each model at its own origin (W keeps its authored origin).
        if (config.recenter) scene.position.sub(sphere.center);
        scene.updateMatrixWorld(true);

        return {
          scene,
          materials,
          sparkleGeometry: createSparkleGeometry(sphere.radius, config.sparkleSeed),
          scale: (C.wRadius / sphere.radius) * C.wScale,
        };
      }),
    [orbitingGltfs],
  );
  const sparkleMaterials = useMemo(
    () =>
      orbitalScenes.map(
        () =>
          new THREE.PointsMaterial({
            color: 0xe9ddff,
            size: 3.5,
            sizeAttenuation: false,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthTest: true,
            depthWrite: false,
            toneMapped: false,
          }),
      ),
    [orbitalScenes],
  );
  const starGeometry = useMemo(
    () => createStarGeometry(compact ? C.starField.compactCount : C.starField.count),
    [compact],
  );
  const starMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 1.6,
        sizeAttenuation: false,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );
  const glowTexture = useMemo(() => createGlowTexture(), []);
  const flareCoreMaterial = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      }),
    [glowTexture],
  );
  const flareHaloMaterial = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0xcfd8ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      }),
    [glowTexture],
  );

  useEffect(
    () => () => {
      setPlanetSoundscape(false);
      orbitalScenes.forEach(({ sparkleGeometry }) => sparkleGeometry.dispose());
      sparkleMaterials.forEach((material) => material.dispose());
      starGeometry.dispose();
      starMaterial.dispose();
      flareCoreMaterial.dispose();
      flareHaloMaterial.dispose();
      glowTexture.dispose();
    },
    [orbitalScenes, sparkleMaterials, starGeometry, starMaterial, flareCoreMaterial, flareHaloMaterial, glowTexture],
  );

  const diskUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uVal: { value: 0.17 },
      uVal3: { value: 1 },
      uOctaves: { value: compact ? 2 : 3 },
      uSpin: { value: 0 },
      uHdr: { value: compact ? 0 : 1 },
    }),
    [compact],
  );

  // Tween toward each new state, likevariant transition.
  useEffect(() => {
    const target = values.current;
    const go = (name: typeof sceneStore.state) => {
      gsap.killTweensOf(target);
      if (reducedMotion) Object.assign(target, stateValues(name));
      else gsap.to(target, { ...stateValues(name), duration: C.transition, ease: "power1.inOut" });
    };
    go(sceneStore.state);
    const off = sceneStore.subscribe(go);
    return () => {
      off();
      gsap.killTweensOf(target);
    };
  }, [reducedMotion]);

  const readyFired = useRef(false);

  useEffect(() => {
    if (compact) return;

    const onPointerMove = (event: PointerEvent) => {
      const bounds = gl.domElement.getBoundingClientRect();
      const insideCanvas =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;
      pointerActive.current = insideCanvas;
      if (!insideCanvas) return;

      pointer.current.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
      );
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [compact, gl]);

  useFrame((_, delta) => {
    const v = values.current;
    const s = spin.current;
    const transition = entering.current.progress;
    const planetScale = 1 - transition;
    const diskExpansion = 1 + transition * 5.5;
    // Framer advances its angles per frame; scale by real time so speed is fps-independent.
    const frames = reducedMotion ? 0 : Math.min(delta, 0.1) * 60;
    s.planet -= v.planetSpin * frames;
    s.clouds -= v.cloudsSpin * frames;
    s.orbit += C.orbitSpin * frames;
    s.w += C.wSpin * frames;
    s.disk += C.diskSpin * frames;
    s.time += 0.016 * frames;

    camera.position.set(C.cameraX, C.cameraY, v.cameraZ);
    camera.lookAt(0, 0, 0);

    const g = group.current;
    if (g) {
      g.position.set(v.groupX, v.groupY, v.groupZ);
      g.rotation.set(v.groupRotX * DEG, 0, 0);
    }
    if (planet.current) {
      planet.current.position.set(v.diskX * transition, v.diskY * transition, C.planetZ);
      planet.current.scale.setScalar(v.planetScale * planetScale);
      planet.current.rotation.set(0, v.planetRotY * DEG + s.planet, 0);
    }
    if (clouds.current) {
      clouds.current.position.set(v.diskX * transition, v.diskY * transition, C.planetZ);
      clouds.current.scale.setScalar(v.cloudsScale * planetScale);
      clouds.current.rotation.set(0, v.planetRotY * DEG + s.clouds, 0);
    }
    const blipLevels = readBlipLevels();
    const cueLevels = readCueLevels();
    for (const [index, orbitalGroup] of modelOrbits.current.entries()) {
      if (!orbitalGroup) continue;
      const config = ORBIT_MODELS[index];
      orbitalGroup.position.set(v.diskX * transition, v.diskY * transition, C.planetZ);
      orbitalGroup.scale.setScalar(v.planetScale * planetScale);
      const wobble = config.wobble
        ? Math.sin(s.time * C.orbitOscillationSpeed) * C.orbitOscillationAmplitude * DEG
        : 0;
      orbitalGroup.rotation.set(config.tiltX + wobble, config.tiltY, s.orbit + config.phase);

      // Particles, shake and the spark pop only play while the planet is hovered.
      const hoverNow = hoverProgress.current;
      const spark = Math.min(
        1,
        Math.min(1, sparkPulse(s.time, config.sparkIndex) + blipLevels[index]) * hoverNow + cueLevels[index],
      );
      const cycle = sparkCycle(s.time, config.sparkIndex);
      if (
        !reducedMotion &&
        hoverNow > 0.5 &&
        lastCycle.current[index] < C.orbitSparkFlashAt &&
        cycle >= C.orbitSparkFlashAt
      ) {
        playIgnitionZap((index - 1) * 0.4);
      }
      lastCycle.current[index] = cycle;

      const modelGroup = modelGroups.current[index];
      if (modelGroup) {
        const shake = spark * C.orbitSparkShake;
        modelGroup.rotation.set(
          Math.sin(s.time * 97 + index) * shake,
          s.w + Math.sin(s.time * 131 + index) * shake,
          Math.cos(s.time * 113 + index) * shake,
        );
        modelGroup.scale.setScalar(
          orbitalScenes[index].scale *
            (1 + hoverNow * (C.planetHoverWScale - 1) + spark * C.orbitSparkScale),
        );
      }
      sparkleMaterials[index].opacity = spark * 0.95;

      const glow =
        config.baseGlow +
        hoverNow * C.planetHoverWGlow +
        C.orbitSparkGlow * spark;
      for (const material of orbitalScenes[index].materials) {
        material.emissiveIntensity = glow;
        // As each note rings, the letter's glow shifts toward the main purple and fades back.
        material.emissive.set(config.emissive).lerp(MAIN_PURPLE, Math.min(1, blipLevels[index] * hoverNow + cueLevels[index]));
      }
    }

    // Final seconds of the planet transition: a small white dot flares where the planet vanishes.
    if (flare.current && flareCore.current && flareHalo.current) {
      const dotIn = THREE.MathUtils.smoothstep(transition, 0.7, 1);
      const boom = entering.current.boom;
      flare.current.visible = dotIn > 0.001;
      flare.current.position.set(v.diskX * transition, v.diskY * transition, C.planetZ);
      const dotSize = 0.35 * dotIn * (1 + boom * 0.4);
      flareCore.current.scale.setScalar(dotSize);
      // A tight blink: the halo stays only a little larger than the dot.
      flareHalo.current.scale.setScalar(dotSize * (2.2 + boom * 1.2));
      flareCoreMaterial.opacity = dotIn * (1 - boom);
      flareHaloMaterial.opacity = dotIn * 0.6 * (1 - boom);
    }
    if (disk.current) {
      disk.current.position.set(v.diskX, v.diskY, C.diskZ);
      disk.current.rotation.set(C.diskRotX * DEG, C.diskRotY * DEG, v.diskRotZ * DEG + s.disk);
    }
    if (pointerActive.current) {
      g?.updateMatrixWorld(true);
      raycaster.current.setFromCamera(pointer.current, camera);
      const firstHit = planet.current ? raycaster.current.intersectObjects([planet.current], true)[0]?.object : undefined;
      planetHovered.current = sceneStore.touchHover || (firstHit !== undefined && planet.current?.getObjectById(firstHit.id) !== undefined);
    } else {
      planetHovered.current = sceneStore.touchHover;
    }
    hoverProgress.current = THREE.MathUtils.damp(
      hoverProgress.current,
      planetHovered.current ? 1 : 0,
      C.planetHoverResponse,
      delta,
    );
    const hover = hoverProgress.current;
    if (keyLight.current) {
      // The light circles the planet while hovered; each note speeds it up and brightens it,
      // so the motion follows the transmission blips.
      const energy = Math.min(1, blipLevels[0] + blipLevels[1] + blipLevels[2]);
      lightAngle.current += delta * C.lightHoverSpin * (1 + energy * 3) * hover;
      const [lx, ly, lz] = C.light.position;
      keyLight.current.position.set(
        lx + Math.cos(lightAngle.current) * C.lightHoverRadius * hover,
        ly + Math.sin(lightAngle.current) * C.lightHoverRadius * hover,
        lz,
      );
      keyLight.current.intensity = C.light.directional * (1 + energy * 0.25 * hover);
    }
    if (disk.current) {
      disk.current.scale.setScalar(
        v.diskScale * (1 + hover * (C.planetHoverDiskScale - 1)) * diskExpansion,
      );
    }
    if (planet.current && cursorTarget.current) {
      g?.updateMatrixWorld(true);
      planet.current.getWorldPosition(planetWorldPosition.current);
      planet.current.getWorldScale(planetWorldScale.current);
      planetNdc.current.copy(planetWorldPosition.current).project(camera);

      const bounds = gl.domElement.getBoundingClientRect();
      const centerX = bounds.left + ((planetNdc.current.x + 1) * bounds.width) / 2;
      const centerY = bounds.top + ((1 - planetNdc.current.y) * bounds.height) / 2;
      // The sticky stage is clipped; the hit area must not stay live outside it.
      const pointerInStage =
        centerX >= bounds.left && centerX <= bounds.right && centerY >= bounds.top && centerY <= bounds.bottom;
      cursorTarget.current.style.display = pointerInStage && entering.current.boom < 1 ? "" : "none";
      const distance = camera.position.distanceTo(planetWorldPosition.current);
      const radius = (C.sphereRadius * planetWorldScale.current.x * bounds.height) /
        (2 * distance * Math.tan(THREE.MathUtils.degToRad(C.fov) / 2));
      const diameter = radius * 2;
      cursorTarget.current.style.left = `${centerX - radius}px`;
      cursorTarget.current.style.top = `${centerY - radius}px`;
      cursorTarget.current.style.width = `${diameter}px`;
      cursorTarget.current.style.height = `${diameter}px`;
      cursorTarget.current.style.borderRadius = `${radius}px`;
    }
    diskUniforms.uTime.value = s.time;
    diskUniforms.uSpin.value = v.diskRotZ * DEG + s.disk;

    if (!readyFired.current) {
      readyFired.current = true;
      onReady?.();
    }
  });

  return (
    <>
      <ambientLight color={C.light.color} intensity={C.light.ambient} />
      <directionalLight ref={keyLight} color={C.light.color} intensity={C.light.directional} position={[...C.light.position]} />

      <group ref={group}>
        <group ref={planet} position={[0, 0, C.planetZ]}>
          <mesh>
            <sphereGeometry args={[C.sphereRadius, compact ? 64 : 124, compact ? 64 : 124]} />
            <meshStandardMaterial
              color={C.planetColor}
              map={albedo}
              normalMap={normal}
              normalScale={new THREE.Vector2(C.normalScale, C.normalScale)}
              roughnessMap={roughness}
              roughness={C.roughness}
              metalness={0}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        <group ref={clouds} position={[0, 0, C.planetZ]}>
          <mesh>
            <sphereGeometry args={[C.sphereRadius, compact ? 64 : 124, compact ? 64 : 124]} />
            <meshStandardMaterial
              color={C.cloudsColor}
              map={cloudsMap}
              roughness={0.5}
              metalness={0.8}
              side={THREE.DoubleSide}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>

        {orbitalScenes.map((orbitalModel, index) => (
          <group
            key={ORBIT_MODELS[index].src}
            ref={(node) => {
              modelOrbits.current[index] = node;
            }}
            position={[0, 0, C.planetZ]}
          >
            <group
              ref={(node) => {
                modelGroups.current[index] = node;
              }}
              position={[C.orbitRadius, 0, C.wDepth]}
              scale={orbitalModel.scale}
            >
              <primitive object={orbitalModel.scene} />
              <points
                geometry={orbitalModel.sparkleGeometry}
                material={sparkleMaterials[index]}
                renderOrder={C.wRenderOrder}
              />
            </group>
          </group>
        ))}

        <group ref={disk} scale={C.diskScale}>
          <mesh renderOrder={C.diskRenderOrder}>
            <planeGeometry args={[C.planeSize, C.planeSize]} />
            <shaderMaterial
              vertexShader={diskVertexShader}
              fragmentShader={diskFragmentShader}
              uniforms={diskUniforms}
              side={THREE.DoubleSide}
              transparent
              depthWrite={false}
            />
          </mesh>
        </group>

        <group ref={flare} visible={false}>
          <sprite ref={flareHalo} material={flareHaloMaterial} renderOrder={C.diskRenderOrder + 2} />
          <sprite ref={flareCore} material={flareCoreMaterial} renderOrder={C.diskRenderOrder + 3} />
        </group>
      </group>

      <points geometry={starGeometry} material={starMaterial} renderOrder={-10} frustumCulled={false} />
    </>
  );
}
