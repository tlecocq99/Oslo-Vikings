export type NewsImagePlacement =
  | "top"
  | "left"
  | "right"
  | "background"
  | "none";

export type NewsVisibility = "draft" | "published" | "archived";

export type NewsArticleLayoutVariant = "default" | "spotlight" | "gallery";

export interface NewsImage {
  src: string;
  alt?: string;
  placement: NewsImagePlacement;
  credit?: string;
  driveId?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  author?: string;
  category?: string;
  visibility: NewsVisibility;
  featured?: boolean;
  date?: string; // YYYY-MM-DD string in club timezone
  publishedAt?: string; // ISO timestamp
  readTimeMinutes?: number;
  image?: NewsImage;
  gallery?: NewsImage[];
  body?: string;
  tags?: string[];
  sources?: string[];
  layoutVariant?: NewsArticleLayoutVariant;
  raw?: Record<string, string>;
}
