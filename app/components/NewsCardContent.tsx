import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import type { NewsImagePlacement } from "@/app/types/news";

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

  const imageContent = hasImage ? (
    <>
      <Image
        src={image?.src as string}
        alt={image?.alt || title || "News image"}
        fill
        className="object-cover transform group-hover:scale-105 transition-transform duration-500"
        sizes="(max-width:768px) 100vw, 400px"
        priority={false}
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
    </>
  ) : (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-viking-red to-viking-charcoal text-white text-xl font-semibold">
      {category || "News"}
    </div>
  );

  const imageSection = (
    <div className="relative ">
      <div className="relative h-48 overflow-hidden">{imageContent}</div>
      {category && (
        <span className="absolute top-3 left-3 bg-viking-red text-white text-xs font-semibold px-2 py-1 rounded shadow">
          {category}
        </span>
      )}
    </div>
  );

  const renderSideImageSection = (side: "left" | "right") => (
    <div
      className={`relative w-full lg:w-5/12 xl:w-4/12 min-h-[14rem] overflow-hidden ${
        side === "left"
          ? "rounded-t-lg lg:rounded-l-2xl lg:rounded-tr-none"
          : "rounded-b-lg lg:rounded-r-2xl lg:rounded-bl-none"
      }`}
    >
      <div className="absolute inset-0" />
      <div className="relative h-full w-full">{imageContent}</div>
      {category && (
        <span className="absolute top-4 left-4 bg-viking-red text-white text-xs font-semibold px-2 py-1 rounded shadow">
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
    <div className="p-6 flex flex-col h-full">
      <h3 className="text-xl font-bold text-viking-charcoal dark:text-gray-100 mb-3 line-clamp-2">
        {title || "Untitled Article"}
      </h3>
      {excerpt && (
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {excerpt}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <User className="w-4 h-4 text-viking-red" />
          {author || "Oslo Vikings"}
        </span>
        {date && (
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-viking-red" />
            {date}
          </span>
        )}
      </div>

      <Link
        href={href}
        className="mt-4 inline-block text-viking-red font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-viking-red focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-viking-charcoal/70 rounded"
        aria-label={`Read more: ${title || "article"}`}
      >
        Read more →
      </Link>
      {image?.credit && (
        <p className="mt-4 text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Photo: {image.credit}
        </p>
      )}
    </div>
  );

  if (placement === "background") {
    return (
      <article
        className="relative bg-white/90 dark:bg-viking-charcoal/80 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group border border-gray-200 dark:border-gray-700"
        style={backgroundImageStyles}
      >
        <div className="absolute inset-0" />
        <div className="relative z-10 backdrop-blur-sm bg-white/80 dark:bg-viking-charcoal/70">
          {Content}
        </div>
      </article>
    );
  }

  if (placement === "left" || placement === "right") {
    return (
      <article className="bg-white dark:bg-viking-charcoal/70 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group border border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row">
        {placement === "left" && hasImage
          ? renderSideImageSection("left")
          : null}
        <div className="flex-1">{Content}</div>
        {placement === "right" && hasImage
          ? renderSideImageSection("right")
          : null}
      </article>
    );
  }

  if (placement === "none" || !hasImage) {
    return (
      <article className="bg-white dark:bg-viking-charcoal/70 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group border border-gray-200 dark:border-gray-700">
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-viking-red to-viking-charcoal text-white text-xl font-semibold">
            {category || "News"}
          </div>
          {category && (
            <span className="absolute top-3 left-3 bg-viking-red text-white text-xs font-semibold px-2 py-1 rounded shadow">
              {category}
            </span>
          )}
        </div>
        {Content}
      </article>
    );
  }

  // default to top placement
  return (
    <article className="bg-white dark:bg-viking-charcoal/70 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group border border-gray-200 dark:border-gray-700">
      {imageSection}
      {Content}
    </article>
  );
}
