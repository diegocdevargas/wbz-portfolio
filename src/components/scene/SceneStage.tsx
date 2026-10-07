"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { sceneStore } from "./sceneStore";
import styles from "./SceneStage.module.css";

const OrbitScene = dynamic(() => import("./OrbitScene"), { ssr: false });

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Client wrapper for the sticky scene: picks WebGL or the still fallback, and tells
 * the scene whether to run its reduced-motion and phone variants.
 */
export function SceneStage() {
  const [mode, setMode] = useState<"pending" | "webgl" | "still">("pending");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const webgl = hasWebGL();
    setMode(webgl ? "webgl" : "still");
    if (!webgl) sceneStore.markReady();

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const phone = window.matchMedia("(max-width: 809px)");
    const sync = () => {
      setReducedMotion(motion.matches);
      setCompact(phone.matches);
    };
    sync();
    motion.addEventListener("change", sync);
    phone.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      phone.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div className={styles.stage} data-mode={mode}>
      {mode === "still" && <div className={styles.still} />}
      {mode === "webgl" && (
        <OrbitScene reducedMotion={reducedMotion} compact={compact} onReady={sceneStore.markReady} />
      )}
      <div className={styles.overlay} />
    </div>
  );
}
