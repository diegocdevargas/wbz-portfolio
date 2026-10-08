import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, negotiateLocale } from "@/i18n/config";

// Crawlers and link-preview bots always get the URL they asked for; hreflang points them
// at the other languages.
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|whatsapp|telegram/i;

/**
 * Portuguese is served without a prefix: "/cases" is rewritten internally to "/pt/cases".
 * "/en/..." and "/es/..." pass through untouched, so shared links always open as sent.
 * An explicit "/pt/..." redirects to the clean URL and remembers Portuguese.
 *
 * On a prefix-less URL, a visitor whose language is English or Spanish is sent to the
 * same page in that language: the switcher's cookie decides first, then the browser's
 * Accept-Language. The redirect is temporary (307) so it is never cached as permanent.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const seg = pathname.split("/")[1];

  if (seg === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    const res = NextResponse.redirect(url, 308);
    res.cookies.set(LOCALE_COOKIE, defaultLocale, { path: "/", maxAge: LOCALE_COOKIE_MAX_AGE, sameSite: "lax" });
    return res;
  }
  if (isLocale(seg)) return NextResponse.next();

  const preferred = preferredLocale(request);
  if (preferred && preferred !== defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
    const res = NextResponse.redirect(url, 307);
    res.headers.set("Vary", "Accept-Language, Cookie");
    return res;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

function preferredLocale(request: NextRequest) {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && isLocale(saved)) return saved;
  if (BOT.test(request.headers.get("user-agent") ?? "")) return null;
  return negotiateLocale(request.headers.get("accept-language"));
}

export const config = {
  // Skip Next internals and anything that looks like a file (images, fonts, textures).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
