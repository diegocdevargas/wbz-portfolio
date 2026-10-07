// Shared site data: navigation, contact and footer.

export const site = {
  name: "Webcraftz",
  url: "https://www.webcraftz.com.br",
  email: "contact@webcraftz.com.br",
  timeZone: "America/Sao_Paulo",
};

/** "Iniciar projeto" destination until Diego provides a form or booking link. */
export function startProjectHref(subject: string): string {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
}

// Paths are the Portuguese ones; components prefix them with localePath(). Labels are in
// the dictionaries under header.nav and footer.sitemap.
export const nav = [
  { key: "about", href: "/#why-us-showup-trigger" },
  { key: "cases", href: "/cases" },
  { key: "services", href: "/#features-content-showup-trigger" },
  { key: "journey", href: "/#journey-content" },
  { key: "faq", href: "/#faq-section" },
] as const;

export const contactHref = "/#cta-section";

export const sitemap = [
  { key: "home", href: "/" },
  { key: "work", href: "/cases" },
  { key: "contact", href: "/#cta-section" },
] as const;

// The live site links LinkedIn to https://linkedin.com and Workana to https://behance.net,
// which are placeholders. Until Diego supplies the real profile URLs these point at the
// services' home pages; replace `href` when known.
export const social = [
  { label: "LinkedIn", href: "https://www.linkedin.com/", needsReview: true },
  { label: "Workana", href: "https://www.workana.com/", needsReview: true },
];
