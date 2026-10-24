"use client";

import { useEffect, useState } from "react";
import { sceneStore } from "./sceneStore";
import styles from "./PlanetHint.module.css";

/** Decorative nudge on the hero scene: a trail of dots leading up to the planet. */
export function PlanetHint({ label }: { label: string }) {
  const [visible, setVisible] = useState(sceneStore.state === "hero" && sceneStore.active);

  useEffect(() => {
    const sync = () => setVisible(sceneStore.state === "hero" && sceneStore.active);
    sync();
    const offState = sceneStore.subscribe(sync);
    const offActive = sceneStore.subscribeActive(sync);
    return () => {
      offState();
      offActive();
    };
  }, []);

  return (
    <div className={styles.hint} data-planet-hint data-visible={visible || undefined} aria-hidden="true">
      <span className={styles.dots}>
        <i />
        <i />
        <i />
      </span>
      <span className={styles.text}>{label}</span>
    </div>
  );
}
