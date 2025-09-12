"use client";
import Image from "next/image";
import { Player } from "@/app/types/player";
import { FlagIcon } from "./FlagIcon";

export interface PlayerCardProps extends Player {
  variant?: "grid" | "list";
  highlight?: boolean; // optional future styling flag
}

const fallbackImage = "/images/players/playerFiller.avif";

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
    nationality,
    variant = "grid",
    highlight,
  } = props;
  const displayNumber =
    number !== undefined && number !== null
      ? `#${number.toString().padStart(2, "0")}`
      : "#00";

  // List variant (horizontal card)
  if (variant === "list") {
    return (
      <div
        className={`flex items-center bg-white dark:bg-viking-charcoal/70 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-viking-red-dark hover:shadow-lg transition-shadow p-4 gap-4 ${
          highlight ? "ring-2 ring-viking-red" : ""
        }`}
      >
        <div className="relative flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image || fallbackImage}
            alt={imageAlt || name || "Player image"}
            className="w-16 h-16 rounded-full object-cover"
            loading="lazy"
          />
          {nationality && (
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-viking-charcoal rounded-sm p-[2px] shadow ring-1 ring-black/5 dark:ring-white/10">
              <FlagIcon
                nationality={nationality}
                className="w-5 h-4 rounded-[2px]"
                title={nationality}
              />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                {name || "Player Name"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {displayNumber} • {position || "Position"}
              </p>
            </div>
          </div>
          {bio && (
            <p className="text-gray-700 dark:text-gray-300 text-xs mt-2 line-clamp-2">
              {bio}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Compact mobile version for grid variant only
  if (variant === "grid") {
    return (
      <>
        <div className="md:hidden flex flex-col items-center text-center px-2 py-4 w-full">
          {/* Avatar wrapper to allow badge to sit half outside the circle */}
          <div className="relative w-28 h-28 mb-3">
            <div
              className={`w-28 h-28 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow ${
                highlight ? "ring-2 ring-viking-red" : ""
              }`}
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={imageAlt || name || "Player image"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <img
                  src={fallbackImage}
                  alt={imageAlt || name || "Player image"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            {nationality && (
              <div className="absolute bottom-2 right-3 translate-x-1/4 translate-y-1/4 w-7 h-5 rounded-[3px] bg-white dark:bg-viking-charcoal shadow ring-1 ring-black/10 dark:ring-white/10 flex items-center justify-center">
                <FlagIcon
                  nationality={nationality}
                  className="w-full h-full rounded-[2px]"
                  title={nationality}
                />
              </div>
            )}
          </div>
          <h3 className="font-bold text-[13px] leading-tight text-viking-charcoal dark:text-gray-100 uppercase tracking-wide max-w-[140px]">
            {name || "Player Name"}
          </h3>
          <div className="mt-1 flex flex-col items-center gap-0.5">
            <p className="text-[10px] font-semibold italic tracking-wide text-gray-500 dark:text-gray-300 uppercase">
              {displayNumber} {position || "Position"}
            </p>
          </div>
        </div>

        <div
          className={`hidden md:block bg-white dark:bg-viking-charcoal/70 dark:border-viking-red-dark rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
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
              <div className="absolute inset-0 bg-black/30" />
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
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="text-xl font-bold text-viking-charcoal dark:text-gray-100">
                  {name || "Player Name"}
                </h3>
                <p className="text-viking-red dark:text-viking-gold font-semibold mt-1">
                  {position || "Position"}
                </p>
              </div>
              {nationality && (
                <FlagIcon
                  nationality={nationality}
                  className="w-7 h-5 rounded-sm ring-1 ring-black/10 dark:ring-white/10 flex-shrink-0"
                  title={nationality}
                />
              )}
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
              <span>Height: {height || "N/A"}</span>
              <span>Weight: {weight || "N/A"}</span>
            </div>
            {bio && (
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {bio}
              </p>
            )}
          </div>
        </div>
      </>
    );
  }

  // Fallback (list variant already handled above) – if variant somehow not grid/list
  return null;
}
