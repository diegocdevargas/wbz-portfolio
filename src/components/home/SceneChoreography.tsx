"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sceneStore } from "@/components/scene/sceneStore";
import type { SceneStateName } from "@/components/scene/sceneStates";

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP ScrollTrigger drives everything in the scene track, mirroring the live Framer
 * page:
 * - Scene states switch (time-based, 1 s) when a section's top reaches the top of the
 *   viewport, and switch back when scrolling up past it.
 * - On desktop, cards and headings are scrubbed between "scroll targets": a 50 vh
 *   trigger brings them in while it scrolls fully into view, and a cleanup trigger
 *   takes them out the same way.
 * - On phone there are no triggers; each block fades up (1 s) as it enters.
 * - Journey steps light their card once the step passes mid-screen.
 */
const SCENE_ORDER: SceneStateName[] = ["hero", "why", "features", "journey"];

// Live easing for appear effects: cubic-bezier(0, 0.58, 0.4, 1).
const APPEAR_EASE = "power2.out";

const FROM = {
  "from-right": { opacity: 0, x: 40, y: 0 },
  "from-left": { opacity: 0, x: -40, y: 0 },
  rise: { opacity: 0, x: 0, y: 40 },
  "rise-exit-up": { opacity: 0, x: 0, y: 40 },
} as const;

const EXIT = {
  "from-right": { opacity: 0, x: 40, y: 0 },
  "from-left": { opacity: 0, x: -40, y: 0 },
  rise: { opacity: 0, x: 0, y: 40 },
  "rise-exit-up": { opacity: 0, x: 0, y: -40 },
} as const;

type RevealKind = keyof typeof FROM;

/** Which show and cleanup trigger each reveal group follows. */
const GROUPS: Record<string, { show: string; clean: string }> = {
  why: { show: "why-show", clean: "why-clean" },
  "features-title": { show: "features-title-show", clean: "features-clean" },
  "features-content": { show: "features-content-show", clean: "features-clean" },
};

export function SceneChoreography() {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const track = anchor.current?.closest<HTMLElement>("[data-scene-track]");
    if (!track) return;
    track.setAttribute("data-choreo", "");

    const q = <T extends Element = HTMLElement>(sel: string) => Array.from(track.querySelectorAll<T & HTMLElement>(sel));
    const triggerEl = (name: string) => track.querySelector<HTMLElement>(`[data-trigger="${name}"]`);

    const ctx = gsap.context(() => {
      // Render only while the track is on screen.
      ScrollTrigger.create({
        trigger: track,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => sceneStore.setActive(self.isActive),
      });

      // Scene states.
      const sections = q("[data-scene-state]");
      const syncState = () => {
        let state: SceneStateName = "hero";
        for (const el of sections) {
          if (el.getBoundingClientRect().top <= 2) state = el.dataset.sceneState as SceneStateName;
        }
        sceneStore.setState(state);
      };
      sections.forEach((el) => {
        const name = el.dataset.sceneState as SceneStateName;
        const prev = SCENE_ORDER[SCENE_ORDER.indexOf(name) - 1] ?? "hero";
        ScrollTrigger.create({
          trigger: el,
          start: "top top+=2",
          onEnter: () => sceneStore.setState(name),
          onLeaveBack: () => sceneStore.setState(prev),
        });
      });
      syncState();

      // Journey steps.
      q("[data-journey-step]").forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: "center 55%",
          onEnter: () => step.setAttribute("data-visible", ""),
          onLeaveBack: () => step.removeAttribute("data-visible"),
        });
      });

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 810px) and (prefers-reduced-motion: no-preference)",
          phone: "(max-width: 809px) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { desktop } = context.conditions as { desktop: boolean; phone: boolean };

          if (desktop) {
            q("[data-reveal]").forEach((el) => {
              const kind = el.dataset.reveal as RevealKind;
              const group = GROUPS[el.dataset.revealGroup ?? ""];
              const show = group && triggerEl(group.show);
              const clean = group && triggerEl(group.clean);
              if (!show || !clean) return;
              // In: while the show trigger scrolls fully into view. Out: same for cleanup.
              gsap.fromTo(el, FROM[kind], {
                opacity: 1,
                x: 0,
                y: 0,
                ease: "none",
                immediateRender: true,
                scrollTrigger: { trigger: show, start: "top bottom", end: "bottom bottom", scrub: true },
              });
              gsap.fromTo(
                el,
                { opacity: 1, x: 0, y: 0 },
                {
                  ...EXIT[kind],
                  ease: "none",
                  immediateRender: false,
                  scrollTrigger: { trigger: clean, start: "top bottom", end: "bottom bottom", scrub: true },
                },
              );
            });
          } else {
            // Phone: per-block appear effects, replayed when scrolling back.
            const blocks = q(
              '[data-reveal]:not([data-reveal-group="features-content"]), [data-reveal-group="features-content"] [data-appear], #hero-section [data-appear]',
            );
            blocks.forEach((el) => {
              gsap.fromTo(
                el,
                { opacity: 0, y: 30, x: 0 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 1,
                  ease: APPEAR_EASE,
                  scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
                },
              );
            });
          }
        },
      );
    }, track);

    // Fonts and images change layout; re-measure once they settle.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
      track.removeAttribute("data-choreo");
      sceneStore.setState("hero");
    };
  }, []);

  return <span ref={anchor} hidden />;
}
