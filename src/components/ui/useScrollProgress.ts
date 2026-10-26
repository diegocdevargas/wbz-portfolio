"use client";

import { useEffect, type RefObject } from "react";

/**
 * Calls `apply(progress)` while `ref` is on screen, once per animation frame of scroll.
 * `progress` is -1 when the element enters at the bottom of the viewport, 0 when it is centred
 * and +1 when it leaves at the top. Does nothing with reduced motion.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, apply: (progress: number) => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      apply((window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          update();
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll);
        } else {
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
        }
      },
      { rootMargin: "20% 0px" },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, apply]);
}
