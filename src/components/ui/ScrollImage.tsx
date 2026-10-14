import type { CSSProperties } from "react";
import Image from "next/image";
import styles from "./ScrollImage.module.css";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
};

/**
 * A very tall image (a full-page layout print) inside a fixed frame. On hover the image slides
 * up, so the layout is seen from its top to its bottom; it eases back when the pointer leaves.
 * The slide also runs while an ancestor marked `data-scroll-hover` is hovered or focused.
 * Without hover or with reduced motion, the top of the layout stays visible.
 */
export function ScrollImage({ src, alt, width, height, sizes, className }: Props) {
  // Longer layouts take longer to travel, so the scroll speed stays readable.
  const duration = Math.min(16, Math.max(5, Math.round((height / width) * 2 * 10) / 10));
  return (
    <div
      className={className ? `${styles.frame} ${className}` : styles.frame}
      style={{ "--scroll-duration": `${duration}s` } as CSSProperties}
    >
      <div className={styles.track}>
        <Image src={src} alt={alt} width={width} height={height} sizes={sizes} className={styles.image} />
      </div>
    </div>
  );
}
