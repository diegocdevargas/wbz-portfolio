"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  htmlLang,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  localePath,
  locales,
  stripLocale,
  type Locale,
} from "@/i18n/config";
import styles from "./LanguageSwitcher.module.css";

// Each language names itself, so a visitor can find theirs whatever page they are on.
const names: Record<Locale, string> = { pt: "Português", en: "English", es: "Español" };

type Props = { locale: Locale; label: string; className?: string };

/** Remember an explicit pick so the proxy stops following the browser's language. */
function remember(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}

/**
 * PT · EN · ES. Links to the same page in the other language. Not prefetched: a prefetch
 * made before the click carries no cookie and could be redirected to the browser's language.
 */
export function LanguageSwitcher({ locale, label, className }: Props) {
  const path = stripLocale(usePathname() ?? "/");
  return (
    <nav className={`${styles.switcher} ${className ?? ""}`} aria-label={label}>
      <ul>
        {locales.map((l) => (
          <li key={l}>
            <Link
              href={localePath(l, path)}
              prefetch={false}
              onClick={() => remember(l)}
              hrefLang={htmlLang[l]}
              lang={htmlLang[l]}
              className={styles.link}
              aria-current={l === locale ? "true" : undefined}
              aria-label={names[l]}
              data-cursor-target
            >
              {l.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
