import Image from "next/image";
import Link from "next/link";
import { isLegacy, type Project } from "@/content/projects";
import { ScrollImage } from "@/components/ui/ScrollImage";
import { localePath, type Locale } from "@/i18n/config";
import { HoverVideoPreview } from "./HoverVideoPreview";
import { LegacyBadge } from "./LegacyBadge";
import styles from "./ProjectCard.module.css";

type Props = {
  project: Project;
  locale: Locale;
  /** Responsive `sizes` for the cover; the grid is 2 columns ≥ 810px. */
  sizes?: string;
  priority?: boolean;
  /** Label of the badge shown on projects made before 2022. */
  legacyLabel: string;
};

export function ProjectCard({ project, locale, sizes, priority, legacyLabel }: Props) {
  const mediaSizes = sizes ?? "(min-width: 810px) 50vw, 100vw";
  // A full-page layout print in the gallery previews on hover: it fades in over the cover and
  // scrolls from top to bottom. Decorative (the cover already describes the project).
  const tall = project.gallery.find((img) => img.height / img.width > 2);
  const hasScrollPreview = Boolean(project.previewVideo || tall);
  return (
    <article className={styles.card}>
      <Link
        href={localePath(locale, `/cases/${project.slug}`)}
        className={styles.link}
        data-cursor-target
        data-hover-sound="card"
        data-scroll-hover={hasScrollPreview ? "" : undefined}
      >
        <div className={styles.media}>
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            sizes={mediaSizes}
            className={styles.image}
            priority={priority}
          />
          {project.previewVideo ? (
            <HoverVideoPreview src={project.previewVideo} className={styles.preview} />
          ) : tall ? (
            <ScrollImage
              src={tall.src}
              alt=""
              width={tall.width}
              height={tall.height}
              sizes={mediaSizes}
              className={styles.preview}
            />
          ) : null}
          {isLegacy(project) && <LegacyBadge label={legacyLabel} />}
        </div>
        <div className={styles.meta}>
          <h3 className={styles.title}>{project.title}</h3>
          <p className={styles.year}>{project.year}</p>
        </div>
        <p className={styles.services}>{project.services.join(", ")}</p>
      </Link>
    </article>
  );
}
