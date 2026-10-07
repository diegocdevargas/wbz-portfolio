"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { nav, contactHref, site } from "@/content/site";
import type { Dictionary } from "@/content/dictionaries/format";
import { localePath, type Locale } from "@/i18n/config";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { smoothScroll } from "./SmoothScroll";
import styles from "./Header.module.css";

const HIDE_AFTER = 80;

type Props = { locale: Locale; t: Dictionary["header"] };

export function Header({ locale, t }: Props) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Hide while scrolling down, reveal on scroll up; dark blurred bar away from the top.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      setAtTop(y < 8);
      if (Math.abs(delta) > 4) setHidden(delta > 0 && y > HIDE_AFTER);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Close the drawer on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Drawer: lock scroll, Esc closes, keep focus inside.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    smoothScroll.stop();
    const drawer = drawerRef.current;
    const focusables = () =>
      Array.from(drawer?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [toggleRef.current, ...focusables()].filter(Boolean) as HTMLElement[];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      smoothScroll.start();
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const state = open ? "open" : hidden ? "hidden" : atTop ? "top" : "scrolled";

  return (
    <header className={styles.header} data-state={state}>
      <div className={styles.row}>
        <Link
          href={localePath(locale, "/")}
          className={styles.logo}
          data-cursor-target
          aria-label={`${site.name}, ${t.homeLabel}`}
        >
          Webcraftz
        </Link>

        <nav className={styles.nav} aria-label={t.mainNav}>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={localePath(locale, item.href)}
                  className={styles.navLink}
                  data-cursor-target
                  aria-current={pathname === localePath(locale, item.href) ? "page" : undefined}
                >
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
        <LanguageSwitcher locale={locale} label={t.language} className={styles.lang} />
        <Link href={localePath(locale, contactHref)} className={styles.contact} data-cursor-target>
          <span>{t.contact}</span>
          <span className={styles.contactIcon} aria-hidden="true">
            <svg viewBox="0 0 4.906 9" width="5" height="9">
              <path
                d="M 0.739 0 L 4.906 4.5 L 0.739 9 L 0 8.201 L 3.427 4.5 L 0 0.799 Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </Link>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="mobile-drawer"
          aria-label={open ? t.closeMenu : t.openMenu}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>
      </div>

      <div
        id="mobile-drawer"
        ref={drawerRef}
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label={t.menu}
        hidden={!open}
      >
        <nav aria-label={t.mobileNav}>
          <ul className={styles.drawerList}>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={localePath(locale, item.href)} className={styles.drawerLink} onClick={() => close(false)}>
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href={localePath(locale, contactHref)} className={styles.drawerContact} onClick={() => close(false)}>
          {t.contact}
          <span aria-hidden="true">↗</span>
        </Link>
        <a className={styles.drawerMail} href={`mailto:${site.email}`}>
          {site.email}
        </a>
        <LanguageSwitcher locale={locale} label={t.language} className={styles.drawerLang} />
      </div>
    </header>
  );
}
