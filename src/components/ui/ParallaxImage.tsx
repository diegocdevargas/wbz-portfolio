import Image from "next/image";
import { ParallaxFloat } from "./ParallaxFloat";
import styles from "./ParallaxImage.module.css";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  travel?: number;
};

/** A cut-out image (a device mock-up with a transparent background) floating with the scroll. */
export function ParallaxImage({ src, alt, sizes, travel }: Props) {
  return (
    <ParallaxFloat travel={travel}>
      <Image src={src} alt={alt} fill sizes={sizes} className={styles.image} />
    </ParallaxFloat>
  );
}
