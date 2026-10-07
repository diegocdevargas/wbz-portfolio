import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./Icon";
import styles from "./MonoButton.module.css";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "ghost" | "dark";
  external?: boolean;
  /** Screen-reader note for http(s) links, which open in a new tab. */
  newTabLabel?: string;
  className?: string;
};

/** Monospace uppercase button with the up-right arrow, as used across the live site. */
export function MonoButton({ href, children, variant = "ghost", external, newTabLabel, className }: Props) {
  const cls = `${styles.button} ${styles[variant]} ${className ?? ""}`;
  const content = (
    <>
      <span>{children}</span>
      <Icon name="arrowUpRight" size={16} className={styles.arrow} />
    </>
  );
  const isExternal = external ?? /^(https?:|mailto:)/.test(href);
  if (isExternal) {
    const newTab = href.startsWith("http");
    return (
      <a
        className={cls}
        data-cursor-target
        href={href}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
        {newTab && newTabLabel && <span className="sr-only"> {newTabLabel}</span>}
      </a>
    );
  }
  return (
    <Link className={cls} href={href} data-cursor-target>
      {content}
    </Link>
  );
}
