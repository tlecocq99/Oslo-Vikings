"use client";

import { useMemo, useState } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import NewsCard from "../components/NewsCardClient";
import SearchAndFilter from "../components/SearchAndFilter";
import { Button } from "@/components/ui/button";
import { Calendar, Search, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatSheetDate } from "@/lib/date";
import type { NewsArticle } from "@/app/types/news";
import type { NewsCardProps } from "../components/NewsCardContent";

interface NewsPageClientProps {
  articles: NewsArticle[];
}

const DEFAULT_CATEGORY = "All";

function buildCategories(articles: NewsArticle[]): string[] {
  const set = new Set<string>([DEFAULT_CATEGORY]);
  articles.forEach((article) => {
    if (article.category) {
      set.add(article.category);
    }
  });
  return Array.from(set);
}

function formatDisplayDate(
  primary?: string,
  fallback?: string
): string | undefined {
  const primaryFormatted = formatSheetDate(primary);
  if (primaryFormatted) {
    return primaryFormatted;
  }

  if (fallback) {
    return formatSheetDate(fallback);
  }

  return undefined;
}

function toNewsCardProps(article: NewsArticle): NewsCardProps {
  return {
    title: article.title,
    excerpt: article.excerpt,
    slug: article.slug,
    author: article.author,
    date: formatDisplayDate(article.publishedAt, article.date),
    category: article.category,
    image: article.image
      ? {
          src: article.image.src,
          alt: article.image.alt,
          placement: article.image.placement,
          credit: article.image.credit,
        }
      : undefined,
  };
}

function getFeaturedArticle(articles: NewsArticle[]): NewsArticle | undefined {
  return articles.find((article) => article.featured) ?? articles[0];
}

