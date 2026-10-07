// Builds the 1200×630 JPEG share images (Open Graph / Twitter) in public/images/og/:
//   default.jpg  from public/images/scene-hero.jpg (home, /cases)
//   <slug>.jpg   from public/images/projects/<slug>/cover.* (each case study)
// Run after adding a project or changing a cover: npm run og-images
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..", "public", "images");
const out = path.join(root, "og");
await mkdir(out, { recursive: true });

async function render(src, name) {
  const { size } = await sharp(src)
    .resize(1200, 630, { fit: "cover", position: sharp.strategy.attention })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(out, `${name}.jpg`));
  console.log(`og/${name}.jpg  ${Math.round(size / 1024)} KB`);
}

await render(path.join(root, "scene-hero.jpg"), "default");

const projects = path.join(root, "projects");
for (const slug of await readdir(projects)) {
  const cover = (await readdir(path.join(projects, slug))).find((f) => /^cover\.(jpe?g|png|webp)$/.test(f));
  if (cover) await render(path.join(projects, slug, cover), slug);
}
