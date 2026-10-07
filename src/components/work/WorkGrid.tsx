"use client";

import { useMemo, useState } from "react";
import type { Category, Project } from "@/content/projects";
import { format, type Dictionary } from "@/content/dictionaries/format";
import type { Locale } from "@/i18n/config";
import { ProjectCard } from "./ProjectCard";
import styles from "./WorkGrid.module.css";

type Filter = Category | "all";

const categoryIds: Filter[] = ["all", "websites", "ecommerce", "web-apps", "ai-automacao"];

type Props = { projects: Project[]; locale: Locale; t: Dictionary["work"] };

export function WorkGrid({ projects, locale, t }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter, projects],
  );
  const activeLabel = t.categories[filter];

  return (
    <>
      <div className={`container ${styles.bar}`}>
        <p className={styles.intro}>{t.intro}</p>
        <div className={styles.chips} role="group" aria-label={t.filterLabel}>
          {categoryIds.map((id) => (
            <button
              key={id}
              type="button"
              className={styles.chip}
              data-cursor-target
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
            >
              {t.categories[id]}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {format(t.liveCount, { count: visible.length, label: activeLabel })}
      </p>

      <div className={`container ${styles.gridWrap}`}>
        {visible.length > 0 ? (
          <ul className={styles.grid}>
            {visible.map((project, i) => (
              <li key={project.slug}>
                <ProjectCard
                  project={project}
                  locale={locale}
                  priority={i < 2}
                  sizes="(min-width: 1440px) 642px, (min-width: 810px) 46vw, 92vw"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>
            {t.empty}{" "}
            <button type="button" className={styles.reset} onClick={() => setFilter("all")}>
              {t.showAll}
            </button>
          </p>
        )}
      </div>
    </>
  );
}
