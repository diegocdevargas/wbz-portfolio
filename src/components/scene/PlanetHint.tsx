"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { sceneStore } from "./sceneStore";
import styles from "./PlanetHint.module.css";

/** Decorative nudge on the hero scene: a trail of dots leading up to the planet. */
export function PlanetHint({ label, or, scroll }: { label: string; or: string; scroll: string }) {
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

  const wheel = useRef<SVGPathElement>(null);
  const ring1 = useRef<SVGCircleElement>(null);
  const ring2 = useRef<SVGCircleElement>(null);
  const arrow = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = wheel.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.35 });
    tl.fromTo(el, { y: -1.5, opacity: 0 }, { opacity: 1, duration: 0.35, ease: "sine.out" }, 0)
      .to(el, { y: 5.5, duration: 1.1, ease: "sine.inOut" }, 0)
      .to(el, { opacity: 0, duration: 0.4, ease: "sine.in" }, 0.75);

    const rings = [ring1.current, ring2.current];
    const arrowEl = arrow.current;
    const click = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
    if (arrowEl) {
      click
        .to(arrowEl, { x: 1, y: 1, duration: 0.12, ease: "sine.in" }, 0)
        .to(arrowEl, { x: 0, y: 0, duration: 0.35, ease: "back.out(2)" }, 0.12);
    }
    // The click ripple spreads wider on desktop, where the hint sits further from the eye.
    const reach = window.matchMedia("(min-width: 810px)").matches ? 10 : 7.5;
    rings.forEach((ring, i) => {
      if (!ring) return;
      click.fromTo(
        ring,
        { attr: { r: 0.5 }, opacity: 1 },
        { attr: { r: reach }, opacity: 0, duration: 0.85, ease: "sine.out" },
        0.1 + i * 0.2,
      );
    });
    gsap.set(rings, { opacity: 0 });

    return () => {
      tl.kill();
      click.kill();
    };
  }, []);

  return (
    <div className={styles.hint} data-planet-hint data-visible={visible || undefined} aria-hidden="true">
      <span className={styles.dots}>
        <i />
        <i />
        <i />
      </span>
      <span className={styles.text}>
        <svg className={styles.icon} viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" overflow="visible">
          <circle ref={ring1} className={styles.ring} cx="5" cy="3" r="0.5" strokeWidth="1.5" opacity="0" />
          <circle ref={ring2} className={styles.ring} cx="5" cy="3" r="0.5" strokeWidth="1.1" opacity="0" />
          <path ref={arrow} d="M5 3l14 8-6.5 2L10 19.5z" />
        </svg>
        {label}
      </span>
      <span className={styles.text}>
        {or}
        <svg className={styles.icon} viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
          <rect x="7" y="2" width="10" height="20" rx="5" />
          <path ref={wheel} d="M12 6.5v3.5" />
        </svg>
        {scroll}
      </span>
    </div>
  );
}
