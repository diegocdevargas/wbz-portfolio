import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/config";

/**
 * Portuguese is served without a prefix: "/cases" is rewritten internally to "/pt/cases".
 * "/en/..." and "/es/..." pass through, and an explicit "/pt/..." redirects to the clean URL.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const seg = pathname.split("/")[1];

  if (seg === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (isLocale(seg)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals and anything that looks like a file (images, fonts, textures).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
