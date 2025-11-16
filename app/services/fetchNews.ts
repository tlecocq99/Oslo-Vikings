import { parseSheetDate } from "@/lib/date";
import { fetchSheetRows } from "./googleSheets";
import type {
  NewsArticle,
  NewsImage,
  NewsImagePlacement,
  NewsVisibility,
} from "@/app/types/news";

const DEFAULT_NEWS_SHEET = process.env.GOOGLE_NEWS_SHEET ?? "News";
const DEFAULT_NEWS_RANGE = process.env.GOOGLE_NEWS_RANGE ?? "A1:N400";

const HEADER_KEYS = {
  title: ["title", "headline", "name"],
  slug: ["slug", "url", "permalink"],
  excerpt: ["excerpt", "summary", "description"],
  author: ["author", "byline"],
  category: ["category", "section"],
  visibility: ["status", "visibility", "state"],
  featured: ["featured", "isfeatured"],
  date: ["date", "publishdate", "published"],
  publishedAt: ["publishedat", "timestamp", "datetime"],
  readTime: ["readtime", "minutes", "readtimeminutes"],
  image: ["image", "thumbnail", "imageurl"],
  imageAlt: ["imagealt", "imgalt", "alt"],
  imageCredit: ["imagecredit", "credit"],
  imagePlacement: ["imageplacement", "imagelayout", "placement"],
  gallery: ["gallery", "images", "imagelist"],
  tags: ["tags", "keywords"],
  content: ["content", "body", "article"],
  sources: ["sources", "links", "references"],
} as const;

type HeaderMap = Map<string, number>;

type SheetRow = string[];

