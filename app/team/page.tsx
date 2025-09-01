import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import PlayerCard from "../components/PlayerCard";
import { Grid3X3, List } from "lucide-react";
import { fetchPlayers } from "../services/fetchPlayers";
import { Player } from "../types/player";
import React from "react";

// Server component: fetch players securely (no bundling googleapis into client)
export default async function TeamPage() {
  const players = await fetchPlayers();
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Hero />
        <RosterSection players={players} />
        <CoachingStaff />
      </main>
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <section
      className="py-24 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/backgrounds/teamClose.avif')" }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 drop-shadow-2xl">
          Meet the Vikings
        </h1>
        <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-lg">
          Our roster of dedicated athletes representing Norwegian American
          football excellence
        </p>
      </div>
    </section>
  );
}

// Client subcomponent for interactive filtering & view toggle
function RosterSection({ players }: { players: Player[] }) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h2 className="text-3xl font-bold text-viking-charcoal mb-4">
            2025 Roster
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet the warriors who defend Oslo's honor on the American football
            field
          </p>
        </header>
        <RosterClient players={players} />
      </div>
    </section>
  );
}

// Mark as client for stateful logic
function RosterClient({ players }: { players: Player[] }) {
  "use client";
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [positionFilter, setPositionFilter] = React.useState<string>("All");
  const positions = ["All", "Offense", "Defense", "Special Teams"];

  const visible =
    positionFilter === "All"
      ? players
      : players.filter((p) => p.position === positionFilter);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
        <div className="flex flex-wrap gap-2">
          {positions.map((pos) => {
            const active = pos === positionFilter;
            return (
              <button
                key={pos}
                onClick={() => setPositionFilter(pos)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  active
                    ? "bg-viking-red text-white"
                    : "bg-gray-100 text-viking-charcoal hover:bg-gray-200"
                }`}
              >
                {pos}
              </button>
            );
          })}
        </div>
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              viewMode === "grid"
                ? "bg-white text-viking-red shadow-sm"
                : "text-gray-600 hover:text-viking-red"
            }`}
            aria-label="Grid view"
          >
            <Grid3X3 className="w-4 h-4" /> Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              viewMode === "list"
                ? "bg-white text-viking-red shadow-sm"
                : "text-gray-600 hover:text-viking-red"
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" /> List
          </button>
        </div>
      </div>

      {visible.length === 0 && (
        <p className="text-center text-gray-500">
          No players match the selected filter.
        </p>
      )}

      {viewMode === "grid" && visible.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visible.map((p) => (
            <PlayerCard key={p.id} {...p} />
          ))}
        </div>
      )}

      {viewMode === "list" && visible.length > 0 && (
        <ul className="space-y-4">
          {visible.map((p) => (
            <li
              key={`list-${p.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center p-4">
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.imageAlt || p.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                    loading="lazy"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {p.name}
                  </h3>
                  <p className="text-gray-600">
                    {p.number ? `#${p.number} • ` : ""}
                    {p.position}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function CoachingStaff() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-viking-charcoal mb-4">
            Coaching Staff
          </h2>
          <p className="text-gray-600">
            Experienced leadership guiding our team to victory
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StaffCard
            code="HC"
            name="Stein Eriksen"
            title="Head Coach"
            desc="15 years of coaching experience with a championship-winning background"
            accent="red"
          />
          <StaffCard
            code="OC"
            name="Thor Hansen"
            title="Offensive Coordinator"
            desc="Innovative strategist specializing in high-powered passing attacks"
            accent="gold"
          />
          <StaffCard
            code="DC"
            name="Ragnar Olsen"
            title="Defensive Coordinator"
            desc="Defensive mastermind known for disciplined, adaptive schemes"
            accent="red"
          />
        </div>
      </div>
    </section>
  );
}

function StaffCard({
  code,
  name,
  title,
  desc,
  accent,
}: {
  code: string;
  name: string;
  title: string;
  desc: string;
  accent: "red" | "gold";
}) {
  const bg =
    accent === "red"
      ? "bg-viking-red text-white"
      : "bg-viking-gold text-viking-charcoal";
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
      <div
        className={`w-20 h-20 ${bg} rounded-full mx-auto mb-4 flex items-center justify-center`}
      >
        <span className="font-bold text-xl">{code}</span>
      </div>
      <h3 className="text-xl font-bold text-viking-charcoal mb-2">{name}</h3>
      <p className="text-viking-red font-semibold mb-3">{title}</p>
      <p className="text-gray-700 text-sm">{desc}</p>
    </div>
  );
}
