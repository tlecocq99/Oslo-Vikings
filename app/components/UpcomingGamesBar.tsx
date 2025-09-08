import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Game } from "@/app/types/game";

interface UpcomingGamesBarProps {
  games: Game[];
}

export default function UpcomingGamesBar({ games }: UpcomingGamesBarProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [teamFilter, setTeamFilter] = React.useState<"Main" | "D2" | "U17">(
    "Main"
  );

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const amount = clientWidth * 0.8;
    scrollRef.current.scrollTo({
      left: dir === "left" ? scrollLeft - amount : scrollLeft + amount,
      behavior: "smooth",
    });
  };

  const filteredGames = games.filter((g) => g.team === teamFilter);

  return (
    // Hidden on mobile ( < md ) per requirement
    <section className="hidden md:block w-full bg-gray-50 border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="mr-6">
          <label
            htmlFor="team-filter"
            className="block text-xs font-semibold text-viking-red mb-1"
          >
            Team
          </label>
          <select
            id="team-filter"
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value as any)}
            className="block w-40 rounded border border-gray-300 bg-white py-1 px-2 text-sm text-viking-red focus:outline-none focus:ring-2 focus:ring-viking-red"
          >
            <option value="Main">Senior Elite</option>
            <option value="D2">Senior D2</option>
            <option value="U17">U17</option>
            <option value="U14">U14</option>
            <option value="flag">Flag Football</option>
          </select>
        </div>
        <h2 className="font-bold text-viking-red text-lg mr-6 whitespace-nowrap">
          Upcoming Games
        </h2>
        <button
          className="hidden md:inline-flex p-2 rounded-full hover:bg-gray-200 text-viking-red mr-2"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto scrollbar-hide flex gap-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="min-w-[220px] max-w-xs bg-white rounded-lg shadow border border-gray-200 px-4 py-3 flex flex-col justify-between scroll-snap-align-start"
            >
              <div className="text-xs text-gray-500 font-semibold mb-1">
                {new Date(game.date).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
                {" / "}
                {game.time}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-viking-red text-sm">
                  {game.home_team}
                </span>
                <span className="text-gray-400">vs</span>
                <span className="font-bold text-gray-700 text-sm">
                  {game.away_team}
                </span>
              </div>
              <div className="text-xs text-gray-600 mb-1">{game.location}</div>
              {game.sport && (
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                  {game.sport}
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          className="hidden md:inline-flex p-2 rounded-full hover:bg-gray-200 text-viking-red ml-2"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
