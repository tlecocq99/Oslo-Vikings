import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";

import {
  fetchNewsArticleBySlug,
  fetchNewsArticles,
} from "@/app/services/fetchNews";
import { formatSheetDate } from "@/lib/date";

export const revalidate = 300;

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

  return (
    <article className="bg-white dark:bg-viking-charcoal/80">
      <header className="relative isolate overflow-hidden bg-gradient-to-b from-viking-charcoal via-viking-charcoal/90 to-transparent">
        <Link
          href="/news"
          className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 rounded-full border border-white/20 bg-viking-charcoal/70 px-4 py-2 text-sm font-semibold text-white transition hover:bg-viking-charcoal"
          aria-label="Back to all news"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-white">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/80">
            {article.category ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1">
                <Tag className="h-4 w-4" />
                {article.category}
              </span>
            ) : null}
            {displayDate ? (
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-viking-red" />
                {displayDate}
              </span>
            ) : null}
            {readTimeLabel ? (
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-viking-red" />
                {readTimeLabel}
              </span>
            ) : null}
          </div>

          <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {article.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
            <span className="flex items-center gap-2">
              <User className="h-4 w-4 text-viking-red" />
              {article.author ?? "Oslo Vikings"}
            </span>
          </div>
        </div>

        {article.image?.src ? (
          <div className="relative h-[320px] sm:h-[420px] lg:h-[520px] bg-white dark:bg-white/5">
            <Image
              src={article.image.src}
              alt={article.image.alt ?? article.title}
              fill
              priority
              className="object-contain"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-viking-charcoal via-viking-charcoal/60 to-transparent" />
            {article.image.credit ? (
              <span className="absolute bottom-4 right-4 text-xs uppercase tracking-wide text-white/70">
                Photo: {article.image.credit}
              </span>
            ) : null}
          </div>
        ) : null}
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-lg leading-relaxed text-gray-700 dark:text-gray-200">
        {article.excerpt ? (
          <p className="text-xl font-medium text-viking-charcoal dark:text-white">
            {article.excerpt}
          </p>
        ) : null}

        {bodyBlocks.length > 0 ? (
          <div className="space-y-6">
            {bodyBlocks.map((block, index) => (
              <p key={index} className="whitespace-pre-line">
                {block}
              </p>
            ))}
          </div>
        ) : null}

        {article.gallery?.length ? (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-viking-charcoal dark:text-white">
              Photo Gallery
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.gallery.map((image, index) => (
                <div
                  key={`${image.src}-${index}`}
                  className="relative h-64 overflow-hidden rounded-lg bg-white dark:bg-white/5"
                >
                  <Image
                    src={image.src}
                    alt={image.alt ?? article.title}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {article.sources?.length ? (
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-viking-charcoal dark:text-white">
              Sources
            </h2>
            <ul className="list-disc list-inside space-y-2 text-base text-gray-600 dark:text-gray-300">
              {article.sources.map((source, index) => (
                <li key={`${source}-${index}`}>{source}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="pt-6">
          <Link
            href="/news"
            className="inline-flex items-center text-viking-red font-semibold hover:underline"
          >
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

function buildBodyBlocks(body?: string) {
  if (!body) return [] as string[];

  const normalized = body.replace(/\r\n/g, "\n");
  const blocks = normalized
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.length ? blocks : normalized.split(/\n+/).filter(Boolean);
}
