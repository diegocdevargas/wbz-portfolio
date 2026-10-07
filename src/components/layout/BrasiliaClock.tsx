"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import styles from "./Footer.module.css";

const format = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: site.timeZone,
});

/** Live studio time in Brasília. Renders nothing for the time until mounted, to avoid a hydration mismatch. */
export function BrasiliaClock({ place }: { place: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className={styles.clock}>
      <span className={styles.clockDot} aria-hidden="true" />
      <span className={styles.clockPlace}>{place}</span>
      <time className={styles.clockTime} suppressHydrationWarning>
        {now ? format.format(now) : "--:--:--"}
      </time>
    </p>
  );
}
