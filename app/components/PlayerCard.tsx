"use client";

import Image from "next/image";

interface Player {
  name?: string;
  position?: string;
  number?: string;
  height?: string;
  weight?: string;
  photo?: string;
  bio?: string;
  image?: string;
}

interface PlayerCardProps {
  player: Player;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <div
          className="h-48 bg-cover bg-no-repeat flex items-center justify-center relative"
          style={{
            backgroundImage: player.image
              ? `url(${player.image})`
              : player.photo
              ? `url(${player.photo})`
              : "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
            backgroundPosition:
              player.image || player.photo ? "center 42%" : "center center",
          }}
        >
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Fallback number display when no image */}
          {!player.image && !player.photo && (
            <div className="relative z-10 text-white text-6xl font-bold drop-shadow-lg">
              #{player.number || "00"}
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4 bg-viking-gold text-viking-charcoal px-2 py-1 rounded font-bold shadow-lg z-20">
          #{player.number || "00"}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-viking-charcoal mb-2">
          {player.name || "Player Name"}
        </h3>

        <p className="text-viking-red font-semibold mb-3">
          {player.position || "Position"}
        </p>

        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>Height: {player.height || "N/A"}</span>
          <span>Weight: {player.weight || "N/A"}</span>
        </div>

        {player.bio && (
          <p className="text-gray-700 text-sm leading-relaxed">{player.bio}</p>
        )}
      </div>
    </div>
  );
}
