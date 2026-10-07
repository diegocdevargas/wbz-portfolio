import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./Icon";
import styles from "./MonoButton.module.css";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "ghost" | "dark";
  external?: boolean;
  className?: string;
};

/** JetBrains Mono uppercase button with the up-right arrow, as used across the live site. */
export function MonoButton({ href, children, variant = "ghost", external, className }: Props) {
  const cls = `${styles.button} ${styles[variant]} ${className ?? ""}`;
  const content = (
    <>
      <span>{children}</span>
      <Icon name="arrowUpRight" size={16} className={styles.arrow} />
    </>
  );
  const isExternal = external ?? /^(https?:|mailto:)/.test(href);
  if (isExternal) {
    return (
      <a
        className={cls}
        data-cursor-target
        href={href}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link className={cls} href={href} data-cursor-target>
      {content}
    </Link>
  );
}
