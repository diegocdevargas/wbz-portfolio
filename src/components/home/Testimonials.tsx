import Image from "next/image";
import { testimonials } from "@/content/testimonials";
import type { Dictionary } from "@/content/dictionaries";
import { Marquee } from "@/components/ui/Marquee";
import styles from "./Testimonials.module.css";

export function Testimonials({ t }: { t: Dictionary["home"]["testimonials"] }) {
  return (
    <section className={styles.section} aria-labelledby="testimonials-title">
      <div className={styles.head} data-fade="blur">
        <p className="eyebrow">{t.rating}</p>
        <h2 id="testimonials-title" className={styles.title}>
          {t.title.text} <span className="accent">{t.title.accent}</span>
        </h2>
      </div>
      <Marquee className={styles.marquee} label={t.label} speed={45}>
        {testimonials.map((t) => (
          <li key={t.name} className={styles.card} data-cursor-target>
            <figure>
              <figcaption className={styles.person}>
                {t.avatar && (
                  <Image src={t.avatar} alt="" width={50} height={50} className={styles.avatar} />
                )}
                <span className={styles.name}>{t.name}</span>
              </figcaption>
              <blockquote className={styles.quote} lang="pt-BR">{t.quote}</blockquote>
              <span className={styles.mark} aria-hidden="true">
                ❜❜
              </span>
            </figure>
          </li>
        ))}
      </Marquee>
    </section>
  );
}
