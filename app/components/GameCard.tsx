"use client";

import { Calendar, MapPin, Clock } from "lucide-react";

interface Game {
  home_team?: string;
  away_team?: string;
  date?: string;
  time?: string;
  venue?: string;
  status?: "upcoming" | "live" | "completed";
  home_score?: number;
  away_score?: number;
}

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const isOsloHome = game.home_team?.toLowerCase().includes("oslo");
  const isOsloAway = game.away_team?.toLowerCase().includes("oslo");

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        {/* Game Status */}
        <div className="flex justify-between items-center mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              game.status === "live"
                ? "bg-red-100 text-red-800"
                : game.status === "completed"
                ? "bg-gray-100 text-gray-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {game.status === "live"
              ? "LIVE"
              : game.status === "completed"
              ? "FINAL"
              : "UPCOMING"}
          </span>

          {game.status === "completed" && (
            <div className="text-2xl font-bold text-viking-charcoal">
              {game.home_score} - {game.away_score}
            </div>
          )}
        </div>

        {/* Teams */}
        <div className="grid grid-cols-3 items-center gap-4 mb-6">
          {/* Home Team */}
          <div className="text-center">
            <div
              className={`text-lg font-bold ${
                isOsloHome ? "text-viking-red" : "text-gray-800"
              }`}
            >
              {game.home_team}
            </div>
            {game.status === "completed" && (
              <div className="text-2xl font-bold mt-2 text-viking-charcoal">
                {game.home_score}
              </div>
            )}
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="text-gray-500 font-medium">vs</div>
          </div>

          {/* Away Team */}
          <div className="text-center">
            <div
              className={`text-lg font-bold ${
                isOsloAway ? "text-viking-red" : "text-gray-800"
              }`}
            >
              {game.away_team}
            </div>
            {game.status === "completed" && (
              <div className="text-2xl font-bold mt-2 text-viking-charcoal">
                {game.away_score}
              </div>
            )}
          </div>
        </div>

        {/* Game Details */}
        <div className="space-y-2 text-sm text-gray-600">
          {game.date && (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(game.date).toLocaleDateString()}</span>
            </div>
          )}

          {game.time && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{game.time}</span>
            </div>
          )}

          {game.venue && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{game.venue}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
