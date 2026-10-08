# Cursor concepts

The site uses the **Coordinates** cursor ([`src/components/ui/cursor/CoordsCursor.tsx`](../src/components/ui/cursor/CoordsCursor.tsx)), chosen in October 2026 after comparing four concepts side by side. This note keeps the other three so they can be brought back.

All of them follow the same rules: they run only with a fine pointer (mouse) and no reduced-motion preference, hide the native pointer only while running, react to `[data-cursor-target]` elements, and use `mix-blend-mode: difference` so they stay visible on black and violet.

## Reticle (the previous cursor)

A 4 px dot and four corner brackets that spin once every 2 s. Over a target, the brackets stop at the nearest right angle and frame the element. It matched the live webcraftz.com.br cursor.

It is self-contained and lives in git history:

```sh
git show b445b6b:src/components/ui/Cursor.tsx
git show b445b6b:src/components/ui/Cursor.module.css
```

To restore it, check out both files at that commit and render `<Cursor />` from `@/components/ui/Cursor` in `src/app/[locale]/layout.tsx`.

## Orbit

A dot with a faint ring and a small satellite circling it, echoing the 3D orbit scene. Over a target, the ring stretches into a rounded outline around the element and the satellite parks on its top-right corner. Holding the mouse button spins the satellite faster.

## Lens

