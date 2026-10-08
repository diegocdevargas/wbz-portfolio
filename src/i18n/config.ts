// Languages the site is published in. Portuguese is the main language and lives at the
// root (/, /cases); the others are prefixed (/en, /en/cases, /es, /es/cases).

export const locales = ["pt", "en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Cookie holding the language a visitor picked in the switcher; it outranks the browser's. */
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** The visitor's best supported language from an Accept-Language header, or null. */
export function negotiateLocale(header: string | null): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part, i) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { lang: tag.trim().toLowerCase().split("-")[0], q: q ? Number(q.slice(2)) : 1, i };
    })
    .filter((r) => r.lang && r.q > 0)
    .sort((a, b) => b.q - a.q || a.i - b.i);
  return ranked.find((r): r is typeof r & { lang: Locale } => isLocale(r.lang))?.lang ?? null;
}

/** Value for <html lang> and hreflang. */
export const htmlLang: Record<Locale, string> = { pt: "pt-BR", en: "en", es: "es" };

export const ogLocale: Record<Locale, string> = { pt: "pt_BR", en: "en_US", es: "es_ES" };

/**
 * Prefix a site path for a language. `path` is the Portuguese path, which may carry a hash:
 * localePath("en", "/") → "/en", localePath("es", "/#faq-section") → "/es#faq-section".
 */
export function localePath(locale: Locale, path: string): string {
  if (locale === defaultLocale) return path;
  if (path === "/") return `/${locale}`;
  if (path.startsWith("/#")) return `/${locale}${path.slice(1)}`;
  return `/${locale}${path}`;
}

/** Strip the language prefix from a browser path: "/en/cases" → "/cases", "/es" → "/". */
export function stripLocale(pathname: string): string {
  const seg = pathname.split("/")[1];
  if (seg && seg !== defaultLocale && isLocale(seg)) return pathname.slice(seg.length + 1) || "/";
  return pathname || "/";
}

/** `alternates` metadata for a page, so search engines link the three versions. */
export function alternates(locale: Locale, path: string) {
  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [htmlLang[l], localePath(l, path)])),
      "x-default": path,
    },
  };
}
