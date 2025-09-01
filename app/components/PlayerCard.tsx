"use client";
import Image from "next/image";
import { Player } from "@/app/types/player";

type PlayerCardProps = Player;

export default function PlayerCard({ ...props }: PlayerCardProps) {
  const { name, number, position, height, weight, image, imageAlt, bio } =
    props;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <div
          className="h-48 bg-cover bg-no-repeat flex items-center justify-center relative"
          style={{
            backgroundImage: image
              ? `url(${image})`
              : "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
            backgroundPosition: image ? "center 42%" : "center center",
          }}
          aria-label={name || "Player image"}
        >
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Fallback number display when no image */}
          {!image && (
            <div className="relative z-10 text-white text-6xl font-bold drop-shadow-lg">
              #{number || "00"}
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4 bg-viking-gold text-viking-charcoal px-2 py-1 rounded font-bold shadow-lg z-20">
          #{number || "00"}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-viking-charcoal mb-2">
          {name || "Player Name"}
        </h3>

        <p className="text-viking-red font-semibold mb-3">
          {position || "Position"}
        </p>

        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>Height: {height || "N/A"}</span>
          <span>Weight: {weight || "N/A"}</span>
        </div>

        {bio && (
          <p className="text-gray-700 text-sm leading-relaxed">{bio}</p>
        )}
      </div>
    </div>
  );
}
