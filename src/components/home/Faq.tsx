"use client";

import { useId, useState } from "react";
import type { Dictionary } from "@/content/dictionaries";
import styles from "./Faq.module.css";

export function Faq({ t: faq }: { t: Dictionary["home"]["faq"] }) {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section id="faq-section" className={styles.section} aria-labelledby={`${baseId}-title`}>
      <div className={styles.head} data-fade="blur">
        <p className="eyebrow">{faq.eyebrow}</p>
        <h2 id={`${baseId}-title`} className={styles.title}>
          {faq.title.text}
          <br />
          <em className={styles.titleAccent}>{faq.title.accent}</em>
        </h2>
      </div>

      <ul className={styles.list} data-fade="up">
        {faq.items.map((item, i) => {
          const isOpen = open === i;
          const btnId = `${baseId}-q${i}`;
          const panelId = `${baseId}-a${i}`;
          return (
            <li key={item.q} className={styles.item} data-open={isOpen || undefined} data-cursor-target>
              <h3>
                <button
                  id={btnId}
                  type="button"
                  className={styles.question}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{item.q}</span>
                  <svg className={styles.chevron} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path
                      d="M6 9l6 6 6-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </h3>
              <div id={panelId} role="region" aria-labelledby={btnId} className={styles.panel}>
                <div className={styles.panelInner}>
                  <p>{item.a}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
