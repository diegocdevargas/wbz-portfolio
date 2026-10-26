"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useGSAP } from "@gsap/react";
import styles from "./ParallaxShape.module.css";

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin, useGSAP);

type Vec = [number, number, number];
/** `caps` counts the leading faces that are flat ends; the rest are sides. */
type Solid = { verts: Vec[]; faces: number[][]; smooth: boolean; caps: number };

/** A prism (rTop = r), frustum (0 < rTop < r) or pyramid/cone (rTop = 0) on an n-sided base. */
function solid(n: number, r: number, h: number, rTop = r, phase = 0): Solid {
  const ring = (y: number, radius: number): Vec[] =>
    Array.from({ length: n }, (_, i) => {
      const a = phase + (i / n) * Math.PI * 2;
      return [Math.cos(a) * radius, y, Math.sin(a) * radius];
    });
  const bottom = ring(-h, r);
  const faces: number[][] = [bottom.map((_, i) => i)];
  if (rTop === 0) {
    const apex = n;
    for (let i = 0; i < n; i++) faces.push([i, (i + 1) % n, apex]);
    return { verts: [...bottom, [0, h, 0]], faces, smooth: n > 12, caps: 1 };
  }
  faces.push(bottom.map((_, i) => n + i));
  for (let i = 0; i < n; i++) faces.push([i, (i + 1) % n, n + ((i + 1) % n), n + i]);
  return { verts: [...bottom, ...ring(h, rTop)], faces, smooth: n > 12, caps: 2 };
}

const YAW = 0.42;
const PITCH = 0.42;
const SCALE = 17;
const CENTER = 32;

/**
 * Draws a convex solid as line art, like a geometry textbook: an edge is solid when a face next
 * to it faces the viewer, dashed when both faces turn away. Curved sides (cylinder, cone) only
 * draw their silhouette. Returns [visible, hidden] path data in a 64×64 box.
 */
function draw({ verts, faces, smooth, caps }: Solid): [string, string] {
  const [cy, sy, cp, sp] = [Math.cos(YAW), Math.sin(YAW), Math.cos(PITCH), Math.sin(PITCH)];
  const p = verts.map(([x, y, z]): Vec => {
    const [x1, z1] = [x * cy - z * sy, x * sy + z * cy];
    return [x1, y * cp - z1 * sp, y * sp + z1 * cp];
  });
  const centroid = p.reduce((s, v) => [s[0] + v[0] / p.length, s[1] + v[1] / p.length, s[2] + v[2] / p.length], [0, 0, 0]);
  const edges = new Map<string, { front: boolean[]; lateral: number }>();
  for (const [fi, f] of faces.entries()) {
    const [a, b, c] = f.map((i) => p[i]);
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const out = n[0] * (a[0] - centroid[0]) + n[1] * (a[1] - centroid[1]) + n[2] * (a[2] - centroid[2]);
    const front = (out < 0 ? -n[2] : n[2]) > 0;
    for (let i = 0; i < f.length; i++) {
      const [i0, i1] = [f[i], f[(i + 1) % f.length]].sort((m, k) => m - k);
      const key = `${i0}-${i1}`;
      const e = edges.get(key) ?? { front: [], lateral: 0 };
      e.front.push(front);
      if (smooth && fi >= caps) e.lateral++;
      edges.set(key, e);
    }
  }
  const point = (i: number) => `${(CENTER + p[i][0] * SCALE).toFixed(1)} ${(CENTER - p[i][1] * SCALE).toFixed(1)}`;
  let visible = "";
  let hidden = "";
  for (const [key, e] of edges) {
    const [i0, i1] = key.split("-").map(Number);
    const seg = `M${point(i0)}L${point(i1)}`;
    const shown = e.front.some(Boolean);
    // On a curved side only the silhouette (one face toward, one away) is an edge.
    if (e.lateral === 2 && (!shown || e.front.every(Boolean))) continue;
    if (shown) visible += seg;
    else hidden += seg;
  }
  // MorphSVG needs something to morph from; an empty hidden set becomes a dot at the centre.
  return [visible, hidden || `M${CENTER} ${CENTER}L${CENTER} ${CENTER}`];
}

