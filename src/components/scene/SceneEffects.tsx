"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";

const ABERRATION = new THREE.Vector2(0.0007, 0.0007);

/**
 * Desktop-only finish: the disk's over-bright gas and photon ring bloom, then ACES maps it
 * down. A separate chunk, so phones never download the post-processing library.
 */
export default function SceneEffects() {
  const gl = useThree((s) => s.gl);
  // Draw an opaque black backdrop while the effects run (the page behind is black too), so
  // the bloom glows over it instead of fading out with the alpha.
  useEffect(() => {
    gl.setClearColor(0x000000, 1);
    return () => gl.setClearColor(0x000000, 0);
  }, [gl]);

  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.2} intensity={0.9} radius={0.7} />
      <ChromaticAberration offset={ABERRATION} radialModulation modulationOffset={0.35} />
      <Vignette offset={0.3} darkness={0.6} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
