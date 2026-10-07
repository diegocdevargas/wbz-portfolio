"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let instance: Lenis | null = null;
/** Set by back/forward, where Next restores the old scroll position itself. */
let historyNavigation = false;

/**
 * The element a "#id" link should land on. On phones the home page's scroll-trigger
 * markers are hidden (no box to scroll to), so fall back to the nearest earlier sibling
 * that is laid out, which is that section's content.
 */
function anchorTarget(hash: string): HTMLElement | null {
  const found = document.getElementById(decodeURIComponent(hash.slice(1)));
  let el: Element | null = found;
  while (el && el.getClientRects().length === 0) el = el.previousElementSibling;
  return (el as HTMLElement | null) ?? found;
}

/** The live site scrolls with Lenis; stop/start it while overlays lock the page. */
export const smoothScroll = {
  stop: () => instance?.stop(),
  start: () => instance?.start(),
  /** Scroll to a "#id" target, gliding unless `immediate` (or Lenis is off). */
  toHash: (hash: string, immediate = false) => {
    const el = anchorTarget(hash);
    if (!el) return;
    if (instance) instance.scrollTo(el, { immediate, force: true });
    else el.scrollIntoView({ block: "start" });
  },
};

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and the scene read
 * the same scroll position each frame. Off for reduced motion; touch scrolling stays
 * native (Lenis default).
 *
 * Each new page opens at the top. Lenis keeps its own scroll target, so a link clicked
 * mid-glide (or from far down the tall home page) would otherwise keep easing toward the
 * old position on the new, shorter page and land at its bottom.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    const onPop = () => {
      historyNavigation = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const first = firstRender.current;
    firstRender.current = false;
    if (historyNavigation) {
      historyNavigation = false;
      return;
    }
    // Links like "/#faq-section" land on their section. The browser and Next try this
    // themselves, but can't reach the markers that are hidden on phones.
    const hash = window.location.hash;
    if (hash) {
      requestAnimationFrame(() => smoothScroll.toHash(hash, true));
      return;
    }
    if (first) return;
    instance?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname]);

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
