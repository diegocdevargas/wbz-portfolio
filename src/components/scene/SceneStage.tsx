"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { sceneStore } from "./sceneStore";
import styles from "./SceneStage.module.css";

const OrbitScene = dynamic(() => import("./OrbitScene"), { ssr: false });

/**
 * True only for hardware-accelerated WebGL. Software renderers (SwiftShader, llvmpipe: no
 * GPU, as on some old laptops and on PageSpeed's test machines) draw the scene on the CPU,
 * freezing the page for seconds, so they get the still frame instead.
 */
function hasFastWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const options: WebGLContextAttributes = { failIfMajorPerformanceCaveat: true };
    const gl = canvas.getContext("webgl2", options) ?? canvas.getContext("webgl", options);
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software/i.test(renderer);
  } catch {
    return false;
  }
}

/**
 * Run `cb` once the page has loaded and the main thread is idle, so the scene's ~1 MB of
 * script and textures never competes with first paint or hydration. Returns a cancel.
 */
function afterLoadIdle(cb: () => void) {
  let idle = 0;
  const schedule = () => {
    idle = window.requestIdleCallback
      ? window.requestIdleCallback(cb, { timeout: 1500 })
      : window.setTimeout(cb, 200);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
    else window.clearTimeout(idle);
  };
}

/**
 * Client wrapper for the sticky scene: picks WebGL or the still fallback, and tells the
 * scene whether to run its reduced-motion and phone variants. The still frame shows at
 * once; the WebGL scene mounts after load (see `afterLoadIdle`).
 */
export function SceneStage() {
  const [mode, setMode] = useState<"pending" | "webgl" | "still">("pending");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (!hasFastWebGL()) {
      setMode("still");
      sceneStore.markReady();
      return;
    }
    return afterLoadIdle(() => setMode("webgl"));
  }, []);

  useEffect(() => {
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
