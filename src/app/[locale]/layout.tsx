import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { anton, inter, jetbrains, moon } from "../fonts";
import { site } from "@/content/site";
import { getDictionary } from "@/content/dictionaries";
import { alternates, htmlLang, isLocale, locales, ogLocale, type Locale } from "@/i18n/config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Reveal } from "@/components/ui/Reveal";
import { Cursor } from "@/components/ui/Cursor";
import "../globals.css";

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).meta;
  return {
    metadataBase: new URL(site.url),
    title: { default: t.title, template: "%s — Webcraftz" },
    description: t.description,
    alternates: alternates(locale, "/"),
    openGraph: {
      title: t.title,
      description: t.description,
      url: site.url,
      siteName: site.name,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: param } = await params;
  if (!isLocale(param)) notFound();
  const locale: Locale = param;
  const t = getDictionary(locale);

  return (
    <html
      lang={htmlLang[locale]}
      className={`${anton.variable} ${inter.variable} ${jetbrains.variable} ${moon.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          {t.meta.skipLink}
        </a>
        <Header locale={locale} t={t.header} />
        <main id="main">{children}</main>
        <Footer locale={locale} t={t.footer} />
        <SmoothScroll />
        <Reveal />
        <Cursor />
      </body>
    </html>
  );
}
