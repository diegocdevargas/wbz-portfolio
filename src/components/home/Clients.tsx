import { clientLogos } from "@/content/home";
import type { Dictionary } from "@/content/dictionaries";
import { Marquee } from "@/components/ui/Marquee";
import styles from "./Clients.module.css";

export function Clients({ t }: { t: Dictionary["home"]["clients"] }) {
  return (
    <section className={styles.band} aria-labelledby="clients-title">
      <h2 id="clients-title" className={`label ${styles.title}`}>
        {t.eyebrow}
      </h2>
      <Marquee className={styles.marquee} label={t.label} speed={28}>
        {clientLogos.map((logo) => (
          <li key={logo.file} className={styles.logo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/images/clients/${logo.file}.svg`} alt={logo.name} width={240} height={80} />
          </li>
        ))}
      </Marquee>
    </section>
  );
}
