import type { Metadata } from "next";
import { getProjects } from "@/content/projects";
import { getDictionary } from "@/content/dictionaries";
import { alternates, type Locale } from "@/i18n/config";
import { WorkGrid } from "@/components/work/WorkGrid";
import styles from "./page.module.css";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale).work;
  return { title: t.metaTitle, description: t.intro, alternates: alternates(locale, "/cases") };
}

export default async function WorkPage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(locale).work;
  const projects = getProjects(locale);
  const years = projects.map((p) => p.year);
  return (
    <div className={styles.page}>
      <header className={`container ${styles.head}`}>
        <p className={styles.kicker}>
          {t.kicker}, {Math.min(...years)}–{Math.max(...years)}
        </p>
        <h1 className={styles.title}>
          {t.title}
          <sup className={styles.count}>({projects.length})</sup>
        </h1>
      </header>
      <WorkGrid projects={projects} locale={locale} t={t} />
    </div>
  );
}
