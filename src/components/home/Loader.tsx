"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { unlockMenuAudio } from "@/components/ui/menuChord";
import styles from "./Loader.module.css";

const WORDMARK = "Webcraftz";

// Only the first visit in a session shows it. The flag also lives in sessionStorage so a
// hard reload (e.g. after the planet click) does not bring it back on the way home.
const STORAGE_KEY = "wbz-entered";
let lifted = false;

function hasEntered() {
  if (lifted) return true;
  try {
    lifted = window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {}
  return lifted;
}

/**
 * Home loader: black screen, a wordmark whose letters fade in one over another, and a
 * small "click to enter" button with a sound notice. It only lifts on click, which also
 * unlocks audio. The page is server-rendered underneath.
 */
export function Loader({
  enterLabel,
  soundNotice,
}: {
  enterLabel: string;
  soundNotice: string;
}) {
  const [state, setState] = useState<"shown" | "leaving" | "gone">(() => (lifted ? "gone" : "shown"));
  const root = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  // Already entered earlier in this session (before a hard reload): skip straight to the page.
  useLayoutEffect(() => {
    if (hasEntered()) setState("gone");
  }, []);

  // Letters fade in one in front of another, then the button and the notice follow.
  useEffect(() => {
    const element = root.current;
    if (!element || state !== "shown") return;
    const letters = element.querySelectorAll<HTMLElement>("[data-letter]");
    const prompt = element.querySelectorAll<HTMLElement>("[data-reveal-item]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([letters, prompt], { opacity: 1 });
      return;
    }
    const timeline = gsap.timeline();
    timeline
      .fromTo(
        letters,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", stagger: 0.12 },
      )
      .fromTo(
        prompt,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.15 },
        "-=0.4",
      );
    return () => {
      timeline.kill();
    };
  }, [state]);

  const enter = () => {
    if (lifted) return;
    lifted = true;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    unlockMenuAudio();
    setState("leaving");
    leaveTimer.current = window.setTimeout(() => setState("gone"), 600);
  };

  if (state === "gone") return null;

  return (
    <div
      ref={root}
      className={styles.loader}
      data-state={state}
      role="dialog"
      aria-label={enterLabel}
      onClick={enter}
    >
      <p className={styles.logo} aria-label={WORDMARK}>
        {WORDMARK.split("").map((letter, index) => (
          <span key={index} data-letter aria-hidden="true" className={styles.letter}>
            {letter}
          </span>
        ))}
      </p>
      <div className={styles.prompt}>
        <button type="button" className={styles.enter} data-reveal-item data-cursor-target data-cursor-shape="pill" autoFocus>
          {enterLabel}
        </button>
        <p className={styles.notice} data-reveal-item>
          {soundNotice}
        </p>
      </div>
    </div>
  );
}
