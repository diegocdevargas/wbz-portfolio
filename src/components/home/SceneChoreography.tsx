"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sceneStore } from "@/components/scene/sceneStore";
import { playSceneChord } from "@/components/ui/menuChord";
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
 * - On phone, headings fade up (1 s) as they enter and every box (why, services, journey)
 *   lights up with its own chord once it passes mid-screen.
 * - Journey steps light their card once the step passes mid-screen.
 */
const SCENE_ORDER: SceneStateName[] = ["hero", "why", "features", "journey"];

// Live easing for appear effects: cubic-bezier(0, 0.58, 0.4, 1).
const APPEAR_EASE = "power2.out";
const snapEase = (progress: number) => progress * progress * (3 - 2 * progress);

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

    // Scroll-synced cues: ignore the initial layout/restore pass and throttle bursts from fast scrolls.
    const mountedAt = performance.now();
    let lastCue = 0;
    const settled = () => {
      const now = performance.now();
      if (now - mountedAt < 1200 || now - lastCue < 140) return false;
      lastCue = now;
      return true;
    };
    // Lights a box's border and keeps it on; the delay matches its chord.
    const light = (el: HTMLElement | undefined, delay = 0) => {
      if (!el) return;
      gsap.delayedCall(delay, () => el.setAttribute("data-lit", ""));
    };
    const unlight = (el: HTMLElement) => {
      el.removeAttribute("data-lit");
      el.querySelectorAll("[data-lit]").forEach((child) => child.removeAttribute("data-lit"));
    };
    const cueReveal = (el: HTMLElement) => {
      const group = el.dataset.revealGroup;
      // The four cards complete together, so only the first one cues the whole run. Checked before
      // the throttle so the (silent) heading finishing at the same moment can't swallow it.
      const count = group === "why" && el.dataset.index === "0" ? 4 : group === "features-content" ? 6 : 0;
      if (!count || !settled()) return;
      const section = group === "why" ? 0 : 1;
      const cards = q(group === "why" ? '[data-reveal-group="why"][data-index]' : '[data-reveal-group="features-content"] [data-appear]');
      for (let i = 0; i < count; i += 1) {
        playSceneChord(section, i, i * 0.14);
        light(cards[i], i * 0.14);
      }
    };

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
      q("[data-journey-step]").forEach((step, stepIndex) => {
        ScrollTrigger.create({
          trigger: step,
          start: "center 55%",
          onEnter: () => {
            step.setAttribute("data-visible", "");
            if (settled()) playSceneChord(2, stepIndex);
          },
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
            const snapTargets = q(
              "#hero-section, [data-scene-state='why'], #journey-content",
            );
            // The features grid is fully revealed once its show trigger's bottom reaches the viewport bottom.
            const featuresContentTrigger = triggerEl("features-content-show");
            ScrollTrigger.create({
              trigger: track,
              start: "top top",
              end: "bottom bottom",
              snap: {
                snapTo: (progress, self) => {
                  if (!self) return progress;
                  const range = self.end - self.start;
                  if (range <= 0) return progress;
                  const toProgress = (scrollY: number) => gsap.utils.clamp(0, 1, (scrollY - self.start) / range);
                  const stops = [
                    0,
                    1,
                    ...snapTargets.map((target) => {
                      const center = window.scrollY + target.getBoundingClientRect().top + target.offsetHeight / 2;
                      return toProgress(center - window.innerHeight / 2);
                    }),
                    ...(featuresContentTrigger
                      ? [
                          toProgress(
                            window.scrollY + featuresContentTrigger.getBoundingClientRect().bottom - window.innerHeight,
                          ),
                        ]
                      : []),
                  ];
                  return stops.reduce((nearest, stop) =>
                    Math.abs(stop - progress) < Math.abs(nearest - progress) ? stop : nearest,
                  );
                },
                delay: 0.16,
                duration: { min: 0.35, max: 0.9 },
                ease: snapEase,
                inertia: false,
              },
            });

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
                // Fires once the block is fully revealed (scrolling down), not on every scrub tick.
                onComplete: () => cueReveal(el),
                // Scrolled back above the reveal: the lights go out with the boxes.
                onReverseComplete: () => unlight(el),
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
            // Phone: headings and hero blocks fade up as they enter, replayed when scrolling back.
            const blocks = q(
              '#hero-section [data-appear], [data-reveal="rise-exit-up"]',
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

            // Boxes (why, services, journey) share the journey's behaviour: each lights up with
            // its own chord once it passes mid-screen, and goes back when scrolling up past it.
            const boxes: Array<[HTMLElement, number, number]> = [
              ...q('[data-reveal-group="why"][data-index]').map((el, i): [HTMLElement, number, number] => [el, 0, i]),
              ...q('[data-reveal-group="features-content"] [data-appear]').map(
                (el, i): [HTMLElement, number, number] => [el, 1, i],
              ),
            ];
            boxes.forEach(([el, section, index]) => {
              gsap.fromTo(
                el,
                { opacity: 0, x: -12, y: 0 },
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.5,
                  ease: APPEAR_EASE,
                  scrollTrigger: {
                    trigger: el,
                    start: "center 55%",
                    toggleActions: "play none none reverse",
                    onEnter: () => {
                      light(el);
                      if (settled()) playSceneChord(section, index);
                    },
                    onLeaveBack: () => unlight(el),
                  },
                },
              );
            });
          }
        },
      );
    }, track);

    // Late web fonts change layout; re-measure once they settle. (ScrollTrigger already
    // refreshes itself on load and resize; each refresh is a full layout pass, so skip
    // this one when the fonts are in.)
    let alive = true;
    if (document.fonts && document.fonts.status !== "loaded") {
      document.fonts.ready.then(() => alive && ScrollTrigger.refresh());
    }

    return () => {
      alive = false;
      ctx.revert();
      track.removeAttribute("data-choreo");
      sceneStore.setState("hero");
    };
  }, []);

  return <span ref={anchor} hidden />;
}