// The reference sheet's solids, built once per module rather than per render.
const SOLIDS = {
  cube: draw(solid(4, 1.25, 0.9, 1.25, Math.PI / 4)),
  hexPrism: draw(solid(6, 1, 1)),
  octPrism: draw(solid(8, 0.95, 1.1)),
  triPrism: draw(solid(3, 1.15, 0.95)),
  pentPrism: draw(solid(5, 1.05, 0.85)),
  cylinder: draw(solid(28, 0.9, 1.05)),
  cone: draw(solid(28, 1, 1.1, 0)),
  frustum: draw(solid(28, 1, 0.75, 0.55)),
  tetra: draw(solid(3, 1.15, 1.05, 0)),
  pyramid: draw(solid(4, 1.15, 1.05, 0, Math.PI / 4)),
  hexPyramid: draw(solid(6, 1.05, 1.15, 0)),
  slab: draw(solid(4, 1.2, 0.55, 0.85, Math.PI / 4)),
};
type Name = keyof typeof SOLIDS;

// Each figure follows the page down at a slightly different pace (`speed` of the full distance),
// sways sideways through its own fixed offsets (`sway`, px) and walks through its run of solids.
// The offsets are fixed rather than random so the drift looks loose but is the same every visit.
const LAYERS: { className: string; speed: number; turn: number; sway: number[]; run: Name[] }[] = [
  {
    className: styles.a,
    speed: 1,
    turn: 10,
    sway: [0, 14, -8, 10, -6, 0],
    run: ["cube", "hexPrism", "octPrism", "slab", "pentPrism", "triPrism", "hexPrism", "cube"],
  },
  {
    className: styles.b,
    speed: 0.9,
    turn: -6,
    sway: [0, -12, 6, -16, 8, 0],
    run: ["cylinder", "frustum", "cone", "cylinder", "frustum", "hexPyramid", "cone", "cylinder"],
  },
  {
    className: styles.c,
    speed: 0.8,
    turn: -12,
    sway: [0, 8, -14, 6, -10, 0],
    run: ["pyramid", "tetra", "hexPyramid", "triPrism", "pyramid", "slab", "tetra", "pyramid"],
  },
];

/**
 * A decorative cluster of wireframe solids that travel down with the case study as it scrolls,
 * from the story to the end of the gallery, morphing from one solid into the next (GSAP MorphSVG,
 * scrubbed by ScrollTrigger). Only transforms and three small paths change; with reduced motion
 * the first solids stay still.
 */
export function ParallaxShape({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        // The figures stop where the case study ends: at the next-project link, or the article's end.
        const article = el.closest("article");
        const end = article?.querySelector("nav") ?? article ?? el;
        const distance = () =>
          Math.max(0, (end === article ? end.getBoundingClientRect().bottom : end.getBoundingClientRect().top) - el.getBoundingClientRect().bottom - 40);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top 35%",
            endTrigger: end,
            end: end === article ? "bottom bottom" : "top bottom",
            // A long catch-up makes the figures glide behind the scroll instead of following it hard.
            scrub: 2,
            invalidateOnRefresh: true,
          },
        });
        el.querySelectorAll<SVGSVGElement>("svg").forEach((svg, i) => {
          const { speed, turn, sway, run } = LAYERS[i];
          tl.fromTo(svg, { y: 0, rotate: 0 }, { y: () => distance() * speed, rotate: turn, duration: 1, ease: "sine.inOut" }, 0);
          tl.to(svg, { keyframes: { x: sway, ease: "sine.inOut" }, duration: 1 }, 0);
          const [line, dash] = svg.querySelectorAll("path");
          const step = 1 / (run.length - 1);
          run.slice(1).forEach((name, k) => {
            const [v, h] = SOLIDS[name];
            // Hold each solid for a short beat, then ease slowly into the next one.
            const at = k * step + step * 0.2;
            tl.to(line, { morphSVG: v, duration: step * 0.8, ease: "sine.inOut" }, at);
            tl.to(dash, { morphSVG: h, duration: step * 0.8, ease: "sine.inOut" }, at);
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className ? `${styles.shape} ${className}` : styles.shape} aria-hidden="true">
      {LAYERS.map(({ className: layer, run }) => {
        const [v, h] = SOLIDS[run[0]];
        return (
          <svg key={layer} className={`${styles.layer} ${layer}`} viewBox="0 0 64 64" fill="none">
            <path d={v} className={styles.line} />
            <path d={h} className={styles.dash} />
          </svg>
        );
      })}
    </div>
  );
}
