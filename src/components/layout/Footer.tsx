import Link from "next/link";
import type { Dictionary } from "@/content/dictionaries";
import { site, sitemap, social } from "@/content/site";
import { localePath, type Locale } from "@/i18n/config";
import { BrasiliaClock } from "./BrasiliaClock";
import styles from "./Footer.module.css";

const WORDMARK = "WEBCRAFTZ".split("");

type Props = { locale: Locale; t: Dictionary["footer"] };

export function Footer({ locale, t: footer }: Props) {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.lead}>
          <p className={styles.eyebrow}>{footer.eyebrow}</p>
          <p className={styles.headline}>
            {footer.lead[0]}
            <br />
            {footer.lead[1]}
          </p>
          <a className={styles.mail} href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>

        <nav className={styles.col} aria-labelledby="footer-sitemap">
          <h2 id="footer-sitemap" className={styles.colTitle}>
            {footer.sitemapTitle}
          </h2>
          <ul>
            {sitemap.map((item, i) => (
              <li key={item.href}>
                <Link href={localePath(locale, item.href)} className={i === 0 ? styles.linkStrong : styles.link}>
                  {footer.sitemap[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={styles.col} aria-labelledby="footer-social">
          <h2 id="footer-social" className={styles.colTitle}>
            {footer.socialTitle}
          </h2>
          <ul>
            {social.map((item) => (
              <li key={item.label}>
                <a className={styles.link} href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className={styles.colTitle}>{footer.studioTitle}</h2>
          <address className={styles.address}>
            {footer.location[0]}
            <br />
            {footer.location[1]}
          </address>
          <BrasiliaClock place={footer.clockPlace} />
        </div>
      </div>

      <div className={styles.wordmark} aria-hidden="true">
        {WORDMARK.map((ch, i) => (
          <span key={i} className={styles.letter}>
            <span className={styles.letterBase}>{ch}</span>
            <span className={styles.letterHover}>{ch}</span>
          </span>
        ))}
      </div>

      <div className={styles.bottom}>
        <p>{footer.copyright}</p>
        <p>{footer.reach}</p>
      </div>
    </footer>
  );
}
