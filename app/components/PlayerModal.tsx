"use client";
import React from "react";
import Image from "next/image";
import { Player } from "@/app/types/player";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FlagIcon } from "./FlagIcon";

interface PlayerModalProps {
  player: Player;
  trigger: React.ReactNode;
}

export function PlayerModal({ player, trigger }: PlayerModalProps) {
  const {
    name,
    number,
    position,
    image,
    imageAlt,
    bio,
    nationality,
    height,
    weight,
  } = player;

  const rawNumberValue =
    typeof number === "number" || typeof number === "string"
      ? String(number).trim().replace(/^#/, "")
      : "";
  const displayNumber = rawNumberValue ? `#${rawNumberValue}` : undefined;
  const displayNumberFallback = displayNumber ?? "#00";

  const normalizedHeight = height
    ? /[a-zA-Z]/.test(height) || /cm|ft|in|'|”|″|’/.test(height)
      ? height
      : `${height} cm`
    : undefined;
  const normalizedWeight = weight
    ? /[a-zA-Z]/.test(weight) || /kg|lbs|lb/.test(weight)
      ? weight
      : `${weight} kg`
    : undefined;

  function countryDisplay(n: string): string {
    const raw = n.trim();
    const upper = raw.toUpperCase();
    const SPECIAL: Record<string, string> = {
      UK: "United Kingdom",
      GB: "United Kingdom",
      US: "United States",
      USA: "United States",
      NO: "Norway",
      SE: "Sweden",
      DK: "Denmark",
      DE: "Germany",
      FR: "France",
      CA: "Canada",
      ES: "Spain",
      IT: "Italy",
    };

    if (SPECIAL[upper]) return SPECIAL[upper];

    if (
      /^[A-Z]{2}$/.test(upper) &&
      typeof (Intl as any).DisplayNames !== "undefined"
    ) {
      try {
        const displayNames = new (Intl as any).DisplayNames(["en"], {
          type: "region",
        });
        const resolved = displayNames.of(upper);
        if (resolved) {
          return resolved as string;
        }
      } catch {
        // ignore – fall back to raw string
      }
    }

    return raw;
  }

  const displayNationality = nationality
    ? countryDisplay(nationality)
    : undefined;
  const imageSrc = image || "/images/players/playerFiller.png";
  const isFallbackImage = imageSrc === "/images/players/playerFiller.png";
  const overlayTextColor = isFallbackImage ? "text-white" : "text-viking-red";

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl w-[95vw] sm:w-full p-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/2 relative bg-gray-900 text-white flex items-stretch justify-center min-h-[200px] sm:min-h-[360px]">
            <Image
              src={imageSrc}
              alt={imageAlt || name || "Player image"}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 480px"
              priority={false}
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-end px-6 pt-8 pb-4 sm:pt-10 sm:pb-5 text-center space-y-2">
              <div
                className={`text-5xl font-extrabold drop-shadow-lg ${overlayTextColor}`}
              >
                {displayNumberFallback}
              </div>
              <div className="flex items-center justify-center gap-2">
                <h2
                  className={`text-2xl font-bold tracking-wide ${overlayTextColor}`}
                >
                  {name}
                </h2>
                {nationality && (
                  <FlagIcon
                    nationality={nationality}
                    className="w-6 h-4 rounded-sm ring-1 ring-white/20"
                  />
                )}
              </div>
              <p className="uppercase text-xs tracking-widest font-semibold text-viking-red">
                {position}
              </p>
            </div>
          </div>

          <div className="sm:w-1/2 p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{name}</DialogTitle>
              <DialogDescription className="text-viking-red">
                {position}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 text-sm mt-2">
              <InfoBlock label="Number" value={displayNumberFallback} />
              <InfoBlock label="Position" value={position || "N/A"} />
              <InfoBlock label="Height" value={normalizedHeight || "N/A"} />
              <InfoBlock label="Weight" value={normalizedWeight || "N/A"} />
              <div className="col-span-2">
                <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Bio
                </p>
                <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-h-52 overflow-y-auto pr-1 custom-scroll">
                  {bio ? (
                    bio
                  ) : (
                    <span className="italic text-gray-400">
                      No bio provided.
                    </span>
                  )}
                </div>
              </div>
              {nationality && (
                <div className="space-y-1 col-span-2">
                  <p className="font-semibold text-gray-700 dark:text-gray-200">
                    Nationality
                  </p>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <FlagIcon
                      nationality={nationality}
                      className="w-6 h-4 rounded-sm ring-1 ring-black/10 dark:ring-white/10"
                    />
                    <span>{displayNationality}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="font-semibold text-gray-700 dark:text-gray-200">{label}</p>
      <p className="text-gray-600 dark:text-gray-300">{value}</p>
    </div>
  );
}

export function withPlayerModal<T extends Player>(
  player: T,
  card: React.ReactElement
) {
  return <PlayerModal player={player} trigger={card} />;
}
