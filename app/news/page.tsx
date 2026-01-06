import { fetchNewsArticles } from "../services/fetchNews";
import NewsPageClient from "./NewsPageClient";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Oslo Vikings - News",
  description: "Latest news and updates from the Oslo Vikings.",
};

export default async function NewsPage() {
  const articles = await fetchNewsArticles();
  return <NewsPageClient articles={articles} />;
}
