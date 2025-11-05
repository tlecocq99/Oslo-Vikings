import { fetchNewsArticles } from "../services/fetchNews";
import NewsPageClient from "./NewsPageClient";

export const revalidate = 300;

export default async function NewsPage() {
  const articles = await fetchNewsArticles();
  return <NewsPageClient articles={articles} />;
}
