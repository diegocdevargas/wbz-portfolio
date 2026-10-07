"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let instance: Lenis | null = null;

/** The live site scrolls with Lenis; stop/start it while overlays lock the page. */
export const smoothScroll = {
  stop: () => instance?.stop(),
  start: () => instance?.start(),
};

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and the scene read
 * the same scroll position each frame. Off for reduced motion; touch scrolling stays
 * native (Lenis default).
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const lenis = new Lenis({ autoRaf: false, anchors: true });
    instance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
