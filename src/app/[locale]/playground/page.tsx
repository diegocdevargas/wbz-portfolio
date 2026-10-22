import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";
import { pageMetadata } from "@/app/seo";
import styles from "./page.module.css";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).playground;
  return pageMetadata({ locale, path: "/playground", title: t.metaTitle, description: t.intro });
}

export default async function PlaygroundPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale).playground;

  return (
    <main className={styles.page}>
      <header className={`container ${styles.head}`}>
        <p className={styles.kicker}>{t.kicker}</p>
        <h1 className={styles.title}>Playground</h1>
        <p className={styles.intro}>{t.intro}</p>
      </header>
      <section className={`container ${styles.content}`} aria-labelledby="playground-empty-title">
        <div className={styles.empty}>
          <p className={styles.index}>// 001 — OPEN EXPERIMENTS</p>
          <h2 id="playground-empty-title" className={styles.emptyTitle}>
            {t.emptyTitle}
          </h2>
          <p className={styles.emptyBody}>{t.emptyBody}</p>
        </div>
      </section>
    </main>
  );
}
