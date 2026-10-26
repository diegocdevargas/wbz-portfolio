"use client";

import { useCallback, useRef } from "react";
import { useScrollProgress } from "./useScrollProgress";
import styles from "./ParallaxShape.module.css";

/**
 * A decorative cluster of geometric figures (square, circle, triangle) that drift and turn at
 * different speeds as the page scrolls. Only transforms change; with reduced motion the figures
 * stay still.
 */
export function ParallaxShape({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  const apply = useCallback((progress: number) => {
    for (const layer of root.current?.querySelectorAll<HTMLElement>("[data-speed]") ?? []) {
      const speed = Number(layer.dataset.speed);
      const turn = Number(layer.dataset.turn ?? 0);
      layer.style.transform = `translate3d(0, ${(progress * speed * 120).toFixed(1)}px, 0) rotate(${(progress * turn * 90).toFixed(1)}deg)`;
    }
  }, []);
  useScrollProgress(root, apply);

  return (
    <div ref={root} className={className ? `${styles.shape} ${className}` : styles.shape} aria-hidden="true">
      <span className={`${styles.layer} ${styles.square}`} data-speed="1" data-turn="1" />
      <span className={`${styles.layer} ${styles.circle}`} data-speed="-0.6" />
      <span className={`${styles.layer} ${styles.triangle}`} data-speed="1.6" data-turn="-1" />
    </div>
  );
}