function filterArticles(
  articles: NewsArticle[],
  searchQuery: string,
  activeCategory: string
): NewsArticle[] {
  const query = searchQuery.trim().toLowerCase();
  return articles.filter((article) => {
    if (activeCategory !== DEFAULT_CATEGORY) {
      if (
        (article.category || "").toLowerCase() !== activeCategory.toLowerCase()
      ) {
        return false;
      }
    }
    if (!query) return true;
    const haystack = [
      article.title,
      article.excerpt,
      article.author,
      article.category,
      article.tags?.join(" "),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}

export default function NewsPageClient({ articles }: NewsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<string>(DEFAULT_CATEGORY);

  const categories = useMemo(() => buildCategories(articles), [articles]);

  const filteredArticles = useMemo(
    () => filterArticles(articles, searchQuery, activeCategory),
    [articles, searchQuery, activeCategory]
  );

  const featuredArticle = useMemo(
    () =>
      getFeaturedArticle(filteredArticles.length ? filteredArticles : articles),
    [articles, filteredArticles]
  );

  const gridArticles = useMemo(() => {
    if (!featuredArticle) return filteredArticles;
    return filteredArticles.filter(
      (article) => article.id !== featuredArticle.id
    );
  }, [filteredArticles, featuredArticle]);

  return (
    <>
      <Navigation />

      <main className="min-h-screen">
        <section className="dark:bg-gray-950 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-viking-charcoal dark:text-gray-200 mb-6 relative after:content-[''] after:block after:h-1 after:w-24 after:bg-viking-red after:rounded-full after:mx-auto after:mt-4">
              Vikings News
            </h1>
            <p className="text-xl text-viking-charcoal/80 dark:text-gray-300/80 max-w-3xl mx-auto">
              Stay updated with the latest Oslo Vikings news, game recaps, and
              team announcements
            </p>
          </div>
        </section>

        <section className="bg-white dark:bg-viking-charcoal/80 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 dark:text-gray-200">
            <SearchAndFilter
              categories={categories}
              onSearch={setSearchQuery}
              onFilter={setActiveCategory}
              activeCategory={activeCategory}
            />

            {featuredArticle ? (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-viking-charcoal dark:text-gray-200 mb-8">
                  Featured Story
                </h2>
                <FeaturedArticleCard article={featuredArticle} />
              </div>
            ) : null}

            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-viking-charcoal dark:text-gray-200">
                  {activeCategory === DEFAULT_CATEGORY
                    ? "All Articles"
                    : activeCategory}
                  <span className="text-viking-red text-lg ml-2">
                    ({gridArticles.length})
                  </span>
                </h2>
              </div>

              {gridArticles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                  {gridArticles.map((article) => (
                    <NewsCard key={article.id} {...toNewsCardProps(article)} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-viking-red/50 mb-4">
                    <Search className="w-16 h-16 mx-auto mb-4" />
                  </div>
                  <h3 className="text-xl font-semibold text-viking-charcoal dark:text-gray-200 mb-2">
                    No articles found
                  </h3>
                  <p className="text-viking-charcoal/70 dark:text-gray-300">
                    {searchQuery
                      ? `No articles match "${searchQuery}"`
                      : `No articles in "${activeCategory}" category`}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-viking-red text-viking-red hover:bg-viking-red hover:text-white"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory(DEFAULT_CATEGORY);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>

            {gridArticles.length > 0 &&
              gridArticles.length < filteredArticles.length && (
                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    className="border-viking-red text-viking-red hover:bg-viking-red hover:text-white"
                    onClick={() => setActiveCategory(DEFAULT_CATEGORY)}
                  >
                    Load More Articles
                  </Button>
                </div>
              )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

interface FeaturedProps {
  article: NewsArticle;
}

function FeaturedArticleCard({ article }: FeaturedProps) {
  const placement = article.image?.placement ?? "background";
  const href = article.slug ? `/news/${article.slug}` : undefined;
  const displayDate = formatDisplayDate(article.publishedAt, article.date);
  const baseClasses =
    "bg-gray-50 dark:bg-viking-charcoal/70 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-viking-red/30";

  if (placement === "left" || placement === "right") {
    const imageFirst = placement === "left";
    const imageSection = article.image?.src ? (
      <div className="relative w-full lg:w-1/2 h-64 lg:h-96">
        <ImageFill
          src={article.image.src}
          alt={article.image.alt || article.title}
        />
        {article.category && (
          <span className="absolute top-4 left-4 bg-viking-red text-white text-xs font-semibold px-3 py-1 rounded shadow">
            {article.category}
          </span>
        )}
      </div>
    ) : null;

    return (
      <article className={`${baseClasses} flex flex-col lg:flex-row`}>
        {imageFirst ? imageSection : null}
        <div className="flex-1 p-8">
          <FeaturedArticleBody
            article={article}
            displayDate={displayDate}
            href={href}
          />
        </div>
        {!imageFirst ? imageSection : null}
      </article>
    );
  }

  if (placement === "none") {
    return (
      <article className={`${baseClasses} p-8`}>
        <FeaturedArticleBody
          article={article}
          displayDate={displayDate}
          href={href}
        />
      </article>
    );
  }

  const backgroundStyle = article.image?.src
    ? {
        backgroundImage: `linear-gradient(rgba(12, 11, 11, 0.65), rgba(12, 11, 11, 0.55)), url('${article.image.src}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  return (
    <article
      className={`${baseClasses} relative text-white`}
      style={backgroundStyle}
    >
      <div className="p-8 lg:p-12 space-y-6 bg-gradient-to-r from-black/60 via-black/40 to-transparent">
        {article.category && (
          <span className="inline-block bg-viking-red text-white text-xs font-semibold px-3 py-1 rounded shadow">
            {article.category}
          </span>
        )}
        <h3 className="text-3xl lg:text-4xl font-bold leading-tight">
          {article.title || "Featured Story"}
        </h3>
        {article.excerpt && (
          <p className="text-lg text-white/90 leading-relaxed max-w-2xl">
            {article.excerpt}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
          {article.author && (
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" /> {article.author}
            </span>
          )}
          {displayDate && (
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {displayDate}
            </span>
          )}
          {article.readTimeMinutes ? (
            <span>{article.readTimeMinutes} min read</span>
          ) : null}
        </div>
        {href ? (
          <Button asChild className="bg-viking-red hover:bg-viking-red-dark">
            <Link href={href}>Read Full Story</Link>
          </Button>
        ) : null}
        {article.image?.credit && (
          <p className="text-xs uppercase tracking-wide text-white/70">
            Photo: {article.image.credit}
          </p>
        )}
      </div>
    </article>
  );
}

interface FeaturedArticleBodyProps {
  article: NewsArticle;
  displayDate?: string;
  href?: string;
}

function FeaturedArticleBody({
  article,
  displayDate,
  href,
}: FeaturedArticleBodyProps) {
  return (
    <div className="space-y-6">
      {article.category && (
        <span className="inline-block bg-viking-red text-white text-xs font-semibold px-3 py-1 rounded shadow">
          {article.category}
        </span>
      )}
      <h3 className="text-3xl font-bold text-viking-charcoal dark:text-gray-100 leading-tight">
        {article.title || "Featured Story"}
      </h3>
      {article.excerpt && (
        <p className="text-lg text-viking-charcoal/80 dark:text-gray-300 leading-relaxed">
          {article.excerpt}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4 text-sm text-viking-charcoal/70 dark:text-gray-300/80">
        {article.author && (
          <span className="flex items-center gap-2">
            <User className="w-4 h-4 text-viking-red" /> {article.author}
          </span>
        )}
        {displayDate && (
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-viking-red" /> {displayDate}
          </span>
        )}
        {article.readTimeMinutes ? (
          <span>{article.readTimeMinutes} min read</span>
        ) : null}
      </div>
      {href ? (
        <Button asChild className="bg-viking-red hover:bg-viking-red-dark">
          <Link href={href}>Read Full Story</Link>
        </Button>
      ) : null}
      {article.image?.credit && (
        <p className="text-xs uppercase tracking-wide text-viking-charcoal/60 dark:text-gray-400">
          Photo: {article.image.credit}
        </p>
      )}
    </div>
  );
}

interface ImageFillProps {
  src: string;
  alt?: string;
}

function ImageFill({ src, alt }: ImageFillProps) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-black/20" />
      <Image
        src={src}
        alt={alt || "News image"}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority={false}
      />
    </div>
  );
}
