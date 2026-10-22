"use client";

import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { sceneConstants as C, sceneStates, type SceneValues } from "./sceneStates";
import { sceneStore } from "./sceneStore";
import { diskFragmentShader, diskVertexShader } from "./diskShader";

const DEG = Math.PI / 180;
const W_MODEL = "/models/orbiting-w.gltf";

const SceneEffects = lazy(() => import("./SceneEffects"));

const TEXTURES = [
  "/textures/planet-albedo.webp",
  "/textures/planet-normal.webp",
  "/textures/planet-roughness.png",
  "/textures/planet-clouds.webp",
];

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
};

type RigProps = Omit<Props, "locale" | "projectsLabel"> & {
  cursorTarget: React.RefObject<HTMLAnchorElement | null>;
  entering: React.RefObject<{ progress: number }>;
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
export default function OrbitScene({ reducedMotion, compact, onReady, projectsLabel }: Props) {
  const [active, setActive] = useState(sceneStore.active);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const cursorTarget = useRef<HTMLAnchorElement>(null);
  const entering = useRef({ progress: 0 });
  const navigating = useRef(false);
  const projectsHref = "/cases";

  useEffect(() => sceneStore.subscribeActive(setActive), []);

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
      onComplete: () => window.location.assign(projectsHref),
    });
    const pageContent = document.querySelectorAll<HTMLElement>(
      [
        "header",
        ".skip-link",
        "footer",
        "#main > :not([data-scene-track])",
        '[data-scene-track] > #hero-section',
        "[data-scene-track] > [data-scene-state]",
        "[data-scene-track] > #journey-section",
        "[data-site-cursor]",
      ].join(", "),
    );
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
            style={{ position: "fixed", zIndex: 99, pointerEvents: "auto" }}
          />,
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
  const orbit = useRef<THREE.Group>(null);
  const w = useRef<THREE.Group>(null);
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
  const values = useRef<SceneValues>({ ...sceneStates[sceneStore.state] });

  const [albedo, normal, roughness, cloudsMap] = useLoader(THREE.TextureLoader, TEXTURES);
  albedo.colorSpace = THREE.SRGBColorSpace;
  cloudsMap.colorSpace = THREE.SRGBColorSpace;

  const model = useLoader(GLTFLoader, W_MODEL);
  const wScene = useMemo(() => {
    const scene = model.scene.clone(true);
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
      const opaqueMaterials = meshMaterials.map((material) => {
        const clone = material.clone();
        if (clone instanceof THREE.MeshPhysicalMaterial) {
          clone.transmission = 0;
          clone.transparent = true;
          clone.opacity = 1;
          clone.emissive.set(C.wEmissive);
          clone.emissiveIntensity = C.wEmissiveIntensity;
          clone.needsUpdate = true;
        }
        return clone;
      });
      object.material = Array.isArray(object.material) ? opaqueMaterials : opaqueMaterials[0];
      object.renderOrder = C.wRenderOrder;
    });
    return scene;
  }, [model.scene]);
  const wScale = useMemo(() => {
    const bounds = new THREE.Box3().setFromObject(wScene);
    const radius = bounds.getBoundingSphere(new THREE.Sphere()).radius;
    if (!Number.isFinite(radius) || radius <= 0) {
      throw new Error(`Orbiting W model at ${W_MODEL} has invalid bounds`);
    }
    return (C.wRadius / radius) * C.wScale;
  }, [wScene]);
  const wMaterials = useMemo(() => {
    const materials: THREE.MeshPhysicalMaterial[] = [];
    wScene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
      materials.push(
        ...meshMaterials.filter(
          (material): material is THREE.MeshPhysicalMaterial => material instanceof THREE.MeshPhysicalMaterial,
        ),
      );
    });
    return materials;
  }, [wScene]);

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

  // Tween toward each new state, like Framer's variant transition.
  useEffect(() => {
    const target = values.current;
    const go = (name: typeof sceneStore.state) => {
      gsap.killTweensOf(target);
      if (reducedMotion) Object.assign(target, sceneStates[name]);
      else gsap.to(target, { ...sceneStates[name], duration: C.transition, ease: "power1.inOut" });
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
    if (orbit.current) {
      orbit.current.position.set(v.diskX * transition, v.diskY * transition, C.planetZ);
      orbit.current.scale.setScalar(v.planetScale * planetScale);
      const orbitWobble = Math.sin(s.time * C.orbitOscillationSpeed) * C.orbitOscillationAmplitude;
      orbit.current.rotation.set((C.orbitTiltX + orbitWobble) * DEG, C.orbitTiltY * DEG, s.orbit);
    }
    if (w.current) w.current.rotation.y = s.w;
    if (disk.current) {
      disk.current.position.set(v.diskX, v.diskY, C.diskZ);
      disk.current.rotation.set(C.diskRotX * DEG, C.diskRotY * DEG, v.diskRotZ * DEG + s.disk);
    }
    if (pointerActive.current) {
      g?.updateMatrixWorld(true);
      raycaster.current.setFromCamera(pointer.current, camera);
      const firstHit = planet.current ? raycaster.current.intersectObjects([planet.current], true)[0]?.object : undefined;
      planetHovered.current = firstHit !== undefined && planet.current?.getObjectById(firstHit.id) !== undefined;
    } else {
      planetHovered.current = false;
    }
    hoverProgress.current = THREE.MathUtils.damp(
      hoverProgress.current,
      planetHovered.current ? 1 : 0,
      C.planetHoverResponse,
      delta,
    );
    const hover = hoverProgress.current;
    if (w.current) {
      w.current.scale.setScalar(wScale * (1 + hover * (C.planetHoverWScale - 1)));
    }
    for (const material of wMaterials) {
      material.emissiveIntensity = THREE.MathUtils.damp(
        material.emissiveIntensity,
        C.wEmissiveIntensity + hover * C.planetHoverWGlow,
        C.planetHoverResponse,
        delta,
      );
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
      const distance = camera.position.distanceTo(planetWorldPosition.current);
      const radius = (C.sphereRadius * planetWorldScale.current.x * bounds.height) /
        (2 * distance * Math.tan(THREE.MathUtils.degToRad(C.fov) / 2));
      const diameter = radius * 2;
      cursorTarget.current.style.left = `${bounds.left + ((planetNdc.current.x + 1) * bounds.width) / 2 - radius}px`;
      cursorTarget.current.style.top = `${bounds.top + ((1 - planetNdc.current.y) * bounds.height) / 2 - radius}px`;
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
      <directionalLight color={C.light.color} intensity={C.light.directional} position={[...C.light.position]} />

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
              metalness={0}
              side={THREE.DoubleSide}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>

        <group ref={orbit} position={[0, 0, C.planetZ]}>
          <group ref={w} position={[C.orbitRadius, 0, C.wDepth]} scale={wScale}>
            <primitive object={wScene} />
          </group>
        </group>

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
      </group>
    </>
  );
}