A small inverting disc that trails the pointer. Over a target, it grows and shows the action word ("View", "Open ↗", "Click", or the target's `data-cursor-label`). Pressing squeezes it.

## Restoring Orbit or Lens

These two were never committed, so their full source is below. Both plug into the shared engine in [`src/components/ui/cursor/cursorEngine.ts`](../src/components/ui/cursor/cursorEngine.ts). Save the files into `src/components/ui/cursor/` and render the component in place of `<CoordsCursor />` in `src/app/[locale]/layout.tsx`.

### `OrbitCursor.tsx`

```tsx
"use client";

import { useRef } from "react";
import { jump, part, spring, step, useCursor, type CursorSetup } from "./cursorEngine";
import base from "./CursorBase.module.css";
import styles from "./OrbitCursor.module.css";

/**
 * Concept 2, "Orbit": a dot with a faint ring and a small satellite circling it, echoing
 * the 3D orbit scene. Over a `[data-cursor-target]` the ring stretches into a rounded
 * outline around the element and the satellite parks on its top-right corner. Holding
 * the button spins the satellite faster.
 */
const REST = 36;
const PAD = 12;
const CORNER = 12;
const TURN_SECONDS = 1.6;
const FAST_TURN_SECONDS = 0.4;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const setup: CursorSetup = (el) => {
  const follow = part(el, "follow");
  const dot = part(el, "dot");
  const ring = part(el, "ring");
  const sat = part(el, "sat");

  const x = spring(0);
  const y = spring(0);
  const ox = spring(0);
  const oy = spring(0);
  const w = spring(REST);
  const h = spring(REST);
  const mix = spring(0);
  let angle = 0;
  let speed = 360 / TURN_SECONDS;

  return (f) => {
    if (f.entered) {
      jump(x, f.x);
      jump(y, f.y);
    }
    x.target = f.x;
    y.target = f.y;

    if (f.target) {
      const r = f.target.getBoundingClientRect();
      w.target = r.width + PAD;
      h.target = r.height + PAD;
      ox.target = r.left + r.width / 2 - f.x;
      oy.target = r.top + r.height / 2 - f.y;
      mix.target = 1;
    } else {
      w.target = h.target = REST;
      ox.target = oy.target = 0;
      mix.target = 0;
    }

    const wanted = 360 / (f.pressed ? FAST_TURN_SECONDS : TURN_SECONDS);
    speed += (wanted - speed) * Math.min(1, f.dt * 6);
    angle = (angle + speed * f.dt) % 360;

    for (const s of [x, y, ox, oy, w, h, mix]) step(s, f.dt);

    const m = Math.min(1, Math.max(0, mix.value));
    const rw = Math.max(0, w.value);
    const rh = Math.max(0, h.value);
    const radius = lerp(Math.min(rw, rh) / 2, Math.min(CORNER, rh / 2), m);
    const scale = f.pressed ? 0.85 : 1;

    follow.style.transform = `translate3d(${x.value}px, ${y.value}px, 0)`;
    dot.style.transform = `translate(-50%, -50%) scale(${f.pressed ? 0.8 : 1})`;
    ring.style.width = `${rw}px`;
    ring.style.height = `${rh}px`;
    ring.style.borderRadius = `${radius}px`;
    ring.style.transform = `translate(${ox.value}px, ${oy.value}px) translate(-50%, -50%) scale(${scale})`;

    // Orbit point on the (possibly stretched) ring, blended into the top-right corner.
    const a = (angle * Math.PI) / 180;
    const orbitX = ox.value + (rw / 2) * scale * Math.cos(a);
    const orbitY = oy.value + (rh / 2) * scale * Math.sin(a);
    const inset = radius * (1 - Math.SQRT1_2);
    const cornerX = ox.value + (rw / 2 - inset) * scale;
    const cornerY = oy.value - (rh / 2 - inset) * scale;
    sat.style.transform = `translate(${lerp(orbitX, cornerX, m)}px, ${lerp(orbitY, cornerY, m)}px) translate(-50%, -50%)`;
  };
};

export function OrbitCursor() {
  const root = useRef<HTMLDivElement>(null);
  const enabled = useCursor(root, setup);
  if (!enabled) return null;

  return (
    <div ref={root} className={base.root} aria-hidden="true">
      <div data-part="follow" className={styles.follow}>
        <div data-part="ring" className={styles.ring} />
        <div data-part="dot" className={styles.dot} />
        <div data-part="sat" className={styles.sat} />
      </div>
    </div>
  );
}
```

### `OrbitCursor.module.css`

```css
.follow {
  position: absolute;
  left: 0;
  top: 0;
}

.ring,
.dot,
.sat {
  position: absolute;
  left: 0;
  top: 0;
}

.ring {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ffffff;
}

.sat {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ffffff;
}
```

### `LensCursor.tsx`

```tsx
"use client";

import { useRef } from "react";
import { actionLabel, jump, part, spring, step, useCursor, type CursorSetup } from "./cursorEngine";
import base from "./CursorBase.module.css";
import styles from "./LensCursor.module.css";

/**
 * Concept 3, "Lens": a small inverting disc that trails the pointer a little. Over a
 * `[data-cursor-target]` it grows, and shows the action word when the target has one
 * (`data-cursor-label` overrides the inferred word). Pressing squeezes it.
 */
const REST = 14;
const PLAIN = 40;
const LABELED = 76;

const setup: CursorSetup = (el) => {
  const follow = part(el, "follow");
  const disc = part(el, "disc");
  const label = part(el, "label");

  const x = spring(0);
  const y = spring(0);
  const size = spring(REST);
  let text = "";
  let labeled = false;

  return (f) => {
    if (f.entered) {
      jump(x, f.x);
      jump(y, f.y);
    }
    x.target = f.x;
    y.target = f.y;

    const word = f.target ? actionLabel(f.target) : null;
    size.target = f.target ? (word ? LABELED : PLAIN) : REST;
    if (word && word !== text) {
      text = word;
      label.textContent = word;
    }
    if (!!word !== labeled) {
      labeled = !!word;
      if (labeled) el.dataset.labeled = "";
      else delete el.dataset.labeled;
    }

    // Softer than the reticle so the disc trails the pointer.
    step(x, f.dt, 220, 21);
    step(y, f.dt, 220, 21);
    step(size, f.dt);

    const d = Math.max(0, size.value);
    follow.style.transform = `translate3d(${x.value}px, ${y.value}px, 0)`;
    disc.style.width = disc.style.height = `${d}px`;
    disc.style.transform = `translate(-50%, -50%) scale(${f.pressed ? 0.85 : 1})`;
  };
};

export function LensCursor() {
  const root = useRef<HTMLDivElement>(null);
  const enabled = useCursor(root, setup);
  if (!enabled) return null;

  return (
    <div ref={root} className={base.root} aria-hidden="true">
      <div data-part="follow" className={styles.follow}>
        <div data-part="disc" className={styles.disc}>
          <span data-part="label" className={styles.label} />
        </div>
      </div>
    </div>
  );
}
```

### `LensCursor.module.css`

```css
.follow {
  position: absolute;
  left: 0;
  top: 0;
}

.disc {
  position: absolute;
  left: 0;
  top: 0;
  display: grid;
  place-items: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ffffff;
}

/* Black under `difference` leaves the page as is, so the word reads dark on the inverted disc. */
.label {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  color: #000000;
  opacity: 0;
  transition: opacity 0.15s;
}

[data-labeled] .label {
  opacity: 1;
  transition-delay: 0.08s;
}
```

