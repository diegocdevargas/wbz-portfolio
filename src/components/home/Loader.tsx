"use client";

import { useEffect, useState } from "react";
import { sceneStore } from "@/components/scene/sceneStore";
import styles from "./Loader.module.css";

const SAFETY_TIMEOUT = 2500;

// Only the first visit in a session shows it; client-side returns to Home skip it.
let lifted = false;

/**
 * Home loader, as on the live site: black screen, wordmark, a thin orbiting indicator
 * and "Preparando a órbita". It lifts once fonts and the first scene frame are ready,
 * or after 2.5 s. The page is server-rendered underneath, so nothing waits on it.
 */
export function Loader({ caption }: { caption: string }) {
  const [state, setState] = useState<"shown" | "leaving" | "gone">(() => (lifted ? "gone" : "shown"));

  useEffect(() => {
    if (lifted) return;
    let done = false;
    let leaveTimer = 0;
    const lift = () => {
      if (done) return;
      done = true;
      lifted = true;
      setState("leaving");
      leaveTimer = window.setTimeout(() => setState("gone"), 600);
    };
    let fontsReady = false;
    let sceneReady = false;
    const check = () => fontsReady && sceneReady && lift();
    document.fonts?.ready.then(() => {
      fontsReady = true;
      check();
    });
    const off = sceneStore.onReady(() => {
      sceneReady = true;
      check();
    });
    const safety = window.setTimeout(lift, SAFETY_TIMEOUT);
    return () => {
      off();
      window.clearTimeout(safety);
      window.clearTimeout(leaveTimer);
    };
  }, []);

  if (state === "gone") return null;

  return (
    <div className={styles.loader} data-state={state} role="status" aria-live="polite">
      <p className={styles.logo} aria-hidden="true">
        Webcraftz
      </p>
      <span className={styles.orbit} aria-hidden="true">
        <span className={styles.dot} />
      </span>
      <p className={styles.caption}>{caption}</p>
    </div>
  );
}
