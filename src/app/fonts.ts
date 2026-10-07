import localFont from "next/font/local";

// Self-hosted copies of the faces the live site serves (Latin subset).
export const anton = localFont({
  src: "../fonts/Anton-400.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-anton",
  display: "swap",
});

export const inter = localFont({
  src: [
    { path: "../fonts/Inter-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Inter-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Inter-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Inter-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const jetbrains = localFont({
  src: "../fonts/JetBrainsMono-500.woff2",
  weight: "500",
  style: "normal",
  variable: "--font-jetbrains",
  display: "swap",
});

// Moon 2.0 Bold: the Webcraftz wordmark face.
export const moon = localFont({
  src: "../fonts/Moon2.0-Bold.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-moon",
  display: "swap",
});
