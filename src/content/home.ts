// Home structure that does not change between languages. The copy lives in
// content/dictionaries (pt.ts is the main language).

export type IconName =
  | "rocket"
  | "handshake"
  | "bolt"
  | "award"
  | "window"
  | "bag"
  | "pen"
  | "sparkles"
  | "route"
  | "cloud";

/** Hero marquee, in the live order. Files live in /public/images/tech. */
export const techMarks = [
  "javascript",
  "css3",
  "html5",
  "typescript",
  "react",
  "php",
  "wordpress",
  "laravel",
  "vercel",
  "git",
  "nextjs",
  "tailwindcss",
  "sass",
  "github",
  "unidentified-caped-figure",
  "threejs",
  "framer",
  "inkscape",
  "figma",
  "postgresql",
  "ionic",
  "nodejs",
  "supabase",
  "unidentified-drop",
  "cloudflare",
  "aws",
] as const;

/** Icon and side for each "Por que trabalhar comigo" card, matching dictionary order. */
export const valueLayout: { icon: IconName; side: "left" | "right" }[] = [
  { icon: "rocket", side: "left" },
  { icon: "handshake", side: "left" },
  { icon: "bolt", side: "right" },
  { icon: "award", side: "right" },
];

/** Icon for each service card, matching dictionary order. */
export const serviceIcons: IconName[] = ["window", "bag", "pen", "sparkles", "route", "cloud"];

export const clientLogos = [
  { name: "Bradesco", file: "bradesco" },
  { name: "CAIXA", file: "caixa" },
  { name: "Cargill", file: "cargill" },
  { name: "Santander", file: "santander" },
  { name: "Xiaomi", file: "xiaomi" },
];
