"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { playPageReveal, playPageWarp } from "@/components/ui/menuChord";

const COVER_SECONDS = 0.55;
const REVEAL_SECONDS = 0.7;
// If the next page never reports in, the void still lifts so nobody is stuck on black.
const GIVE_UP_MS = 6000;

const HIDDEN = "circle(0% at 50% 50%)";
const COVERED = "circle(150% at 50% 50%)";

/**
 * Page transition for internal links: a black void swallows the screen from the centre
 * (with the planet boom), the route changes underneath, then the void recedes on the new
 * page. The planet click on Home keeps its own transition because it calls preventDefault.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const covered = useRef(false);
  const busy = useRef(false);
  const giveUp = useRef(0);
  const revealRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const element = overlay.current;
    if (!element) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.hasAttribute("download") || anchor.hasAttribute("data-cursor-hit-area")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return;

      event.preventDefault();
      if (busy.current) return;
      const target = url.pathname + url.search + url.hash;

      if (document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(target);
        return;
      }

      busy.current = true;
      playPageWarp();
      element.style.pointerEvents = "auto";
      gsap.killTweensOf(element);
      gsap.fromTo(
        element,
        { clipPath: HIDDEN },
        {
          clipPath: COVERED,
          duration: COVER_SECONDS,
          ease: "power3.in",
          onComplete: () => {
            covered.current = true;
            router.push(target);
            window.clearTimeout(giveUp.current);
            giveUp.current = window.setTimeout(reveal, GIVE_UP_MS);
          },
        },
      );
    };

    const reveal = () => {
      window.clearTimeout(giveUp.current);
      if (!covered.current) return;
      covered.current = false;
      playPageReveal();
      gsap.to(element, {
        clipPath: HIDDEN,
        duration: REVEAL_SECONDS,
        ease: "power2.out",
        onComplete: () => {
          busy.current = false;
          element.style.pointerEvents = "none";
        },
      });
    };

    revealRef.current = reveal;
    // Capture phase: Next's <Link> prevents default itself, so we must see the click first.
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(giveUp.current);
      gsap.killTweensOf(element);
    };
  }, [router]);

  // The new route has rendered: lift the void.
  useEffect(() => {
    revealRef.current();
  }, [pathname]);

  return (
    <div
      ref={overlay}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "#000",
        clipPath: HIDDEN,
        pointerEvents: "none",
      }}
    />
  );
}
