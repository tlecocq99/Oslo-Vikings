import Image from "next/image";
import Link from "next/link";
import { getImageLoaderProps } from "@/lib/imageLoader";
import styles from "./Hero.module.css";

interface HeroImage {
  filename: string;
  alt?: string;
  mobileFilename?: string;
  mobileAlt?: string;
}

interface HeroProps {
  title?: string;
  subtitle?: string;
  background_image?: HeroImage;
  mobile_background_image?: {
    filename: string;
    alt?: string;
  };
  cta_text?: string;
  cta_link?: {
    url: string;
  };
}

export default function Hero({
  title,
  subtitle,
  background_image,
  mobile_background_image,
  cta_text,
  cta_link,
}: HeroProps) {
  const heroImageSrc =
    background_image?.filename ?? "/images/backgrounds/testBG1.png";
  const heroImageAlt = background_image?.alt ?? title ?? "Oslo Vikings";
  const heroMobileImageSrc =
    background_image?.mobileFilename ??
    mobile_background_image?.filename ??
    "/images/backgrounds/mobileHero.png";
  const heroImageLoaderProps = getImageLoaderProps(heroImageSrc);
  const href = cta_link?.url ?? "/recruitment";
  const ariaLabel =
    cta_text || subtitle || "Explore Oslo Vikings recruitment opportunities";

  return (
    <Link href={href} aria-label={ariaLabel} className={styles.link}>
      <span className="sr-only">{ariaLabel}</span>

      <picture className={styles.picture}>
        <source media="(max-width: 767px)" srcSet={heroMobileImageSrc} />
        <Image
          src={heroImageSrc}
          alt={heroImageAlt}
          fill
          priority
          sizes="100vw"
          className={styles.image}
          {...heroImageLoaderProps}
        />
      </picture>

      <div className={styles.overlay} />

      <div className={styles.ctaContainer}>
        <p className={styles.ctaText}>
          What are you waiting for?
          <span className={styles.ctaHighlight}>Click to join OV Now.</span>
        </p>
      </div>

      <div className={styles.gradient} />
    </Link>
  );
}
