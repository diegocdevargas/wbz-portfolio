"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One-time reveals for the sections after the 3D scene, as on the live site:
 * `data-fade="blur"` (headings: blur 10px, 60 px rise), `data-fade="up"` (16 px rise),
 * and `data-fade-stagger` (children rise 16 px, 80 ms apart). Elements start hidden
 * only once this script runs, so content is never lost without JavaScript.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-fade], [data-fade-stagger]"));
    const fresh = targets.filter((el) => !el.hasAttribute("data-in"));
    // Anything already on screen (or above it) shows at once.
    fresh.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.85) el.setAttribute("data-in", "");
    });
    root.setAttribute("data-reveal-ready", "");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-in", "");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );
    fresh.filter((el) => !el.hasAttribute("data-in")).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
