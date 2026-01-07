import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";

import {
  fetchNewsArticleBySlug,
  fetchNewsArticles,
} from "@/app/services/fetchNews";
import { formatSheetDate } from "@/lib/date";
import { getImageLoaderProps } from "@/lib/imageLoader";
import { cn } from "@/lib/utils";
import type { NewsArticleLayoutVariant } from "@/app/types/news";

export const revalidate = 300;

type ArticleVariant = NewsArticleLayoutVariant;

type BodyBlockType = "paragraph" | "subheading" | "headline";

interface BodyBlock {
  type: BodyBlockType;
  content: string;
}

interface ArticleLayoutConfig {
  variant?: ArticleVariant;
  articleClassName?: string;
  headerGradient?: string;
  heroWrapperClassName?: string;
  heroImageClassName?: string;
  heroOverlayGradient?: string;
  bodyClassName?: string;
  excerptClassName?: string;
  galleryWrapperClassName?: string;
  galleryImageClassName?: string;
  sectionHeadingClassName?: string;
  backLinkClassName?: string;
}

const ARTICLE_LAYOUTS: Record<string, ArticleLayoutConfig> = {
  // Example configuration to illustrate how per-slug customization works.
  // Update or extend with real slugs from your sheet data as needed.
  // "vikings-vs-rivals-recap": {
  //   variant: "spotlight",
  //   headerGradient: "from-viking-red via-viking-red/80 to-transparent",
  //   heroImageClassName: "object-cover",
  //   bodyClassName:
  //     "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-lg leading-relaxed text-gray-100",
  //   sectionHeadingClassName: "text-2xl font-semibold text-white",
  //   backLinkClassName: "inline-flex items-center text-white font-semibold hover:text-viking-red",
  // },
};

const VARIANT_PRESETS: Record<ArticleVariant, ArticleLayoutConfig> = {
  default: {},
  spotlight: {
    articleClassName:
      "relative bg-gradient-to-b from-[#080b16] via-[#101728] to-[#05060c] text-white",
    headerGradient: "from-viking-red/90 via-[#991b1b]/80 to-transparent",
    heroWrapperClassName:
      "relative h-[420px] sm:h-[520px] lg:h-[640px] overflow-hidden rounded-b-[3rem] border-t border-white/10 shadow-[0_40px_140px_-50px_rgba(239,68,68,0.75)]",
    heroImageClassName: "object-contain object-center",
    heroOverlayGradient: "from-black/85 via-black/45 to-transparent",
    bodyClassName:
      "relative max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 xl:px-20 py-20 space-y-16 text-lg lg:text-xl leading-relaxed text-white/85",
    excerptClassName:
      "text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-white via-viking-red/80 to-white text-transparent bg-clip-text drop-shadow-[0_20px_40px_rgba(239,68,68,0.35)]",
    galleryImageClassName: "object-contain",
    sectionHeadingClassName:
      "text-xs font-semibold uppercase tracking-[0.45em] text-viking-red/80",
    backLinkClassName:
      "inline-flex items-center text-white/80 font-semibold hover:text-white",
  },
  gallery: {
    articleClassName:
      "bg-gradient-to-br from-white via-sky-50 to-rose-50 text-slate-900",
    headerGradient: "from-white via-sky-100/70 to-transparent",
    heroWrapperClassName:
      "relative h-[320px] sm:h-[420px] lg:h-[520px] max-w-5xl mx-auto -mb-24 overflow-hidden rounded-[2.75rem] border border-sky-100 shadow-2xl shadow-sky-200/60",
    heroImageClassName: "object-contain object-center",
    heroOverlayGradient: "from-white via-white/50 to-transparent",
    bodyClassName:
      "max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pt-32 pb-20 space-y-16 text-lg leading-relaxed text-slate-700",
    excerptClassName:
      "text-2xl font-semibold text-slate-900 bg-white/85 px-6 py-4 rounded-3xl shadow-xl border border-white/70",
    galleryWrapperClassName: "grid gap-6 sm:grid-cols-12",
    galleryImageClassName: "object-contain",
    sectionHeadingClassName: "text-2xl font-bold text-slate-900",
    backLinkClassName:
      "inline-flex items-center text-sky-600 font-semibold hover:text-sky-800",
  },
};

