"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";

interface NewsArticle {
  title?: string;
  excerpt?: string;
  image?: string;
  author?: string;
  date?: string;
  slug?: string;
  category?: string;
}

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative h-48 overflow-hidden">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title || "News image"}
            width={400}
            height={200}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-viking-red to-viking-red-dark flex items-center justify-center">
            <span className="text-white text-lg font-semibold">
              Oslo Vikings
            </span>
          </div>
        )}
        {article.category && (
          <div className="absolute top-4 left-4 bg-viking-gold text-viking-charcoal px-3 py-1 rounded-full text-sm font-medium">
            {article.category}
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-viking-charcoal mb-3 group-hover:text-viking-red transition-colors">
          {article.title || "News Title"}
        </h3>

        <p className="text-gray-700 mb-4 leading-relaxed">
          {article.excerpt || "News excerpt goes here..."}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{article.author || "Oslo Vikings"}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{article.date || new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {article.slug && (
            <Link
              href={`/news/${article.slug}`}
              className="text-viking-red hover:text-viking-red-dark font-medium transition-colors"
            >
              Read more →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
