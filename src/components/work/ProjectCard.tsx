import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";
import { localePath, type Locale } from "@/i18n/config";
import styles from "./ProjectCard.module.css";

type Props = {
  project: Project;
  locale: Locale;
  /** Responsive `sizes` for the cover; the grid is 2 columns ≥ 810px. */
  sizes?: string;
  priority?: boolean;
};

export function ProjectCard({ project, locale, sizes, priority }: Props) {
  return (
    <article className={styles.card}>
      <Link href={localePath(locale, `/cases/${project.slug}`)} className={styles.link} data-cursor-target>
        <div className={styles.media}>
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            sizes={sizes ?? "(min-width: 810px) 50vw, 100vw"}
            className={styles.image}
            priority={priority}
          />
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
