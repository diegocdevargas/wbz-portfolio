import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextProject, getProject, isLegacy, projectSlugs } from "@/content/projects";
import { getDictionary } from "@/content/dictionaries";
import { locales, localePath, type Locale } from "@/i18n/config";
import { breadcrumbJsonLd, pageMetadata, projectOgImage } from "@/app/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Icon } from "@/components/ui/Icon";
import { MonoButton } from "@/components/ui/MonoButton";
import { RichText } from "@/components/ui/RichText";
import { ParallaxFloat } from "@/components/ui/ParallaxFloat";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { ParallaxShape } from "@/components/ui/ParallaxShape";
import { ScrollImage } from "@/components/ui/ScrollImage";
import { VideoLightbox } from "@/components/work/VideoLightbox";
import { LegacyBadge } from "@/components/work/LegacyBadge";
import styles from "./page.module.css";

const GALLERY_SIZES = "(min-width: 1440px) 437px, (min-width: 810px) 31vw, 92vw";
const WIDE_GALLERY_SIZES = "(min-width: 1440px) 1376px, 92vw";

type Params = { locale: Locale; slug: string };

export function generateStaticParams(): Params[] {
  return locales.flatMap((locale) => projectSlugs.map((slug) => ({ locale, slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug, locale);
  if (!project) return {};
  return pageMetadata({
    locale,
    path: `/cases/${slug}`,
    title: project.title,
    description: `${project.subtitle}. ${project.challenge.split(". ")[0]}.`,
    image: { ...projectOgImage(slug), alt: project.cover.alt },
    type: "article",
  });
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const project = getProject(slug, locale);
  if (!project) notFound();
  const next = getNextProject(slug, locale);
  const dict = getDictionary(locale);
  const t = dict.caseStudy;

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

  const cover = (
    <Image
      src={project.cover.src}
      alt={project.cover.alt}
      fill
      priority
      sizes="(min-width: 1440px) 1376px, 100vw"
      className={styles.cover}
    />
  );

  const crumbs =breadcrumbJsonLd(locale, [
    { name: dict.footer.sitemap.home, path: "/" },
    { name: dict.work.metaTitle, path: "/cases" },
    { name: project.title, path: `/cases/${slug}` },
  ]);

  return (
    <article className={styles.page}>
      <JsonLd data={crumbs} />
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
          <MonoButton href={project.url} className={styles.visit} newTabLabel={dict.newTab}>
            {t.visit}
          </MonoButton>
        )}
      </header>

      <div className={`container ${styles.heroWrap}`}>
        <div className={project.cover.overflow === "visible" ? `${styles.hero} ${styles.heroFloat}` : styles.hero}>
          <ParallaxFloat travel={40}>{cover}</ParallaxFloat>
          {isLegacy(project) && <LegacyBadge label={dict.work.categories.legacy} />}
        </div>
      </div>

      <section className={`container ${styles.story}`} aria-labelledby="case-study-label">
        <div className={styles.storyLabel}>
          <h2 id="case-study-label" className="sr-only">
            {t.storyLabel}
          </h2>
          <ParallaxShape />
        </div>
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
            {project.gallery.map((img, i) => {
              const tall = img.height / img.width > 2;
              // A tall print that would sit alone in the last row spans the full width instead.
              const wide = tall && i === project.gallery.length - 1 && project.gallery.length % 3 === 1;
              // Photos float in the same direction. Every project follows one pattern: stills and mock-ups
              // paint outside their cell, while a scrolling print or recording (tall image or video)
              // stays clipped to its frame so its hover scroll starts at the top. `overflow` in the
              // content overrides the default.
              const float = img.overflow ? img.overflow === "visible" : !tall && !img.video;
              const scrollImage = (
                <ScrollImage
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes={wide ? WIDE_GALLERY_SIZES : GALLERY_SIZES}
                />
              );
              return (
                <li
                  key={img.src}
                  className={[
                    styles.galleryItem,
                    wide && styles.galleryItemWide,
                    i === 1 && styles.gallerySecond,
                    i === 1 && isLegacy(project) && styles.gallerySecondLegacy,
                    float && styles.galleryItemFloat,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  data-cursor-target={tall || img.video ? "" : undefined}
                >
                  {img.video ? (
                    // A recording stands in for a print when the site cannot be captured as a still
                    // (transitions, scroll-driven animation): the still keeps the print's cell and
                    // parallax, and a click plays the video uncropped in an overlay.
                    <VideoLightbox
                      video={img.video}
                      poster={img.src}
                      alt={img.alt}
                      sizes={GALLERY_SIZES}
                      watchLabel={t.watchVideo}
                      closeLabel={t.closeVideo}
                    />
                  ) : img.parallax ? (
                    <ParallaxImage src={img.src} alt={img.alt} sizes={GALLERY_SIZES} />
                  ) : tall ? (
                    scrollImage
                  ) : (
                    <ParallaxFloat>
                      <Image src={img.src} alt={img.alt} fill sizes={GALLERY_SIZES} className={styles.galleryImage} />
                    </ParallaxFloat>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <nav className={styles.next} aria-label={t.nextNav}>
        <Link href={localePath(locale, `/cases/${next.slug}`)} className={`container ${styles.nextLink}`} data-cursor-target>
          {/* <span className={styles.nextLabel}>{t.nextLabel}</span> */}
          <span className={styles.nextRow}>
            <span className={styles.nextTitle}>{next.title}</span>
            <Icon name="arrowUpRight" size={72} className={styles.nextArrow} />
          </span>
        </Link>
      </nav>
    </article>
  );
}
