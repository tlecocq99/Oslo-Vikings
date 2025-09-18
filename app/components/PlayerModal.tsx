"use client";
import React from "react";
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
  trigger: React.ReactNode; // usually the card body
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
  const displayNumber =
    number != null ? `#${number.toString().padStart(2, "0")}` : "#00";

  // Append units if raw values are plain numbers (no existing letters or symbols)
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

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl w-[95vw] sm:w-full p-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Left / Top visual section */}
          <div className="sm:w-1/2 relative bg-gray-900 text-white flex items-center justify-center min-h-[200px] sm:min-h-[360px]">
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{
                backgroundImage: `url(${
                  image || "/images/players/playerFiller.avif"
                })`,
              }}
            />
            <div className="relative z-10 text-center p-6 space-y-2">
              <div className="text-5xl font-extrabold drop-shadow-lg">
                {displayNumber}
              </div>
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-bold tracking-wide">{name}</h2>
                {nationality && (
                  <FlagIcon
                    nationality={nationality}
                    className="w-6 h-4 rounded-sm ring-1 ring-white/20"
                  />
                )}
              </div>
              <p className="uppercase text-xs tracking-widest font-semibold text-viking-gold">
                {position}
              </p>
            </div>
          </div>
          {/* Right / Bottom details */}
          <div className="sm:w-1/2 p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{name}</DialogTitle>
              <DialogDescription>
                {position}
                {normalizedHeight ? ` • ${normalizedHeight}` : ""}
                {normalizedWeight ? ` • ${normalizedWeight}` : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 text-sm mt-2">
              <InfoBlock label="Number" value={displayNumber} />
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
                    <span>{nationality}</span>
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

// Utility HOC to wrap an existing PlayerCard trigger element
export function withPlayerModal<T extends Player>(
  player: T,
  card: React.ReactElement
) {
  return <PlayerModal player={player} trigger={card} />;
}
