"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ParallaxFloat } from "@/components/ui/ParallaxFloat";
import { smoothScroll } from "@/components/layout/SmoothScroll";
import styles from "./VideoLightbox.module.css";

type Props = {
  video: string;
  poster: string;
  alt: string;
  sizes: string;
  watchLabel: string;
  closeLabel: string;
};

/**
 * A gallery still that opens its recording in a modal overlay. For sites that cannot be captured
 * as a print (transitions, scroll-driven animation): the still keeps the gallery cell, parallax
 * and height of any other item, and the video plays uncropped at its own shape on click.
 */
export function VideoLightbox({ video, poster, alt, sizes, watchLabel, closeLabel }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) {
      element.showModal();
      smoothScroll.stop();
    }
    if (!open && element.open) element.close();
  }, [open]);

  // The dialog closes itself on Escape: unmount the video so it stops, give the page back.
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const onClose = () => {
      setOpen(false);
      smoothScroll.start();
      trigger.current?.focus();
    };
    element.addEventListener("close", onClose);
    return () => {
      element.removeEventListener("close", onClose);
      smoothScroll.start();
    };
  }, []);

  return (
    <>
      <button ref={trigger} type="button" className={styles.trigger} onClick={() => setOpen(true)} aria-haspopup="dialog">
        <ParallaxFloat travel={20}>
          <Image src={poster} alt={alt} fill sizes={sizes} className={styles.still} />
        </ParallaxFloat>
        <span className={styles.play} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path d="M8 5.5v13a.75.75 0 0 0 1.14.64l10.4-6.5a.75.75 0 0 0 0-1.28L9.14 4.86A.75.75 0 0 0 8 5.5Z" fill="currentColor" />
          </svg>
        </span>
        <span className="sr-only">{watchLabel}</span>
      </button>

      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-label={alt}
        onClick={(event) => {
          if (event.target === dialog.current) setOpen(false);
        }}
      >
        {open && (
          <>
            <video className={styles.video} src={video} poster={poster} controls autoPlay loop playsInline />
            <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label={closeLabel}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </>
        )}
      </dialog>
    </>
  );
}
