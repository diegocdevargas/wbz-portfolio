// English copy for the case studies. Structural data (slugs, years, images, links) lives in projects.ts.
import type { ProjectCopy } from "./projects";

export const projectsEn: Record<string, ProjectCopy> = {
  "azeitonas-verdes": {
    subtitle: "Punk rock theme",
    discipline: "Branding",
    services: ["Identity", "Branding", "Website", "Design System"],
    coverAlt: "Live show with the crowd's arms raised in front of a stage lit in green",
    challenge:
      "Azeitonas Verdes is a power trio from the countryside of Rio Grande do Sul playing raw, straight-ahead punk rock with a psychedelic streak. Their music, videos and show dates were scattered across social media. The band needed a home of its own that sounded the way it looks: loud, sticky and a little out of control, while still making it easy to find the next show or hit play.",
    approach:
      "We built the brand around one image: the olive as goo. A dripping logo with offset purple and yellow outlines recalls the misaligned photocopies of punk. SVG goo filters make the olives melt and merge, pulsing in sync with the music. The system is lean: a near-black stage, a single acid green as the accent color, purple and yellow saved for psychedelic touches, condensed poster type and terminal-style `//` labels that hold the chaos together. Each section works like a track on a record: about, videos, discography, shows, gallery, the band (\"the ingredients in the jar\") and contact.",
    result:
      "The band now has a single hub of its own for live videos, releases and tour dates, with an identity strong enough for posters, merch and stage visuals.",
    metrics: [
      { value: "100", label: "Lighthouse Performance (desktop)" },
      { value: "95", label: "Lighthouse Performance (mobile)" },
      { value: "100", label: "Accessibility, Best Practices and SEO" },
    ],
    galleryAlts: [
      "Azeitonas Verdes logo artwork with dripping green letters and an olive with a face",
      "Illustration of a green olive melting in space, surrounded by purple rings",
      "Psychedelic illustration of an olive with a guitar on a planet, in green, purple and blue",
    ],
  },
  sulboro: {
    subtitle: "Agribusiness / Plant nutrition",
    discipline: "Branding",
    services: ["Website", "Custom WordPress Theme", "Content Architecture", "Figma to code"],
    coverAlt: "Aerial view of a farmer in a hat standing in the middle of a cornfield",
    challenge:
      "Sulboro supplies sodium octaborate to Brazilian agriculture. Its BoroTop line has been applied to more than 22 million hectares across more than 30 crops. The science behind the product is solid, but boron is a hard sell: a micronutrient that growers and agronomists tend to put on the back burner. Sulboro needed a site that explained the product crop by crop, built technical credibility and turned interest into quote requests, without making growers dig for information in a PDF.",
    approach:
      "We organized the site around a line from the brand itself: \"boron is a micronutrient with macro functions.\" Instead of opening with chemistry, each crop gets its own guide with the same three answers: the benefits of using it, how much boron is needed per hectare and the deficiency symptoms to watch for. There are 15 crops, from soybeans, corn and coffee to grapes and eucalyptus, in a consistent structure an agronomist can read in seconds. The visual system is clean and field-ready: white space, a vivid agricultural green and the KoHo typeface for a friendly yet technical voice. Big scale numbers back up the proof. The three BoroTop products, the field trials, the dealer map and events each get their own page. A \"Request a quote\" button on WhatsApp is always within reach.",
    result:
      "Sulboro now has a technical sales tool, not a digital brochure. Growers find their crop, see the recommended rate and the symptoms to check, and request a quote in one tap. The custom WordPress theme lets the team add crops, trials, events and job openings without touching code, and it shipped with SEO and Google Site Kit set up from day one.",
    metrics: [
      { value: "15", label: "Crop guides" },
      { value: "3", label: "Product lines" },
      { value: "1 tap", label: "From crop guide to a WhatsApp quote" },
    ],
    galleryAlts: [
      "Sulboro website type guide with the KoHo typeface and the green palette",
      "Sulboro website home page shown on a laptop",
      "Full Sulboro home page, from header to footer",
    ],
  },
  "mi-brasil": {
    subtitle: "Official e-commerce / Consumer electronics",
    discipline: "Digital",
    services: ["E-commerce", "Front-end Development", "UI Implementation", "LINX Commerce"],
    coverAlt: "Man with a black crossbody bag over a brown jacket, in a product photo",
    challenge:
      "Mi Brasil is Xiaomi's official online store in Brazil, where smartphones, smart home devices, wearables and everyday products reach Brazilian shoppers with an official warranty. The catalog is huge and constantly changing, launches follow tight global schedules, and the store has to be unmistakably Xiaomi while still working for Brazilian shoppers: 12 interest-free installments, a cash discount for paying up front, free shipping above a minimum order and local customer support.",
    approach:
      "We built the store on Oracle Commerce Cloud, bringing Xiaomi's global visual language to a local store. MiSans runs throughout the site, the signature orange is reserved for actions and offers, and black and white do the rest. Navigation follows the way people actually shop: phones, smartwatches, smart home, everyday, beauty and health, and audio, each opening focused subcategories, from chargers to robot vacuums. The purchase drivers Brazilian shoppers care about get a permanent spot: installments, the cash discount, free shipping and the official warranty badge sit right below the header, so trust and price are answered before the first scroll. Category carousels, exclusive-deal showcases and modular banners let the team swap campaigns and launches without new development.",
    result:
      "Xiaomi Brasil runs a single official channel that scales from everyday accessories to flagship launches. Merchandising teams swap campaigns, offers and new products using reusable components, while analytics, marketing automation and customer service chat all connect to the same store.",
    metrics: [
      { value: "7", label: "Product categories" },
      { value: "30", label: "Subcategories" },
      { value: "12x", label: "Interest-free installments built into checkout" },
    ],
    galleryAlts: [
      "Woman lying down and smiling while holding a Xiaomi smartphone",
      "Woman showing a Xiaomi smartwatch on her wrist",
      "Person wearing Xiaomi wireless earbuds",
    ],
  },
  "athie-wohnrath": {
    subtitle: "Corporate architecture and construction",
    discipline: "Branding",
    services: ["UX/UI Design", "Website", "Custom WordPress Theme", "Accessibility"],
    coverAlt: "Corporate office with high ceilings, wood, plants and armchairs",
    challenge:
      "Athié | Wohnrath is one of Latin America's leading corporate architecture and construction firms: 30 years in business, more than 1,000 direct employees and more than 32 million m² delivered. The work is precise, large-scale and certified, but the site had to cover three businesses at once (architecture, construction and retrofit) and speak to C-level clients, facilities managers and future employees without turning into a project database.",
    approach:
      "We let the scale speak. The home page opens with the company's credentials in big numbers: 30 years, more than 1,000 employees, 32 million m² delivered and 114 LEED-certified projects. Then come the three business lines, each with its own chapter. The visual system comes from the firm's own drawings: generous white space, Montserrat for clean reading, Gotham Black for the numbers that need to land, and the brand purple and teal used sparingly as wayfinding colors. Featured projects rotate in a carousel to keep the portfolio visual and up to date, and the GPTW 2025 seal gives the employer brand its moment. Accessibility is part of the foundation, not an afterthought: an on-page toolbar offers text resizing, grayscale, high contrast, negative contrast, underlined links and a readable font, plus a privacy-first cookie consent.",
    result:
      "Athié | Wohnrath now has a corporate site that reads like its buildings: structured, calm and confident. The custom WordPress theme lets marketing publish new projects, update figures and add campaigns on its own, and the accessibility layer makes the site work for every visitor, not just the average one.",
    metrics: [
      { value: "4", label: "Credential metrics opening the home page" },
      { value: "3", label: "Business lines, each with its own chapter" },
      { value: "7", label: "Built-in accessibility modes" },
    ],
    galleryAlts: [
      "Athié Wohnrath website type guide with the Gotham and Montserrat typefaces",
      "Athié Wohnrath website home page shown on a laptop",
      "Full Athié Wohnrath home page, from header to footer",
    ],
  },
  ceunsa: {
    subtitle: "Spirituality and community / Umbanda center",
    discipline: "Branding",
    services: ["UX/UI Design", "Website", "Headless WordPress", "Next.js Front-end"],
    coverAlt: "Clothing rack with black garments on hangers",
    challenge:
      "Founded in Porto Alegre in 1959, CEUNSA has welcomed people for more than six decades with passes, giras and charity work. First-time visitors almost always arrive with practical questions: which day to come, what to wear, whether they need to book ahead, what they can bring. The temple needed a site that answered all of that with the same calm and warmth people feel at the door, honoring 60 years of history and the spirit guides who shaped the house.",
    approach:
      "We designed the site as a visit to the temple, one space at a time. It starts with a welcome and the temple's history, followed by the lineage of caciques and their mediums, the current board, the schedule, the spaces, visitor testimonials, a tour of the four sacred areas, hymns and prayers, FAQs and contact. The visual system is serene and luminous: a soft steel-blue palette with warm golden light, Newsreader for a respectful editorial voice and Work Sans for clear, practical reading. The schedule is the most useful feature. A calendar shows what each day holds (Pretos Velhos on Mondays, Povo do Oriente on Thursdays, Caboclos on Fridays), what to bring and the day's moon phase. Content is managed in WordPress and delivered through a fast Next.js front end.",
    result:
      "CEUNSA now has a digital home that works like its front desk: welcoming, clear and always open. First-time visitors know when to come and how to prepare before they even leave home, and the temple's volunteers update schedules, hymns and announcements in WordPress without touching the front end.",
    metrics: [
      { value: "1959", label: "Legacy brought online" },
      { value: "11", label: "Sections: a full visit, from welcome to contact" },
      { value: "3", label: "Weekly gira days in a live calendar with moon phases" },
    ],
    galleryAlts: [
      "Sewing machine in a dimly lit studio",
      "Folded red velvet fabric",
      "Black fabric in soft folds against a dark background",
    ],
  },
};
