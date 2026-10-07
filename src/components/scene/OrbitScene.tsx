"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import { sceneConstants as C, sceneStates, type SceneValues } from "./sceneStates";
import { sceneStore } from "./sceneStore";
import { diskFragmentShader, diskVertexShader } from "./diskShader";

const DEG = Math.PI / 180;

type Props = {
  reducedMotion: boolean;
  compact: boolean;
  onReady?: () => void;
};

/**
 * The Home WebGL scene: a textured planet with a luminous cloud shell, inside a
 * shader-driven accretion disk, lit by one violet key light. It animates toward the
 * state the scroll choreography puts in `sceneStore`, over 1 s eased in and out,
 * like the live Framer component.
 */
export default function OrbitScene({ reducedMotion, compact, onReady }: Props) {
  const [active, setActive] = useState(sceneStore.active);
  useEffect(() => sceneStore.subscribeActive(setActive), []);

  return (
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
      <Rig reducedMotion={reducedMotion} compact={compact} onReady={onReady} />
    </Canvas>
  );
}

function Rig({ reducedMotion, compact, onReady }: Props) {
  const camera = useThree((s) => s.camera);
  const group = useRef<THREE.Group>(null);
  const planet = useRef<THREE.Group>(null);
  const clouds = useRef<THREE.Group>(null);
  const disk = useRef<THREE.Group>(null);
  const spin = useRef({ planet: 0, clouds: 0, disk: 0, time: 0 });
  const values = useRef<SceneValues>({ ...sceneStates[sceneStore.state] });

  const [albedo, normal, roughness, cloudsMap] = useTexture(
    [
      "/textures/planet-albedo.png",
      "/textures/planet-normal.png",
      "/textures/planet-roughness.png",
      "/textures/planet-clouds.jpg",
    ],
    (textures) => {
      const list = Array.isArray(textures) ? textures : [textures];
      list[0].colorSpace = THREE.SRGBColorSpace;
      list[3].colorSpace = THREE.SRGBColorSpace;
    },
  );

  const diskUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uVal: { value: 0.17 },
      uVal3: { value: 1 },
      uOctaves: { value: compact ? 2 : 3 },
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

  useFrame((_, delta) => {
    const v = values.current;
    const s = spin.current;
    // Framer advances its angles per frame; scale by real time so speed is fps-independent.
    const frames = reducedMotion ? 0 : Math.min(delta, 0.1) * 60;
    s.planet -= v.planetSpin * frames;
    s.clouds -= v.cloudsSpin * frames;
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
      planet.current.scale.setScalar(v.planetScale);
      planet.current.rotation.set(0, v.planetRotY * DEG + s.planet, 0);
    }
    if (clouds.current) {
      clouds.current.scale.setScalar(v.cloudsScale);
      clouds.current.rotation.set(0, v.planetRotY * DEG + s.clouds, 0);
    }
    if (disk.current) {
      disk.current.position.set(v.diskX, v.diskY, C.diskZ);
      disk.current.rotation.set(C.diskRotX * DEG, C.diskRotY * DEG, v.diskRotZ * DEG + s.disk);
    }
    diskUniforms.uTime.value = s.time;

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

        <group ref={disk} scale={C.diskScale}>
          <mesh>
            <planeGeometry args={[C.planeSize, C.planeSize]} />
            <shaderMaterial
              vertexShader={diskVertexShader}
              fragmentShader={diskFragmentShader}
              uniforms={diskUniforms}
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
        </group>
      </group>
    </>
  );
}
