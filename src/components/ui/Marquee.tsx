import type { CSSProperties, ReactNode } from "react";
import styles from "./Marquee.module.css";

type Props = {
  children: ReactNode;
  /** Accessible name for the list. */
  label: string;
  /** Seconds per loop. */
  speed?: number;
  reverse?: boolean;
  className?: string;
};

/**
 * Seamless CSS marquee with faded edges. The list renders twice; the copy is hidden from
 * assistive tech. Pauses on hover and stops under prefers-reduced-motion.
 */
export function Marquee({ children, label, speed = 30, reverse, className }: Props) {
  return (
    <div
      className={`${styles.marquee} ${className ?? ""}`}
      style={{ "--marquee-duration": `${speed}s` } as CSSProperties}
      data-reverse={reverse ? "" : undefined}
    >
      <div className={styles.track}>
        <ul className={styles.list} aria-label={label}>
          {children}
        </ul>
        <ul className={styles.list} aria-hidden="true">
          {children}
        </ul>
      </div>
    </div>
  );
}
