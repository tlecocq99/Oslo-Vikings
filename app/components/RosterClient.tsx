"use client";
import React from "react";
import { Player } from "@/app/types/player";
import PlayerCard from "./PlayerCard";
import { Grid3X3, List } from "lucide-react";
import {
  getSideForPosition,
  ROSTER_SIDES,
  POSITION_GROUPS,
} from "@/app/config/positions";

interface RosterClientProps {
  players: Player[];
}

export default function RosterClient({ players }: RosterClientProps) {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [sideFilter, setSideFilter] = React.useState<
    "All" | (typeof ROSTER_SIDES)[number]
  >("All");
  const sideFilters: ("All" | (typeof ROSTER_SIDES)[number])[] = [
    "All",
    ...ROSTER_SIDES,
  ];

  // Ensure players with unknown or unmapped positions are still shown when a side filter is active
  const visible =
    sideFilter === "All"
      ? players
      : players.filter((p) => {
          const side = getSideForPosition(p.position);
          if (!side) return true; // keep unknown positions visible instead of hiding them
          return side === sideFilter;
        });

  // Build a stable ordering index for positions (side order + intra-side order)
  const positionOrderRef = React.useRef<Record<string, number>>();
  if (!positionOrderRef.current) {
    const map: Record<string, number> = {};
    ROSTER_SIDES.forEach((side, sideIdx) => {
      POSITION_GROUPS[side].forEach((pos, posIdx) => {
        map[pos.toLowerCase()] = sideIdx * 100 + posIdx; // room between sides
      });
    });
    positionOrderRef.current = map;
  }

  function getPositionRank(pos?: string): number {
    if (!pos) return Number.MAX_SAFE_INTEGER;
    const key = pos.toLowerCase();
    const rank = positionOrderRef.current![key];
    return rank === undefined ? Number.MAX_SAFE_INTEGER : rank;
  }

  const sortedVisible = React.useMemo(() => {
    return [...visible].sort((a, b) => {
      const ra = getPositionRank(a.position);
      const rb = getPositionRank(b.position);
      if (ra !== rb) return ra - rb;
      // Secondary: jersey number if present, else name
      if (a.number != null && b.number != null && a.number !== b.number) {
        return a.number - b.number;
      }
      return a.name.localeCompare(b.name);
    });
  }, [visible]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 lg:mb-12 gap-4 ">
        <div className="flex flex-nowrap overflow-x-auto max-w-full gap-2 pb-1 scrollbar-thin scrollbar-thumb-gray-300 ">
          {sideFilters.map((side) => {
            const active = side === sideFilter;
            return (
              <button
                key={side}
                onClick={() => setSideFilter(side)}
                className={`px-4 py-2 rounded-full transition-colors text-sm font-medium border ${
                  active
                    ? "bg-viking-red text-white border-viking-red hover:bg-viking-red/90"
                    : "bg-gray-100 dark:bg-gray-800 text-viking-charcoal dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {side}
              </button>
            );
          })}
        </div>
        <div className="flex items-center bg-gray-100 dark:bg-viking-charcoal/60 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors dark:bg-viking-charcoal ${
              viewMode === "grid"
                ? "bg-white text-viking-red shadow-sm"
                : "text-gray-600 dark:text-gray-200 hover:text-viking-red"
            }`}
            aria-label="Grid view"
          >
            <Grid3X3 className="w-4 h-4 dark:bg-viking-charcoal" /> Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              viewMode === "list"
                ? "bg-white text-viking-red shadow-sm"
                : "text-gray-600 dark:text-gray-200 hover:text-viking-red"
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" /> List
          </button>
        </div>
      </div>

      {visible.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No players match the selected filter.
        </p>
      )}

      {viewMode === "grid" && sortedVisible.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sortedVisible.map((p) => (
            <PlayerCard key={p.id} {...p} variant="grid" />
          ))}
        </div>
      )}

      {viewMode === "list" && sortedVisible.length > 0 && (
        <ul className="space-y-4">
          {sortedVisible.map((p) => (
            <li key={`list-${p.id}`}>
              <PlayerCard {...p} variant="list" />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
