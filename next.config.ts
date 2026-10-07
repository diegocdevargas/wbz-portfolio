import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The live site published this case under a misspelled slug; keep old links working.
  async redirects() {
    return [
      { source: "/cases/athie-wonhrath", destination: "/cases/athie-wohnrath", permanent: true },
      { source: "/:locale(en|es)/cases/athie-wonhrath", destination: "/:locale/cases/athie-wohnrath", permanent: true },
    ];
  },
};

export default nextConfig;
