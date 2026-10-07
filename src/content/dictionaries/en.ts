// English. Headings follow the English lines Diego used on the live phone layout
// ("Ideas into Working Products", "Built to Work", "Work that moves").
import type { Dictionary } from "./pt";

export const en: Dictionary = {
  meta: {
    title: "Webcraftz — from spark to orbit.",
    description:
      "For founders and companies that need more than a website. Web apps, AI assistants and automations, delivered through a clear process, from first idea to launch and beyond.",
    skipLink: "Skip to content",
  },

  header: {
    nav: { about: "About", cases: "Work", services: "Services", journey: "Journey", faq: "FAQ" },
    contact: "Contact",
    homeLabel: "home page",
    mainNav: "Main",
    mobileNav: "Mobile menu",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
  },

  startProjectSubject: "New project",

  home: {
    hero: {
      title: [
        { text: "Ideas Into", accent: false },
        { text: "Working", accent: true },
        { text: "Products.", accent: true },
      ],
      lead: "Websites, web apps, AI assistants and automations, designed and built end to end by a developer with more than 13 years of experience.",
      techLabel: "Technologies",
    },
    values: {
      eyebrow: "Why Work With Me",
      title: { text: "Built to Work.", accent: "Built to Last." },
      items: [
        { title: "Launch with Confidence", body: "Ship a tested, secure product that is ready for real users." },
        { title: "One Point of Contact", body: "Design, code, AI and infrastructure, all with the same person." },
        { title: "Move Faster", body: "Automations and AI remove the manual work that slows your team down." },
        { title: "Proven Experience", body: "More than 13 years building for startups and major brands." },
      ],
    },
    services: {
      eyebrow: "What I Build",
      title: { text: "Everything Your Product Needs.", accent: "Done the Right Way." },
      items: [
        { title: "Web Applications", body: "Full-stack apps with React, Next.js and solid APIs." },
        { title: "Websites & E-commerce", body: "Sites and stores built to perform and sell." },
        { title: "UI/UX", body: "Interfaces people understand at first glance." },
        { title: "AI Assistants & RAG", body: "Chatbots that answer from your own documents and data." },
        { title: "Process Automation", body: "n8n workflows that connect your tools and cut manual work." },
        { title: "Deployment & Support", body: "Hosting, security and care long after launch." },
      ],
    },
    journey: {
      srTitle: "Project journey",
      steps: [
        { title: "Spark", body: "We turn your idea into a clear plan, scope and budget." },
        { title: "Shape", body: "We design the experience before the first line of code." },
        { title: "Build", body: "We develop the product, the integrations and the automations." },
        { title: "Test Drive", body: "We refine every detail with your real feedback." },
        { title: "Liftoff", body: "A safe launch, configured and ready to grow." },
      ],
    },
    clients: { eyebrow: "Companies that trusted my work", label: "Clients" },
    selectedWork: {
      eyebrow: "Selected Work",
      title: { text: "Work That", accent: "Moves" },
      cta: "All Projects",
    },
    testimonials: {
      title: { text: "Approved By", accent: "Clients." },
      rating: "Rated 4.89/5 across more than 200 projects on Workana.",
      label: "Testimonials",
    },
    faq: {
      eyebrow: "Frequently Asked Questions",
      title: { text: "Questions", accent: "& Answers." },
      items: [
        {
          q: "What kind of projects do you take on?",
          a: "Websites, e-commerce, full-stack web apps, AI assistants and RAG, and n8n automations. If it runs on the web, it can most likely be built.",
        },
        {
          q: "How does a project start?",
          a: "With a quick call to understand your goals. Then you get a clear scope, timeline and budget before any work begins.",
        },
        {
          q: "How long does a project take?",
          a: "It depends on the scope. A landing page can take days; a custom application, weeks. You get a realistic timeline from the start, with frequent updates.",
        },
        {
          q: "Can you work with my current site or system?",
          a: "Yes. I can improve, migrate or integrate with what you already have, whether that is WordPress, WooCommerce, a custom app or the tools you use today.",
        },
        {
          q: "What happens after launch?",
          a: "I take care of deployment, domain and SSL, and offer ongoing support for updates, fixes and new features whenever you need them.",
        },
        {
          q: "Can AI and automation really help my business?",
          a: "If your team repeats the same tasks, answers the same questions or moves data between tools, yes. We start by finding where it saves real time.",
        },
      ],
    },
    cta: {
      eyebrow: "Next step",
      title: ["Got an idea?", "Let's put it", "in orbit."],
      button: "Start a Project",
      mailLead: "or write to",
    },
    loader: { caption: "Preparing for orbit" },
  },

  footer: {
    eyebrow: "Ready to start?",
    lead: ["Let's build, launch", "and keep it moving."],
    sitemapTitle: "Sitemap",
    sitemap: { home: "Home", work: "Work", contact: "Contact" },
    socialTitle: "Social",
    studioTitle: "Studio",
    location: ["Rio Grande do Sul,", "Brazil"],
    clockPlace: "Brazil",
    copyright: "© Webcraftz. All rights reserved.",
    reach: "Brazil — Serving clients worldwide",
  },

  work: {
    metaTitle: "Work",
    kicker: "Case studies",
    title: "In Orbit",
    intro:
      "Websites, apps and identities made to leave a mark, not just to launch. Every project here started as a spark that needed direction.",
    categories: {
      all: "All work",
      websites: "Websites",
      ecommerce: "E-commerce",
      "web-apps": "Web Apps",
      "ai-automacao": "AI & Automation",
    },
    filterLabel: "Filter projects by category",
    liveCount: "{count} projects in {label}",
    empty: "No projects in this category yet.",
    showAll: "See all work",
  },

  caseStudy: {
    back: "All work",
    client: "Client",
    year: "Year",
    discipline: "Discipline",
    services: "Services",
    visit: "Visit the site",
    storyLabel: "(Case study)",
    challenge: "The challenge",
    approach: "Our approach",
    result: "The result",
    metricsLabel: "Results",
    galleryLabel: "Gallery",
    nextNav: "Next project",
    nextLabel: "(Next project)",
  },
};
