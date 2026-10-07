import { getFeaturedProjects } from "@/content/projects";
import type { Dictionary } from "@/content/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { MonoButton } from "@/components/ui/MonoButton";
import { ProjectCard } from "@/components/work/ProjectCard";
import styles from "./SelectedWork.module.css";

type Props = { locale: Locale; t: Dictionary["home"]["selectedWork"] };

export function SelectedWork({ locale, t: selectedWork }: Props) {
  const featuredProjects = getFeaturedProjects(locale);
  return (
    <section className={styles.section} aria-labelledby="selected-work-title">
      <div className={styles.inner}>
        <div className={styles.head} data-fade="blur">
          <div>
            <p className="label">{selectedWork.eyebrow}</p>
            <h2 id="selected-work-title" className={styles.title}>
              {selectedWork.title.text} <span className="accent-indigo">{selectedWork.title.accent}</span>
            </h2>
          </div>
          <MonoButton href={localePath(locale, "/cases")}>{selectedWork.cta}</MonoButton>
        </div>
        <ul className={styles.grid} data-fade-stagger>
          {featuredProjects.map((project) => (
            <li key={project.slug}>
              <ProjectCard
                project={project}
                locale={locale}
                sizes="(min-width: 1440px) 614px, (min-width: 810px) 44vw, 90vw"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