export async function generateStaticParams() {
  const articles = await fetchNewsArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

interface NewsArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: NewsArticlePageProps) {
  const resolvedParams = await params;
  const article = await fetchNewsArticleBySlug(resolvedParams.slug);

  if (!article) {
    return {
      title: "News",
    };
  }

  return {
    title: `${article.title} | Oslo Vikings News`,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      url: `https://oslovikings.vercel.app/news/${article.slug}`,
      images: article.image?.src
        ? [
            {
              url: article.image.src,
              alt: article.image.alt ?? article.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.image?.src ? [article.image.src] : undefined,
    },
  };
}

export default async function NewsArticlePage({
  params,
}: NewsArticlePageProps) {
  const resolvedParams = await params;
  const article = await fetchNewsArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const displayDate = formatNewsDate(article.publishedAt ?? article.date);
  const readTimeLabel = article.readTimeMinutes
    ? `${article.readTimeMinutes} min read`
    : undefined;
  const bodyBlocks = buildBodyBlocks(article.body);
  const slugKey = article.slug ?? resolvedParams.slug;
  const slugOverrides = ARTICLE_LAYOUTS[slugKey] ?? {};
  const variant = slugOverrides.variant ?? article.layoutVariant ?? "default";
  const preset = VARIANT_PRESETS[variant] ?? VARIANT_PRESETS.default;
  const layout: ArticleLayoutConfig = {
    variant,
    ...preset,
    ...slugOverrides,
  };

  const articleClassName =
    layout.articleClassName ?? "bg-white dark:bg-viking-charcoal/80";
  const headerGradient =
    layout.headerGradient ??
    "from-viking-charcoal via-viking-charcoal/90 to-transparent";
  const heroWrapperClassName =
    layout.heroWrapperClassName ??
    "relative h-[320px] sm:h-[420px] lg:h-[520px] bg-white dark:bg-white/5";
  const heroImageClassName = layout.heroImageClassName ?? "object-contain";
  const heroOverlayGradient =
    layout.heroOverlayGradient ??
    "from-viking-charcoal via-viking-charcoal/60 to-transparent";
  const bodyClassName =
    layout.bodyClassName ??
    "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-lg leading-relaxed text-gray-700 dark:text-gray-200";
  const excerptClassName =
    layout.excerptClassName ??
    "text-xl font-medium text-viking-charcoal dark:text-white";
  const galleryWrapperClassName =
    layout.galleryWrapperClassName ?? "grid grid-cols-1 sm:grid-cols-2 gap-4";
  const galleryImageClassName =
    layout.galleryImageClassName ?? "object-contain";
  const sectionHeadingClassName =
    layout.sectionHeadingClassName ??
    "text-2xl font-semibold text-viking-charcoal dark:text-white";
  const backLinkClassName =
    layout.backLinkClassName ??
    "inline-flex items-center text-viking-red font-semibold hover:underline";
  const isSpotlight = variant === "spotlight";
  const isGallery = variant === "gallery";

  const topBackButtonClassName = cn(
    "absolute top-6 left-6 z-20 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition backdrop-blur",
    isSpotlight
      ? "border border-white/20 bg-white/10 text-white hover:bg-white/20"
      : isGallery
      ? "border border-sky-200 bg-white/90 text-slate-700 shadow-sm hover:bg-white"
      : "border border-white/20 bg-viking-charcoal/70 text-white hover:bg-viking-charcoal"
  );

  const categoryPillClass = cn(
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs sm:text-sm font-semibold transition",
    isSpotlight
      ? "border border-white/30 bg-white/10 shadow-[0_18px_40px_-20px_rgba(239,68,68,0.55)]"
      : isGallery
      ? "border border-sky-200 bg-white/80 text-slate-700 shadow-sm"
      : "border border-white/20"
  );

  const metaRowClass = cn(
    "flex items-center gap-2 text-sm",
    isSpotlight
      ? "text-white/70"
      : isGallery
      ? "text-slate-600"
      : "text-white/80"
  );

  const metaIconClass = cn(
    "h-4 w-4",
    isSpotlight
      ? "text-viking-red"
      : isGallery
      ? "text-sky-500"
      : "text-viking-red"
  );

  const authorRowClass = cn(
    "flex items-center gap-2 text-sm",
    isSpotlight
      ? "text-white/80"
      : isGallery
      ? "text-slate-600"
      : "text-white/80"
  );

  const bodyBlocksWrapperClass = cn(
    "space-y-6",
    isSpotlight
      ? "rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_40px_120px_-60px_rgba(239,68,68,0.6)]"
      : isGallery
      ? "rounded-3xl border border-white/70 bg-white/85 p-8 shadow-xl"
      : ""
  );

  const gallerySectionClass = cn(
    "space-y-4",
    isSpotlight
      ? "rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_35px_120px_-60px_rgba(239,68,68,0.55)]"
      : isGallery
      ? "rounded-3xl border border-white/80 bg-white/95 p-8 shadow-2xl"
      : ""
  );

  const sourcesSectionClass = cn(
    "space-y-3",
    isSpotlight
      ? "rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_30px_110px_-60px_rgba(239,68,68,0.5)]"
      : isGallery
      ? "rounded-3xl border border-white/80 bg-white/95 p-8 shadow-xl"
      : ""
  );

  const sourcesListClass = cn(
    "list-disc list-inside space-y-2 text-base",
    isSpotlight
      ? "text-white/70"
      : isGallery
      ? "text-slate-600"
      : "text-gray-600 dark:text-gray-300"
  );

  const bodyParagraphClass = cn(
    "whitespace-pre-line",
    isSpotlight
      ? "text-white/85"
      : isGallery
      ? "text-slate-700"
      : "text-gray-700 dark:text-gray-200"
  );

  const smallSubheadingClass = cn(
    "text-xs sm:text-sm font-semibold uppercase tracking-[0.45em]",
    isSpotlight
      ? "text-viking-red/70"
      : isGallery
      ? "text-sky-600"
      : "text-viking-red"
  );

  const largeSubheadingClass = cn(
    "text-3xl sm:text-4xl font-bold tracking-tight",
    isSpotlight
      ? "text-transparent bg-clip-text bg-gradient-to-r from-white via-viking-red/70 to-white drop-shadow-[0_20px_40px_rgba(239,68,68,0.45)]"
      : isGallery
      ? "text-3xl sm:text-4xl font-black text-slate-900"
      : "text-viking-charcoal dark:text-white"
  );
  const heroImageLoaderProps = getImageLoaderProps(article.image?.src);

  return (
    <article className={articleClassName} data-layout-variant={variant}>
      <header
        className={cn(
          "relative isolate overflow-hidden bg-gradient-to-b",
          headerGradient
        )}
      >
        <Link
          href="/news"
          className={topBackButtonClassName}
          aria-label="Back to all news"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div
          className={cn(
            "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20",
            isGallery ? "text-slate-900" : "text-white"
          )}
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {article.category ? (
              <span className={categoryPillClass}>
                <Tag className={metaIconClass} />
                {article.category}
              </span>
            ) : null}
            {displayDate ? (
              <span className={metaRowClass}>
                <Calendar className={metaIconClass} />
                {displayDate}
              </span>
            ) : null}
            {readTimeLabel ? (
              <span className={metaRowClass}>
                <Clock className={metaIconClass} />
                {readTimeLabel}
              </span>
            ) : null}
          </div>

          <h1
            className={cn(
              "mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight",
              isGallery ? "text-slate-900" : "text-white"
            )}
          >
            {article.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className={authorRowClass}>
              <User className={metaIconClass} />
              {article.author ?? "Oslo Vikings"}
            </span>
          </div>
        </div>

        {article.image?.src ? (
          <div className={heroWrapperClassName}>
            <Image
              src={article.image.src}
              alt={article.image.alt ?? article.title}
              fill
              priority
              className={heroImageClassName}
              sizes="100vw"
              {...heroImageLoaderProps}
            />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t",
                heroOverlayGradient
              )}
            />
            {article.image.credit ? (
              <span className="absolute bottom-4 right-4 text-xs uppercase tracking-wide text-white/70">
                Photo: {article.image.credit}
              </span>
            ) : null}
          </div>
        ) : null}
      </header>

      <div className={bodyClassName}>
        {article.excerpt ? (
          <p className={excerptClassName}>{article.excerpt}</p>
        ) : null}

        {bodyBlocks.length > 0 ? (
          <div className={bodyBlocksWrapperClass}>
            {bodyBlocks.map((block, index) => {
              if (block.type === "headline") {
                return (
                  <h3
                    key={`headline-${index}`}
                    className={largeSubheadingClass}
                  >
                    {block.content}
                  </h3>
                );
              }
              if (block.type === "subheading") {
                return (
                  <p
                    key={`subheading-${index}`}
                    className={smallSubheadingClass}
                  >
                    {block.content}
                  </p>
                );
              }
              return (
                <p key={`paragraph-${index}`} className={bodyParagraphClass}>
                  {block.content}
                </p>
              );
            })}
          </div>
        ) : null}

        {article.gallery?.length ? (
          <section className={gallerySectionClass}>
            <h2 className={sectionHeadingClassName}>Photo Gallery</h2>
            <div className={galleryWrapperClassName}>
              {article.gallery.map((image, index) => (
                <div
                  key={`${image.src}-${index}`}
                  className={cn(
                    isGallery
                      ? "group relative min-h-[16rem] overflow-hidden rounded-[1.75rem] bg-white/90 shadow-xl ring-1 ring-white/70 transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
                      : "relative h-64 overflow-hidden rounded-lg bg-white dark:bg-white/5",
                    isGallery
                      ? index % 5 === 0
                        ? "sm:col-span-12 md:col-span-7 lg:col-span-6"
                        : index % 3 === 0
                        ? "sm:col-span-6 md:col-span-5 lg:col-span-4"
                        : "sm:col-span-6 md:col-span-4"
                      : ""
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt ?? article.title}
                    fill
                    className={galleryImageClassName}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    {...getImageLoaderProps(image.src)}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {article.sources?.length ? (
          <section className={sourcesSectionClass}>
            <h2 className={sectionHeadingClassName}>Sources</h2>
            <ul className={sourcesListClass}>
              {article.sources.map((source, index) => (
                <li key={`${source}-${index}`}>{source}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="pt-6">
          <Link href="/news" className={backLinkClassName}>
            ← Back to all news
          </Link>
        </div>
      </div>
    </article>
  );
}

function formatNewsDate(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  return formatSheetDate(raw) ?? undefined;
}

function buildBodyBlocks(body?: string): BodyBlock[] {
  if (!body) return [];

  const normalizeMarkers = (input: string) => {
    let output = input.replace(/\r\n/g, "\n");

    const headlinePattern =
      /(^|[\s([{>])\/\/([^\/]+?)\/\/(?=[\s)}\].,!?:;]|$)/g;
    output = output.replace(
      headlinePattern,
      (match, prefix: string, text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return match as string;
        return `${prefix}\n\n<<H2:${trimmed}>>\n\n`;
      }
    );

    const subheadingPattern = /(^|[\s([{>])\/([^\/]+?)\/(?=[\s)}\].,!?:;]|$)/g;
    output = output.replace(
      subheadingPattern,
      (match, prefix: string, text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return match as string;
        return `${prefix}\n\n<<H3:${trimmed}>>\n\n`;
      }
    );

    return output;
  };

  const processed = normalizeMarkers(body);
  const chunks = processed
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  if (!chunks.length) {
    return [];
  }

  return chunks.map<BodyBlock>((chunk) => {
    if (chunk.startsWith("<<H2:") && chunk.endsWith(">>")) {
      return {
        type: "headline",
        content: chunk.slice(5, -2).trim(),
      };
    }
    if (chunk.startsWith("<<H3:") && chunk.endsWith(">>")) {
      return {
        type: "subheading",
        content: chunk.slice(5, -2).trim(),
      };
    }
    return {
      type: "paragraph",
      content: chunk,
    };
  });
}
