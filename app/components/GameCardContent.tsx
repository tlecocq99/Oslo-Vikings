import { Calendar, MapPin, Clock } from "lucide-react";

export interface GameCardProps {
  home_team?: string;
  away_team?: string;
  date?: string;
  time?: string;
  location?: string;
  home_score?: number;
  away_score?: number;
  status?: "upcoming" | "live" | "completed";
}

export function GameCardContent({
  home_team,
  away_team,
  date,
  time,
  location,
  home_score,
  away_score,
  status,
}: GameCardProps) {
  const isOsloHome = home_team?.toLowerCase().includes("oslo");
  const isOsloAway = away_team?.toLowerCase().includes("oslo");

  return (
    <div className="bg-white dark:bg-viking-charcoal/70 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
      {/* Game Status */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === "completed"
              ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
              : status === "live"
              ? "bg-red-100 text-red-800 dark:bg-red-600/20 dark:text-red-400"
              : "bg-viking-gold/20 text-viking-charcoal dark:text-viking-gold"
          }`}
        >
          {status === "completed"
            ? "Final"
            : status === "live"
            ? "LIVE"
            : "Upcoming"}
        </span>

        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
        </div>
      </div>

      {/* Teams and Score */}
      <div className="grid grid-cols-3 items-center gap-4 mb-4">
        <div
          className={`text-center ${
            isOsloHome
              ? "text-viking-red font-bold"
              : "text-viking-charcoal dark:text-gray-100"
          }`}
        >
          <div className="text-lg font-semibold">{home_team}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">HOME</div>
        </div>

        <div className="text-center">
          {status === "completed" ? (
            <div className="text-2xl font-bold text-viking-charcoal dark:text-gray-100">
              {home_score} - {away_score}
            </div>
          ) : (
            <div className="text-lg font-semibold text-gray-500 dark:text-gray-400">
              VS
            </div>
          )}
        </div>

        <div
          className={`text-center ${
            isOsloAway
              ? "text-viking-red font-bold"
              : "text-viking-charcoal dark:text-gray-100"
          }`}
        >
          <div className="text-lg font-semibold">{away_team}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">AWAY</div>
        </div>
      </div>

      {/* Location */}
      {location && (
        <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>
      )}
    </div>
  );
}
