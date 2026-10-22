"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ProjectCard.module.css";

type Props = {
  src: string;
  className?: string;
};

export function HoverVideoPreview({ src, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const failedRef = useRef(false);
  const [failed, setFailed] = useState(false);

  const reportFailure = useCallback((error: unknown) => {
    if (failedRef.current) return;
    failedRef.current = true;
    setFailed(true);
    console.error(`Could not play project preview video: ${src}`, error);
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    const link = video?.closest("a");
    if (!video || !link) return;

    const start = () => {
      if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;

      video.play().catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        reportFailure(error);
      });
    };
    const stop = () => {
      video.pause();
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) video.currentTime = 0;
    };
    const stopOnFocusOut = (event: FocusEvent) => {
      if (event.relatedTarget instanceof Node && link.contains(event.relatedTarget)) return;
      stop();
    };

    link.addEventListener("pointerenter", start);
    link.addEventListener("pointerleave", stop);
    link.addEventListener("focusin", start);
    link.addEventListener("focusout", stopOnFocusOut);

    return () => {
      link.removeEventListener("pointerenter", start);
      link.removeEventListener("pointerleave", stop);
      link.removeEventListener("focusin", start);
      link.removeEventListener("focusout", stopOnFocusOut);
      stop();
    };
  }, [reportFailure]);

  return (
    <video
      ref={videoRef}
      className={`${className ?? ""} ${styles.videoPreview}`}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      data-error={failed || undefined}
      onError={(event) => reportFailure(event.currentTarget.error ?? new Error("Unknown media error"))}
    />
  );
}
