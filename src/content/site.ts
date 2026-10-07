// Shared site data: navigation, contact and footer.

export const site = {
  name: "Webcraftz",
  url: "https://www.webcraftz.com.br",
  email: "contact@webcraftz.com.br",
  timeZone: "America/Sao_Paulo",
  /** Contact buttons ("Contato", "Iniciar projeto") open this profile in a new tab. */
  workana: "https://www.workana.com/freelancer/0c943e82affa62666714b017f2daabd2",
};

// Paths are the Portuguese ones; components prefix them with localePath(). Labels are in
// the dictionaries under header.nav and footer.sitemap.
export const nav = [
  { key: "about", href: "/#why-us-showup-trigger" },
  { key: "cases", href: "/cases" },
  { key: "services", href: "/#features-content-showup-trigger" },
  { key: "journey", href: "/#journey-content" },
  { key: "faq", href: "/#faq-section" },
] as const;

export const contactHref = site.workana;

export const sitemap = [
  { key: "home", href: "/" },
  { key: "work", href: "/cases" },
  { key: "contact", href: "/#cta-section" },
] as const;

// The live site links LinkedIn to https://linkedin.com, a placeholder. Until Diego supplies
// the real profile URL it points at the service's home page; replace `href` when known.
export const social = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/webcraftz/", needsReview: false },
  { label: "Workana", href: site.workana },
];
