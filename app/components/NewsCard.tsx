"use client";

import { storyblokEditable } from "@storyblok/react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";

interface NewsCardProps {
  blok: {
    title?: string;
    excerpt?: string;
    image?: {
      filename: string;
      alt: string;
    };
    author?: string;
    date?: string;
    slug?: string;
    category?: string;
  };
}

export default function NewsCard({ blok }: NewsCardProps) {
  return (
    <article
      {...storyblokEditable(blok)}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
    >
      <div className="relative h-48 overflow-hidden">
        {blok.image?.filename ? (
          <Image
            src={blok.image.filename}
            alt={blok.image.alt || blok.title || "News image"}
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
        {blok.category && (
          <div className="absolute top-4 left-4 bg-viking-gold text-viking-charcoal px-3 py-1 rounded-full text-sm font-medium">
            {blok.category}
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-viking-charcoal mb-3 group-hover:text-viking-red transition-colors">
          {blok.title || "News Title"}
        </h3>

        <p className="text-gray-700 mb-4 leading-relaxed">
          {blok.excerpt || "News excerpt goes here..."}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{blok.author || "Oslo Vikings"}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{blok.date || new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {blok.slug && (
            <Link
              href={`/news/${blok.slug}`}
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
