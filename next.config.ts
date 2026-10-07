import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Files in public/ have no content hash, so cache them for 30 days (not immutable).
  // Rename a file when replacing it. /_next/static is already immutable by default.
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }];
    return [
      { source: "/images/:path*", headers: cache },
      { source: "/textures/:path*", headers: cache },
    ];
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
