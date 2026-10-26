"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { useScrollProgress } from "./useScrollProgress";
import styles from "./ParallaxFloat.module.css";

type Props = {
  children: ReactNode;
  /** Distance in px the content travels from one end of the scroll to the other. */
  travel?: number;
};

/**
 * Fills its positioned parent and moves its content up or down relative to the scroll, so it
 * seems to float in front of the page. The layer is taller than its parent by `travel` on each
 * side, so the content never reveals an empty edge while it moves. Only a transform changes.
 * With reduced motion it stays in place.
 */
export function ParallaxFloat({ children, travel = 80 }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  const apply = useCallback(
    (progress: number) => {
      if (layer.current) layer.current.style.transform = `translate3d(0, ${(progress * travel).toFixed(1)}px, 0)`;
    },
    [travel],
  );
  useScrollProgress(frame, apply);

  return (
    <div ref={frame} className={styles.frame}>
      <div ref={layer} className={styles.layer} style={{ top: -travel, bottom: -travel }}>
        {children}
      </div>
    </div>
  );
}
