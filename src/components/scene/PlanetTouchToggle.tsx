"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { setPlanetSoundscape } from "@/components/ui/menuChord";
import { sceneStore } from "./sceneStore";
import styles from "./PlanetTouchToggle.module.css";

gsap.registerPlugin(MorphSVGPlugin);

// Lucide (ISC license) "pointer" and "hand". Path i of the pointer morphs into path i - 1 of
// the hand; the pointer's first stroke (the little cuff arc) just fades out.
const POINTER = [
  "M22 14a8 8 0 0 1-8 8",
  "M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2",
  "M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1",
  "M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10",
  "M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",
] as const;
const HAND = [
  "M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2",
  "M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2",
  "M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8",
  "M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",
] as const;

/**
 * Touch screens have no hover, so this button stands in for it: tapping holds the planet's
 * hover state (sparks, glow, soundscape) on, and tapping again releases it. The icon morphs
 * between a pointing hand (off) and an open hand (on).
 */
export function PlanetTouchToggle({ label, reducedMotion }: { label: string; reducedMotion: boolean }) {
  const [on, setOn] = useState(false);
  const [used, setUsed] = useState(false);
  const paths = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    sceneStore.touchHover = on;
    setPlanetSoundscape(on);
  }, [on]);

  // Never leave the hover or the hum running after the button goes away.
  useEffect(
    () => () => {
      sceneStore.touchHover = false;
      setPlanetSoundscape(false);
    },
    [],
  );

  useEffect(() => {
    const [cuff, ...fingers] = paths.current;
    if (!cuff) return;
    const duration = reducedMotion ? 0 : 0.5;
    const ctx = gsap.context(() => {
      gsap.to(cuff, { opacity: on ? 0 : 1, duration: duration * 0.6, ease: "power2.out" });
      fingers.forEach((path, index) => {
        if (!path) return;
        gsap.to(path, {
          morphSVG: on ? HAND[index] : POINTER[index + 1],
          duration,
          ease: "power2.inOut",
        });
      });
    });
    return () => ctx.revert();
  }, [on, reducedMotion]);

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-pressed={on}
      aria-label={label}
      data-used={used || undefined}
      onClick={() => {
        setUsed(true);
        setOn((value) => !value);
      }}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={styles.icon}>
        {POINTER.map((d, index) => (
          <path
            key={index}
            d={d}
            ref={(node) => {
              paths.current[index] = node;
            }}
          />
        ))}
      </svg>
    </button>
  );
}