function normaliseHeader(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function buildHeaderMap(headers: string[]): HeaderMap {
  const map: HeaderMap = new Map();
  headers.forEach((header, index) => {
    const key = normaliseHeader(header);
    if (key) {
      map.set(key, index);
    }
  });
  return map;
}

function getValue(
  row: SheetRow,
  headerMap: HeaderMap,
  keys: readonly string[],
  fallbackIndex?: number
): string {
  for (const key of keys) {
    const lookup = normaliseHeader(key);
    const idx = headerMap.get(lookup);
    if (idx !== undefined && idx >= 0 && idx < row.length) {
      const value = row[idx]?.trim();
      if (value) {
        return value;
      }
    }
  }
  if (
    fallbackIndex !== undefined &&
    fallbackIndex >= 0 &&
    fallbackIndex < row.length
  ) {
    const fallbackValue = row[fallbackIndex]?.trim();
    if (fallbackValue) {
      return fallbackValue;
    }
  }
  return "";
}

function rowIsBlank(row: SheetRow): boolean {
  return row.every((cell) => cell.trim() === "");
}

function normaliseVisibility(raw: string): NewsVisibility {
  const value = raw.toLowerCase();
  if (value === "draft" || value === "archived") {
    return value;
  }
  return "published";
}

function parseBoolean(raw: string): boolean {
  const value = raw.toLowerCase();
  return ["true", "yes", "y", "1", "on"].includes(value);
}

const IMAGE_PLACEMENT_VALUES: NewsImagePlacement[] = [
  "top",
  "left",
  "right",
  "background",
  "none",
];

function normaliseImagePlacement(raw: string): NewsImagePlacement {
  const value = raw.toLowerCase();
  return (
    IMAGE_PLACEMENT_VALUES.find((placement) => placement === value) ?? "top"
  );
}

function normaliseImage(
  raw: string,
  alt: string,
  placementRaw: string,
  credit: string
): NewsImage | undefined {
  const src = raw?.trim();
  if (!src) return undefined;
  const placement = placementRaw
    ? normaliseImagePlacement(placementRaw)
    : "top";

  return {
    src,
    alt: alt || undefined,
    placement,
    credit: credit || undefined,
    driveId: undefined,
  } satisfies NewsImage;
}

function parseGallery(raw: string): NewsImage[] | undefined {
  if (!raw) return undefined;
  const entries = raw
    .split(/[\n;,]+/)
    .map((value) => value.trim())
    .filter(Boolean);

  if (entries.length === 0) return undefined;

  return entries.map(
    (entry) =>
      ({
        src: entry,
        placement: "top",
        driveId: undefined,
      } satisfies NewsImage)
  );
}

function parseTags(raw: string): string[] | undefined {
  if (!raw) return undefined;
  const tags = raw
    .split(/[\n,;]+/)
    .map((value) => value.trim())
    .filter(Boolean);
  return tags.length ? tags : undefined;
}

function parseSources(raw: string): string[] | undefined {
  if (!raw) return undefined;
  const sources = raw
    .split(/[\n,;]+/)
    .map((value) => value.trim())
    .filter(Boolean);
  return sources.length ? sources : undefined;
}

function toRecord(row: SheetRow, headers: string[]): Record<string, string> {
  const record: Record<string, string> = {};
  headers.forEach((header, index) => {
    record[header] = row[index] ?? "";
  });
  return record;
}

export interface FetchNewsOptions {
  sheet?: string;
  range?: string;
  includeDrafts?: boolean;
  limit?: number;
}

export async function fetchNewsArticles({
  sheet = DEFAULT_NEWS_SHEET,
  range = DEFAULT_NEWS_RANGE,
  includeDrafts = false,
  limit,
}: FetchNewsOptions = {}): Promise<NewsArticle[]> {
  const rows = await fetchSheetRows(sheet, range);
  if (rows.length === 0) {
    return [];
  }

  const [rawHeader, ...rawRows] = rows;
  const headers = rawHeader.map((cell) => (cell ?? "").toString().trim());
  const headerMap = buildHeaderMap(headers);

  const articles: NewsArticle[] = [];

  rawRows.forEach((rawRow, index) => {
    const row = rawRow.map((cell) => (cell ?? "").toString().trim());
    if (rowIsBlank(row)) return;

    const title = getValue(row, headerMap, HEADER_KEYS.title);
    const slugRaw = getValue(row, headerMap, HEADER_KEYS.slug);
    if (!title && !slugRaw) return;

    const slug =
      slugRaw ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);

    const visibilityRaw = getValue(row, headerMap, HEADER_KEYS.visibility);
    const visibility = visibilityRaw
      ? normaliseVisibility(visibilityRaw)
      : "published";

    if (!includeDrafts && visibility !== "published") {
      return;
    }

    const imageRaw = getValue(row, headerMap, HEADER_KEYS.image);
    const imageAlt = getValue(row, headerMap, HEADER_KEYS.imageAlt) || title;
    const imageCredit = getValue(row, headerMap, HEADER_KEYS.imageCredit);
    const imagePlacementRaw = getValue(
      row,
      headerMap,
      HEADER_KEYS.imagePlacement
    );
    const image = normaliseImage(
      imageRaw,
      imageAlt,
      imagePlacementRaw,
      imageCredit
    );

    const article: NewsArticle = {
      id: slug || `news-${index + 1}`,
      title: title || slug || `News ${index + 1}`,
      slug,
      excerpt: getValue(row, headerMap, HEADER_KEYS.excerpt),
      author: getValue(row, headerMap, HEADER_KEYS.author) || undefined,
      category: getValue(row, headerMap, HEADER_KEYS.category) || undefined,
      visibility,
      featured: parseBoolean(getValue(row, headerMap, HEADER_KEYS.featured)),
      date: getValue(row, headerMap, HEADER_KEYS.date) || undefined,
      publishedAt:
        getValue(row, headerMap, HEADER_KEYS.publishedAt) || undefined,
      readTimeMinutes: (() => {
        const raw = getValue(row, headerMap, HEADER_KEYS.readTime);
        const num = Number(raw);
        return Number.isFinite(num) && num > 0 ? Math.round(num) : undefined;
      })(),
      image,
      gallery: parseGallery(getValue(row, headerMap, HEADER_KEYS.gallery)),
      body: getValue(row, headerMap, HEADER_KEYS.content) || undefined,
      tags: parseTags(getValue(row, headerMap, HEADER_KEYS.tags)),
      sources: parseSources(getValue(row, headerMap, HEADER_KEYS.sources)),
      raw: toRecord(row, headers),
    };

    articles.push(article);
  });

  const published = includeDrafts
    ? articles
    : articles.filter((article) => article.visibility === "published");

  const sorted = published
    .map((article, index) => ({ article, index }))
    .sort((a, b) => {
      const aTime = parseSheetDate(a.article.publishedAt || a.article.date);
      const bTime = parseSheetDate(b.article.publishedAt || b.article.date);

      const aValid = Number.isFinite(aTime);
      const bValid = Number.isFinite(bTime);

      if (aValid && bValid) {
        if (aTime === bTime) {
          return a.index - b.index;
        }
        return bTime - aTime;
      }
      if (aValid) return -1;
      if (bValid) return 1;
      return a.index - b.index;
    })
    .map(({ article }) => article);

  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export interface FetchNewsArticleOptions
  extends Omit<FetchNewsOptions, "limit"> {}

export async function fetchNewsArticleBySlug(
  slug: string,
  options?: FetchNewsArticleOptions
): Promise<NewsArticle | null> {
  if (!slug) return null;

  const articles = await fetchNewsArticles({
    ...options,
  });

  return articles.find((article) => article.slug === slug) ?? null;
}
