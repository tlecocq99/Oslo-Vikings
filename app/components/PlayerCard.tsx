"use client";
import Image from "next/image";
import { Player } from "@/app/types/player";
import { FlagIcon } from "./FlagIcon";
import { PlayerModal } from "./PlayerModal";
import { getImageLoaderProps } from "@/lib/imageLoader";

export interface PlayerCardProps extends Player {
  variant?: "grid" | "list";
  highlight?: boolean; // optional future styling flag
}

const fallbackImage = "/images/players/playerFiller.png";

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
    typeof number === "number" || typeof number === "string"
      ? `#${String(number).trim()}`
      : undefined;
  const imageSrc = image || fallbackImage;
  const imageLoaderProps = getImageLoaderProps(imageSrc);
  const imageAltText = imageAlt || name || "Player image";

  // List variant (horizontal card)
  if (variant === "list") {
    const listContent = (
      <div
        className={`flex items-center bg-white dark:bg-viking-surface rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-viking-red-dark hover:shadow-lg transition-shadow p-4 gap-4 cursor-pointer ${
          highlight ? "ring-2 ring-viking-red" : ""
        }`}
      >
        <div className="relative flex-shrink-0">
          <Image
            src={imageSrc}
            alt={imageAltText}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover"
            loading="lazy"
            sizes="64px"
            {...imageLoaderProps}
          />
          {nationality && (
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-viking-surface-alt rounded-sm p-[2px] shadow ring-1 ring-black/5 dark:ring-white/10">
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
    return <PlayerModal player={props} trigger={listContent} />;
  }

  // Compact mobile version for grid variant only
  if (variant === "grid") {
    const mobile = (
      <div className="md:hidden flex flex-col items-center text-center px-2 py-4 w-full">
        {/* Avatar wrapper to allow badge to sit half outside the circle */}
        <div className="relative w-28 h-28 mb-3">
          <div
            className={`w-28 h-28 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow ${
              highlight ? "ring-2 ring-viking-red" : ""
            }`}
          >
            <Image
              src={imageSrc}
              alt={imageAltText}
              width={112}
              height={112}
              className="w-full h-full object-cover"
              loading="lazy"
              sizes="112px"
              {...imageLoaderProps}
            />
          </div>
          {nationality && (
            <div className="absolute bottom-2 right-3 translate-x-1/4 translate-y-1/4 w-7 h-5 rounded-[3px] bg-white dark:bg-viking-surface-alt shadow ring-1 ring-black/10 dark:ring-white/10 flex items-center justify-center">
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
    );
    const desktop = (
      <div
        className={`hidden md:flex md:flex-col md:h-full bg-white dark:bg-viking-surface dark:border-viking-red-dark rounded-lg shadow-lg overflow-hidden transform-gpu transition-shadow duration-300 ease-out md:hover:scale-[1.06] md:hover:-translate-y-1 md:hover:shadow-2xl ${
          highlight ? "ring-2 ring-viking-red" : ""
        }`}
      >
        <div className="relative">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAltText}
              fill
              className="object-cover"
              sizes="(max-width: 1023px) 60vw, 320px"
              loading="lazy"
              {...imageLoaderProps}
            />
            {!image && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                <span className="text-white text-6xl font-bold drop-shadow-lg">
                  {displayNumber}
                </span>
              </div>
            )}
          </div>
          <div className="absolute top-8 right-4 bg-viking-red text-white px-2 py-1 rounded font-bold shadow-lg z-20">
            {displayNumber}
          </div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="text-xl font-bold text-viking-charcoal dark:text-gray-100">
                {name || "Player Name"}
              </h3>
              <p className="text-viking-red dark:text-viking-red font-semibold mt-1">
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
          {bio && (
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-2">
              {bio}
            </p>
          )}
        </div>
      </div>
    );
    return (
      <PlayerModal
        player={props}
        trigger={
          <div className="cursor-pointer h-full flex flex-col">
            {mobile}
            {desktop}
          </div>
        }
      />
    );
  }

  // Fallback (list variant already handled above) – if variant somehow not grid/list
  return null;
}
