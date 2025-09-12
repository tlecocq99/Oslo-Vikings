import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Game } from "@/app/types/game";

interface UpcomingGamesBarProps {
  games: Game[];
}

export default function UpcomingGamesBar({ games }: UpcomingGamesBarProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [teamFilter, setTeamFilter] = React.useState<
    "All" | "Main" | "D2" | "U17" | "U14" | "flag"
  >("Main");

  // Auto-generate placeholder games to ensure horizontal scroll visibility for every team filter.
  const placeholderTeams: Array<"Main" | "D2" | "U17" | "U14" | "flag"> = [
    "Main",
    "D2",
    "U17",
    "U14",
    "flag",
  ];

  const placeholderGames = React.useMemo(() => {
    const list: Game[] = [];
    const today = new Date();
    placeholderTeams.forEach((teamKey, tIndex) => {
      for (let i = 0; i < 10; i++) {
        const d = new Date(today.getTime() + (tIndex * 10 + i) * 86400000);
        list.push({
          id: `ph-${teamKey}-${i}`,
          team: teamKey,
          home_team:
            teamKey === "Main"
              ? "Oslo Vikings"
              : `Vikings ${teamKey.toUpperCase()}`,
          // Simple rotating opponents for visual variety
          away_team: [
            "Crusaders",
            "Black Knights",
            "Royal Crowns",
            "AIK",
            "Predators",
            "Mean Machines",
            "Griffins",
            "Towers",
          ][(i + tIndex) % 8],
          date: d.toISOString().slice(0, 10),
          time: `${(12 + (i % 6)).toString().padStart(2, "0")}:00`,
          sport: teamKey === "flag" ? "Flag" : "Tackle",
        } as Game);
      }
    });
    return list;
  }, []);

  const combinedGames = React.useMemo(() => {
    // Merge provided games first (they can override placeholder IDs if matching, though unlikely)
    const map = new Map<string, Game>();
    [...games, ...placeholderGames].forEach((g) => map.set(g.id, g));
    return Array.from(map.values());
  }, [games, placeholderGames]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const amount = clientWidth * 0.8;
    scrollRef.current.scrollTo({
      left: dir === "left" ? scrollLeft - amount : scrollLeft + amount,
      behavior: "smooth",
    });
  };

  const filteredGames = React.useMemo(() => {
    if (teamFilter === "All") return combinedGames;
    return combinedGames.filter((g) => g.team === teamFilter);
  }, [teamFilter, combinedGames]);

  return (
    // Hidden on mobile ( < md ) per requirement
    <section className="hidden md:block w-full bg-gray-50 dark:bg-viking-charcoal/70 border-b border-gray-200 dark:border-gray-700 py-4 transition-colors">
      <div className="w-full px-2 sm:px-4 lg:px-6 flex items-center">
        <div className="mr-10">
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
            className="block w-44 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-1 px-2 text-lg text-viking-red focus:outline-none focus:ring-2 focus:ring-viking-red font-teko"
          >
            <option value="All">ALL TEAMS</option>
            <option value="Main">SENIOR ELITE</option>
            <option value="D2">SENIOR D2</option>
            <option value="U17">U17</option>
            <option value="U14">U14</option>
            <option value="flag">FLAG FOOTBALL</option>
          </select>
        </div>
        <h2 className="font-bold text-viking-red text-lg mr-6 whitespace-nowrap">
          Upcoming Games
        </h2>
        <button
          className="hidden md:inline-flex p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-viking-red mr-2 transition-colors"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto scrollbar-hide flex gap-4 h-44"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="min-w-[220px] max-w-xs h-full bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 px-4 py-3 flex flex-col justify-between transition-colors"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">
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
                <span className="text-gray-400 dark:text-gray-500">vs</span>
                <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">
                  {game.away_team}
                </span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                {game.location}
              </div>
              {game.sport ? (
                <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {game.sport}
                </div>
              ) : (
                <div className="text-[10px] opacity-0 h-3">placeholder</div>
              )}
            </div>
          ))}
        </div>
        <button
          className="hidden md:inline-flex p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-viking-red ml-2 transition-colors"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
