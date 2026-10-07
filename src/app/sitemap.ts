import type { MetadataRoute } from "next";
import { projectSlugs } from "@/content/projects";
import { htmlLang, locales } from "@/i18n/config";
import { absoluteUrl } from "./seo";

/** /sitemap.xml: every page in every language, each listing its translations (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/cases", ...projectSlugs.map((slug) => `/cases/${slug}`)];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(locale, path),
      priority: path === "/" ? 1 : path === "/cases" ? 0.8 : 0.6,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [htmlLang[l], absoluteUrl(l, path)])),
      },
    })),
  );
}
