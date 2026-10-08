"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
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

/** Playback rate while hovered, and how long the change in speed takes. */
const HOVER_RATE = 0.25;
const EASE_MS = 600;

/**
 * Seamless CSS marquee with faded edges. The list repeats as many times as it takes to
 * cover the container plus one loop, so wide screens never see a gap; the copies are
 * hidden from assistive tech. Slows down on hover and stops under prefers-reduced-motion.
 */
export function Marquee({ children, label, speed = 30, reverse, className }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLUListElement>(null);
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const el = root.current;
    const list = first.current;
    if (!el || !list) return;
    const measure = () => {
      const w = list.offsetWidth;
      if (w) setCopies(Math.max(2, Math.ceil(el.clientWidth / w) + 1));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    // Ease the playback rate instead of pausing; setting it keeps the current position.
    const easeTo = (to: number) => {
      const anim = track.current?.getAnimations()[0];
      if (!anim) return;
      cancelAnimationFrame(raf);
      const from = anim.playbackRate;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / EASE_MS);
        anim.playbackRate = from + (to - from) * (1 - (1 - t) ** 3);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const slow = () => easeTo(HOVER_RATE);
    const resume = () => easeTo(1);
    el.addEventListener("mouseenter", slow);
    el.addEventListener("mouseleave", resume);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", slow);
      el.removeEventListener("mouseleave", resume);
    };
  }, []);

  return (
    <div
      ref={root}
      className={`${styles.marquee} ${className ?? ""}`}
      style={
        {
          "--marquee-duration": `${speed}s`,
          "--marquee-shift": `${-100 / copies}%`,
        } as CSSProperties
      }
      data-reverse={reverse ? "" : undefined}
    >
      <div ref={track} className={styles.track}>
        <ul ref={first} className={styles.list} aria-label={label}>
          {children}
        </ul>
        {Array.from({ length: copies - 1 }, (_, i) => (
          <ul key={i} className={styles.list} aria-hidden="true">
            {children}
          </ul>
        ))}
      </div>
    </div>
  );
}
