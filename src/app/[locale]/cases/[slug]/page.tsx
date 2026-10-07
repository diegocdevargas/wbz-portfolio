import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextProject, getProject, projectSlugs } from "@/content/projects";
import { getDictionary } from "@/content/dictionaries";
import { alternates, locales, localePath, type Locale } from "@/i18n/config";
import { Icon } from "@/components/ui/Icon";
import { MonoButton } from "@/components/ui/MonoButton";
import { RichText } from "@/components/ui/RichText";
import styles from "./page.module.css";

type Params = { locale: Locale; slug: string };

export function generateStaticParams(): Params[] {
  return locales.flatMap((locale) => projectSlugs.map((slug) => ({ locale, slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug, locale);
  if (!project) return {};
  return {
    title: project.title,
    alternates: alternates(locale, `/cases/${slug}`),
    description: `${project.subtitle}. ${project.challenge.split(". ")[0]}.`,
    openGraph: { images: [{ url: project.cover.src, width: project.cover.width, height: project.cover.height }] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const project = getProject(slug, locale);
  if (!project) notFound();
  const next = getNextProject(slug, locale);
  const t = getDictionary(locale).caseStudy;

  const meta = [
    { label: t.client, value: project.client },
    { label: t.year, value: String(project.year) },
    { label: t.discipline, value: project.discipline },
    { label: t.services, value: project.services.join(", ") },
  ];

  const story = [
    { heading: t.challenge, text: project.challenge },
    { heading: t.approach, text: project.approach },
    { heading: t.result, text: project.result },
  ];

  return (
    <article className={styles.page}>
      <header className="container">
        <Link href={localePath(locale, "/cases")} className={styles.back} data-cursor-target>
          ← {t.back}
        </Link>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.subtitle}>{project.subtitle}</p>

        <dl className={styles.meta}>
          {meta.map((m) => (
            <div key={m.label} className={styles.metaItem}>
              <dt className={styles.metaLabel}>{m.label}</dt>
              <dd className={styles.metaValue}>{m.value}</dd>
            </div>
          ))}
        </dl>

        {project.url && (
          <MonoButton href={project.url} className={styles.visit}>
            {t.visit}
          </MonoButton>
        )}
      </header>

      <div className={`container ${styles.heroWrap}`}>
        <div className={styles.hero}>
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            priority
            sizes="(min-width: 1440px) 1376px, 100vw"
            className={styles.cover}
          />
        </div>
      </div>

      <section className={`container ${styles.story}`} aria-labelledby="case-study-label">
        <h2 id="case-study-label" className={styles.storyLabel}>
          {t.storyLabel}
        </h2>
        <div className={styles.storyBody}>
          {story.map((s) => (
            <div key={s.heading} className={styles.storyBlock}>
              <h3 className={styles.storyHeading}>{s.heading}</h3>
              <p>
                <RichText text={s.text} />
              </p>
            </div>
          ))}
        </div>
      </section>

      {project.metrics.length > 0 && (
        <section className={`container ${styles.metrics}`} aria-label={t.metricsLabel}>
          <ul className={styles.metricList}>
            {project.metrics.map((m) => (
              <li key={m.label} className={styles.metric}>
                <p className={styles.metricValue}>{m.value}</p>
                <p className={styles.metricLabel}>{m.label}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {project.gallery.length > 0 && (
        <section className={`container ${styles.gallery}`} aria-label={t.galleryLabel}>
          <ul className={styles.galleryList}>
            {project.gallery.map((img) => (
              <li key={img.src} className={styles.galleryItem}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1440px) 437px, (min-width: 810px) 31vw, 92vw"
                  className={styles.galleryImage}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className={styles.next} aria-label={t.nextNav}>
        <Link href={localePath(locale, `/cases/${next.slug}`)} className={`container ${styles.nextLink}`} data-cursor-target>
          <span className={styles.nextLabel}>{t.nextLabel}</span>
          <span className={styles.nextRow}>
            <span className={styles.nextTitle}>{next.title}</span>
            <Icon name="arrowUpRight" size={72} className={styles.nextArrow} />
          </span>
        </Link>
      </nav>
    </article>
  );
}
