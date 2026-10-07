"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Cursor.module.css";

/**
 * The live site's reticle cursor (desktop, fine pointer only): a 4 px dot and four
 * corner brackets that spin once every 2 s and follow the pointer on a spring. Over a
 * `[data-cursor-target]` the brackets stop at the nearest right angle and frame the
 * element with 6 px to spare. Pressing shrinks it slightly. `mix-blend-mode:
 * difference` keeps it visible on both black and violet. Values from the live
 * component: bracket 10 px, thickness 2 px, resting gap 16 px, snap 0.2 s ease-out.
 */
const SELECTOR = "[data-cursor-target]";
const BRACKET = 10;
const GAP = 16;
const REST = BRACKET * 2 + GAP;
const TURN_SECONDS = 2;
const SNAP_SECONDS = 0.2;
const PAD = 12;

type Spring = { value: number; velocity: number; target: number };
const spring = (v: number): Spring => ({ value: v, velocity: 0, target: v });

// Live spring: stiffness 350, damping 25, mass 0.5.
function step(s: Spring, dt: number) {
  const force = 350 * (s.target - s.value) - 25 * s.velocity;
  s.velocity += (force / 0.5) * dt;
  s.value += s.velocity * dt;
}

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const sync = () => setEnabled(fine.matches);
    sync();
    fine.addEventListener("change", sync);
    return () => fine.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = root.current;
    if (!el) return;

    const x = spring(window.innerWidth / 2);
    const y = spring(window.innerHeight / 2);
    const ox = spring(0);
    const oy = spring(0);
    const w = spring(REST);
    const h = spring(REST);
    let pointerX = x.value;
    let pointerY = y.value;
    let angle = 0;
    let snapped = false;
    let snapFrom = 0;
    let snapTo = 0;
    let snapT = 1;
    let pressed = false;
    let seen = false;
    let last = performance.now();
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointerX = x.target = e.clientX;
      pointerY = y.target = e.clientY;
      if (!seen) {
        seen = true;
        x.value = pointerX;
        y.value = pointerY;
        el.dataset.visible = "";
      }
    };
    const onDown = () => (pressed = true);
    const onUp = () => (pressed = false);
    const onLeave = () => {
      seen = false;
      delete el.dataset.visible;
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      const target = seen ? document.elementFromPoint(pointerX, pointerY)?.closest<HTMLElement>(SELECTOR) : null;
      if (target) {
        const r = target.getBoundingClientRect();
        if (!snapped) {
          snapped = true;
          snapFrom = angle;
          snapTo = Math.round(angle / 90) * 90;
          snapT = 0;
        }
        const quarter = Math.abs(snapTo % 180) === 90;
        const tw = r.width + PAD;
        const th = r.height + PAD;
        w.target = quarter ? th : tw;
        h.target = quarter ? tw : th;
        ox.target = r.left + r.width / 2 - pointerX;
        oy.target = r.top + r.height / 2 - pointerY;
      } else {
        snapped = false;
        w.target = h.target = REST;
        ox.target = oy.target = 0;
      }

      if (snapped) {
        snapT = Math.min(1, snapT + dt / SNAP_SECONDS);
        const eased = 1 - (1 - snapT) * (1 - snapT);
        angle = snapFrom + (snapTo - snapFrom) * eased;
      } else {
        angle = (angle + (360 * dt) / TURN_SECONDS) % 360;
      }

      for (const s of [x, y, ox, oy, w, h]) step(s, dt);

      el.style.transform = `translate3d(${x.value}px, ${y.value}px, 0)`;
      if (dot.current) dot.current.style.transform = `translate(-50%, -50%) scale(${pressed ? 0.8 : 1})`;
      if (frame.current) {
        const scale = pressed ? (snapped ? 0.92 : 0.8) : 1;
        frame.current.style.transform = `translate(${ox.value}px, ${oy.value}px) rotate(${angle}deg) scale(${scale})`;
      }
      if (box.current) {
        box.current.style.width = `${w.value}px`;
        box.current.style.height = `${h.value}px`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.classList.add(styles.hideNative);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove(styles.hideNative);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={root} className={styles.cursor} aria-hidden="true">
      <div ref={dot} className={styles.dot} />
      <div ref={frame} className={styles.frame}>
        <div ref={box} className={styles.box}>
          <span className={styles.tl} />
          <span className={styles.tr} />
          <span className={styles.br} />
          <span className={styles.bl} />
        </div>
      </div>
    </div>
  );
}
