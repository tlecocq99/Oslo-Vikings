"use client";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";

interface NewsCardProps {
  title?: string;
  excerpt?: string;
  image?: {
    filename: string;
    alt?: string;
  };
  author?: string;
  date?: string;
  slug?: string;
  category?: string;
}

export default function NewsCard({
  title,
  excerpt,
  image,
  author,
  date,
  slug,
  category,
}: NewsCardProps) {
  const href = slug ? `/news/${slug}` : "#";
  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative h-48 overflow-hidden">
        {image?.filename ? (
          <Image
            src={image.filename}
            alt={image.alt || title || "News image"}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width:768px) 100vw, 400px"
            priority={false}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-viking-red to-viking-charcoal flex items-center justify-center text-white text-xl font-semibold">
            {category || "News"}
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
        {category && (
          <span className="absolute top-3 left-3 bg-viking-red text-white text-xs font-semibold px-2 py-1 rounded shadow">
            {category}
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col h-full">
        <h3 className="text-xl font-bold text-viking-charcoal mb-3 line-clamp-2">
          {title || "Untitled Article"}
        </h3>
        {excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{excerpt}</p>
        )}

        <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
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
          className="mt-4 inline-block text-viking-red font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-viking-red focus:ring-offset-2 rounded"
          aria-label={`Read more: ${title || "article"}`}
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}
