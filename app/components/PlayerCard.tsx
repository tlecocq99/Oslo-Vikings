"use client";
import Image from "next/image";
import { Player } from "@/app/types/player";

export interface PlayerCardProps extends Player {
  variant?: "grid" | "list";
  highlight?: boolean; // optional future styling flag
}

const fallbackImage = "/images/players/playerFiller.avif"; // ensure file exists under public/images/players/

export default function PlayerCard(props: PlayerCardProps) {
  const {
    name,
    number,
    position,
    height,
    weight,
    image,
    imageAlt,
    bio,
    variant = "grid",
    highlight,
  } = props;

  const displayNumber =
    number !== undefined && number !== null
      ? `#${number.toString().padStart(2, "0")}`
      : "#00";
  if (variant === "list") {
    return (
      <div
        className={`flex items-center bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow p-4 ${
          highlight ? "ring-2 ring-viking-red" : ""
        }`}
      >
        <img
          src={image || fallbackImage}
          alt={imageAlt || name || "Player image"}
          className="w-16 h-16 rounded-full object-cover mr-4"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {name || "Player Name"}
          </h3>
          <p className="text-gray-600 text-sm">
            {displayNumber ? `${displayNumber} • ` : ""}
            {position || "Position"}
          </p>
          {bio && (
            <p className="text-gray-700 text-xs mt-2 line-clamp-2">{bio}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
        highlight ? "ring-2 ring-viking-red" : ""
      }`}
    >
      <div className="relative">
        <div
          className="h-48 bg-cover bg-no-repeat flex items-center justify-center relative"
          style={{
            backgroundImage: `url(${image || fallbackImage})`,
            backgroundPosition: "center 42%",
          }}
          aria-label={name || imageAlt}
        >
          <div className="absolute inset-0 bg-black/30"></div>
          {!image && (
            <div className="relative z-10 text-white text-6xl font-bold drop-shadow-lg">
              {displayNumber}
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4 bg-viking-gold text-viking-charcoal px-2 py-1 rounded font-bold shadow-lg z-20">
          {displayNumber}
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
        {bio && <p className="text-gray-700 text-sm leading-relaxed">{bio}</p>}
      </div>
    </div>
  );
}
