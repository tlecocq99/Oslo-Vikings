"use client";

import { storyblokEditable } from "@storyblok/react";
import Image from "next/image";

interface PlayerCardProps {
  blok: {
    name?: string;
    position?: string;
    number?: string;
    height?: string;
    weight?: string;
    photo?: {
      filename: string;
      alt: string;
    };
    bio?: string;
    image?: string; // Add image property for background
  };
}

export default function PlayerCard({ blok }: PlayerCardProps) {
  return (
    <div
      {...storyblokEditable(blok)}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative">
        <div
          className="h-48 bg-cover bg-no-repeat flex items-center justify-center relative"
          style={{
            backgroundImage: blok.image
              ? `url(${blok.image})`
              : blok.photo?.filename
              ? `url(${blok.photo.filename})`
              : "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
            backgroundPosition:
              blok.image || blok.photo?.filename
                ? "center 42%"
                : "center center",
          }}
        >
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Fallback number display when no image */}
          {!blok.image && !blok.photo?.filename && (
            <div className="relative z-10 text-white text-6xl font-bold drop-shadow-lg">
              #{blok.number || "00"}
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4 bg-viking-gold text-viking-charcoal px-2 py-1 rounded font-bold shadow-lg z-20">
          #{blok.number || "00"}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-viking-charcoal mb-2">
          {blok.name || "Player Name"}
        </h3>

        <p className="text-viking-red font-semibold mb-3">
          {blok.position || "Position"}
        </p>

        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>Height: {blok.height || "N/A"}</span>
          <span>Weight: {blok.weight || "N/A"}</span>
        </div>

        {blok.bio && (
          <p className="text-gray-700 text-sm leading-relaxed">{blok.bio}</p>
        )}
      </div>
    </div>
  );
}
