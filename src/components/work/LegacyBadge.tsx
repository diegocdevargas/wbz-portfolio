import styles from "./LegacyBadge.module.css";

/** Marks a project made before AI changed how sites are built (see `isLegacy`). Sits inside the image. */
export function LegacyBadge({ label }: { label: string }) {
  return <span className={styles.badge}>{label}</span>;
}
