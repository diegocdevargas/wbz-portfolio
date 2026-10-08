"use client";

import { useRef } from "react";
import { actionLabel, jump, part, spring, step, useCursor, type CursorSetup } from "./cursorEngine";
import base from "./CursorBase.module.css";
import styles from "./CoordsCursor.module.css";

/**
 * The site cursor, "Coordinates": two viewport-wide hairlines cross at the pointer with a
 * mono X/Y readout beside it. Over a `[data-cursor-target]` the hairlines fade, a 1 px box
 * frames the element and the readout names the action (or the element's size when it
 * has none). Set `data-cursor-label` on a target to override the inferred action.
 * The other concepts tried (reticle, orbit, lens) are kept in docs/cursor-concepts.md.
 */
const PAD = 8;
const READOUT_W = 130;

const pad4 = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");

const setup: CursorSetup = (el) => {
  const h = part(el, "h");
  const v = part(el, "v");
  const dot = part(el, "dot");
  const box = part(el, "box");
  const readout = part(el, "readout");

  const x = spring(0);
  const y = spring(0);
  const bx = spring(0);
  const by = spring(0);
  const bw = spring(0);
  const bh = spring(0);
  const rx = spring(0);
  const ry = spring(0);
  let framed = false;
  let text = "";

  const write = (t: string) => {
    if (t === text) return;
    text = t;
    readout.textContent = t;
  };

  return (f) => {
    if (f.entered) {
      for (const s of [x, bx, rx]) jump(s, f.x);
      for (const s of [y, by, ry]) jump(s, f.y);
    }
    x.target = f.x;
    y.target = f.y;

    if (f.target) {
      const r = f.target.getBoundingClientRect();
      bx.target = r.left - PAD;
      by.target = r.top - PAD;
      bw.target = r.width + PAD * 2;
      bh.target = r.height + PAD * 2;
      rx.target = bx.target;
      // Above the box, or below it when the box touches the top of the viewport.
      ry.target = by.target >= 24 ? by.target - 20 : by.target + bh.target + 6;
      write(actionLabel(f.target) ?? `${Math.round(r.width)} × ${Math.round(r.height)}`);
      if (!framed) {
        framed = true;
        el.dataset.framed = "";
      }
    } else {
      bx.target = f.x;
      by.target = f.y;
      bw.target = bh.target = 0;
      rx.target = f.x + 16 > window.innerWidth - READOUT_W ? f.x - READOUT_W : f.x + 16;
      ry.target = f.y + 16 > window.innerHeight - 24 ? f.y - 28 : f.y + 16;
      write(`X ${pad4(f.x)} · Y ${pad4(f.y)}`);
      if (framed) {
        framed = false;
        delete el.dataset.framed;
      }
    }

    for (const s of [x, y, bx, by, bw, bh, rx, ry]) step(s, f.dt);

    h.style.transform = `translate3d(0, ${y.value}px, 0)`;
    v.style.transform = `translate3d(${x.value}px, 0, 0)`;
    dot.style.transform = `translate3d(${x.value}px, ${y.value}px, 0) translate(-50%, -50%) scale(${f.pressed ? 2 : 1})`;
    box.style.transform = `translate3d(${bx.value}px, ${by.value}px, 0)`;
    box.style.width = `${Math.max(0, bw.value)}px`;
    box.style.height = `${Math.max(0, bh.value)}px`;
    readout.style.transform = `translate3d(${rx.value}px, ${ry.value}px, 0)`;
  };
};

export function CoordsCursor() {
  const root = useRef<HTMLDivElement>(null);
  const enabled = useCursor(root, setup);
  if (!enabled) return null;

  return (
    <div ref={root} className={base.root} aria-hidden="true">
      <div data-part="h" className={styles.h} />
      <div data-part="v" className={styles.v} />
      <div data-part="box" className={styles.box} />
      <div data-part="dot" className={styles.dot} />
      <div data-part="readout" className={styles.readout} />
    </div>
  );
}
