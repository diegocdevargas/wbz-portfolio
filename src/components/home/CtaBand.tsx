import type { Dictionary } from "@/content/dictionaries";
import { site, startProjectHref } from "@/content/site";
import { MonoButton } from "@/components/ui/MonoButton";
import styles from "./CtaBand.module.css";

type Props = { t: Dictionary["home"]["cta"]; startProjectSubject: string };

export function CtaBand({ t: cta, startProjectSubject }: Props) {
  return (
    <section id="cta-section" className={styles.band} aria-labelledby="cta-title">
      <div className={styles.inner}>
        <p className={`label ${styles.eyebrow}`}>{cta.eyebrow}</p>
        <h2 id="cta-title" className={styles.title} data-fade="blur">
          {cta.title.map((line) => (
            <span key={line}>{line} </span>
          ))}
        </h2>
        <div className={styles.actions}>
          <MonoButton href={startProjectHref(startProjectSubject)} variant="dark">
            {cta.button}
          </MonoButton>
          <a className={styles.mail} href={`mailto:${site.email}`}>
            {cta.mailLead} {site.email}
          </a>
        </div>
      </div>
    </section>
  );
}
