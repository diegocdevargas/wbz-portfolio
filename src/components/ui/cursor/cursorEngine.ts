"use client";

import { useEffect, useState, type RefObject } from "react";
import base from "./CursorBase.module.css";

/**
 * Shared plumbing for the cursor concepts: the fine-pointer gate, pointer tracking,
 * target detection and the rAF loop. Each concept only supplies a per-frame draw.
 */
export const CURSOR_TARGET = "[data-cursor-target]";

export type Spring = { value: number; velocity: number; target: number };
export const spring = (v: number): Spring => ({ value: v, velocity: 0, target: v });

/** Defaults match the reticle: stiffness 350, damping 25, mass 0.5. */
export function step(s: Spring, dt: number, stiffness = 350, damping = 25) {
  const force = stiffness * (s.target - s.value) - damping * s.velocity;
  s.velocity += (force / 0.5) * dt;
  s.value += s.velocity * dt;
}

export function jump(s: Spring, v: number) {
  s.value = s.target = v;
  s.velocity = 0;
}

export type CursorFrame = {
  dt: number;
  x: number;
  y: number;
  pressed: boolean;
  target: HTMLElement | null;
  /** First frame after the pointer enters the window: jump springs instead of easing in. */
  entered: boolean;
};

/** Called once when the cursor starts; returns the per-frame draw. */
export type CursorSetup = (el: HTMLDivElement) => (frame: CursorFrame) => void;

export function part(el: HTMLElement, name: string) {
  return el.querySelector<HTMLElement>(`[data-part="${name}"]`)!;
}

/** What clicking the target does, or null for targets that only frame content. */
export function actionLabel(t: HTMLElement): string | null {
  if (t.dataset.cursorLabel) return t.dataset.cursorLabel;
  if (t instanceof HTMLAnchorElement) {
    return t.target === "_blank" || t.href.startsWith("mailto:") ? "Open ↗" : "View";
  }
  if (t instanceof HTMLButtonElement || t.querySelector("button")) return "Click";
  return null;
}

export function useCursor(root: RefObject<HTMLDivElement | null>, setup: CursorSetup): boolean {
  const [enabled, setEnabled] = useState(false);

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

    const draw = setup(el);
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let pressed = false;
    let seen = false;
    let entered = false;
    let last = performance.now();
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (!seen) {
        seen = entered = true;
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
      const target = seen
        ? document.elementFromPoint(pointerX, pointerY)?.closest<HTMLElement>(CURSOR_TARGET) ?? null
        : null;
      draw({ dt, x: pointerX, y: pointerY, pressed, target, entered });
      entered = false;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.classList.add(base.hideNative);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove(base.hideNative);
    };
  }, [enabled, root, setup]);

  return enabled;
}
