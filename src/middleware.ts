import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_HEADER, defaultLocale, isLocale } from "@/i18n/config";

/**
 * Portuguese is served without a prefix: "/cases" is rewritten internally to "/pt/cases".
 * "/en/..." and "/es/..." pass through, and an explicit "/pt/..." redirects to the clean URL.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const seg = pathname.split("/")[1];

  if (seg === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }
  // The 404 page gets no route params, so it reads the language from this header.
  const headers = new Headers(request.headers);
  if (isLocale(seg)) {
    headers.set(LOCALE_HEADER, seg);
    return NextResponse.next({ request: { headers } });
  }

  headers.set(LOCALE_HEADER, defaultLocale);
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  // Skip Next internals and anything that looks like a file (images, fonts, textures).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
