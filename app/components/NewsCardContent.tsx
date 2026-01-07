import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import { getImageLoaderProps } from "@/lib/imageLoader";
import type { NewsImagePlacement } from "@/app/types/news";
import styles from "./NewsCardContent.module.css";

export interface NewsCardProps {
  title?: string;
  excerpt?: string;
  image?: {
    src?: string;
    alt?: string;
    placement?: NewsImagePlacement;
    credit?: string;
  };
  author?: string;
  date?: string;
  slug?: string;
  category?: string;
}

export function NewsCardContent({
  title,
  excerpt,
  image,
  author,
  date,
  slug,
  category,
}: NewsCardProps) {
  const href = slug ? `/news/${slug}` : "#";
  const placement: NewsImagePlacement = image?.placement ?? "top";
  const hasImage = Boolean(image?.src) && placement !== "none";
  const imageLoaderProps = getImageLoaderProps(image?.src);

  const imageContent = hasImage ? (
    <>
      <Image
        src={image?.src as string}
        alt={image?.alt || title || "News image"}
        fill
        className={styles.imageElement}
        sizes="(max-width:768px) 100vw, 400px"
        priority={false}
        {...imageLoaderProps}
      />
      <div className={styles.imageOverlay} />
    </>
  ) : (
    <div className={styles.imagePlaceholder}>{category || "News"}</div>
  );

  const imageSection = (
    <div className={styles.topImage}>
      <div className={styles.topImageInner}>{imageContent}</div>
      {category && <span className={styles.categoryBadge}>{category}</span>}
    </div>
  );

  const renderSideImageSection = (side: "left" | "right") => (
    <div
      className={clsx(
        styles.sideImage,
        side === "left" ? styles.sideImageLeft : styles.sideImageRight
      )}
    >
      <div className={styles.sideImageInner}>{imageContent}</div>
      {category && (
        <span className={clsx(styles.categoryBadge, styles.categoryBadgeSide)}>
          {category}
        </span>
      )}
    </div>
  );

  const backgroundImageStyles = hasImage
    ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url('${image?.src}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  const Content = (
    <div className={styles.content}>
      <h3 className={styles.title}>{title || "Untitled Article"}</h3>
      {excerpt && <p className={styles.excerpt}>{excerpt}</p>}

      <div className={styles.meta}>
        <span className={styles.metaItem}>
          <User className={styles.metaIcon} />
          {author || "Oslo Vikings"}
        </span>
        {date && (
          <span className={styles.metaItem}>
            <Calendar className={styles.metaIcon} />
            {date}
          </span>
        )}
      </div>

      <span className={styles.readMore}>Read full story →</span>
      {image?.credit && <p className={styles.credit}>Photo: {image.credit}</p>}
    </div>
  );

  if (placement === "background") {
    const article = (
      <article
        className={clsx(styles.article, styles.articleBackground)}
        style={backgroundImageStyles}
      >
        <div className={styles.articleBackgroundInner}>{Content}</div>
      </article>
    );
    return wrapWithLink(article);
  }

  if (placement === "left" || placement === "right") {
    const article = (
      <article className={clsx(styles.article, styles.articleSide)}>
        {placement === "left" && hasImage
          ? renderSideImageSection("left")
          : null}
        <div className={styles.articleBody}>{Content}</div>
        {placement === "right" && hasImage
          ? renderSideImageSection("right")
          : null}
      </article>
    );
    return wrapWithLink(article);
  }

  if (placement === "none" || !hasImage) {
    const article = (
      <article className={styles.article}>
        <div className={styles.noImageBanner}>
          <div className={styles.noImageBannerContent}>
            {category || "News"}
          </div>
          {category && <span className={styles.categoryBadge}>{category}</span>}
        </div>
        {Content}
      </article>
    );
    return wrapWithLink(article);
  }

  // default to top placement
  const article = (
    <article className={styles.article}>
      {imageSection}
      {Content}
    </article>
  );

  return wrapWithLink(article);

  function wrapWithLink(articleNode: JSX.Element) {
    if (!slug) {
      return articleNode;
    }

    return (
      <Link
        href={href}
        className={styles.link}
        aria-label={`Read full story: ${title || slug}`}
      >
        {articleNode}
      </Link>
    );
  }
}
