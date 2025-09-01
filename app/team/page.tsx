"use client";

import { useState } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import PlayerCard from "../components/PlayerCard";
import { Grid3X3, List, Users } from "lucide-react";

// Define the Player interface based on your data structure
interface Player {
  id?: string;
  name: string;
  number?: number;
  position: string;
  team?: string;
  image?: string;
  height?: string;
  weight?: string;
  bio?: string;
}

export const revalidate = 60; // align with CACHE_TTL

export default async function TeamPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/players`,
    { next: { revalidate: 60 } }
  );
  const data: Player[] = res.ok ? await res.json() : [];

  const positions = ["All", "Offense", "Defense", "Special Teams"];
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <>
      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section
          className="py-24 bg-cover bg-center bg-no-repeat relative"
          style={{
            backgroundImage: `url('/images/backgrounds/teamClose.avif')`,
          }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>

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

        {/* Team Roster */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-viking-charcoal mb-4">
                2025 Roster
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Meet the warriors who defend Oslo's honor on the American
                football field
              </p>
            </div>

            {/* Controls: Position Filter + View Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
              {/* Position Filter */}
              <div className="flex flex-wrap gap-2">
                {positions.map((position) => (
                  <button
                    key={position}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      position === "All"
                        ? "bg-viking-red text-white"
                        : "bg-gray-100 text-viking-charcoal hover:bg-gray-200"
                    }`}
                  >
                    {position}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-viking-red shadow-sm"
                      : "text-gray-600 hover:text-viking-red"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-viking-red shadow-sm"
                      : "text-gray-600 hover:text-viking-red"
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
              </div>
            </div>

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.map((player, i) => (
                  <PlayerCard
                    key={`${player.number ?? i}-${player.name ?? i}`}
                    {...player} // Spread the player properties as props
                  />
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-4">
                {data.map((player: Player, index: number) => (
                  <div
                    key={`list-${player.number ?? index}-${
                      player.name ?? index
                    }`}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center p-4">
                      {player.image && (
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {player.name}
                        </h3>
                        <p className="text-gray-600">
                          #{player.number} • {player.position}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Coaching Staff */}
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
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-20 h-20 bg-viking-red rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">HC</span>
                </div>
                <h3 className="text-xl font-bold text-viking-charcoal mb-2">
                  Stein Eriksen
                </h3>
                <p className="text-viking-red font-semibold mb-3">Head Coach</p>
                <p className="text-gray-700 text-sm">
                  15 years of coaching experience with a championship-winning
                  background
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-20 h-20 bg-viking-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-viking-charcoal font-bold text-xl">
                    OC
                  </span>
                </div>
                <h3 className="text-xl font-bold text-viking-charcoal mb-2">
                  Thor Hansen
                </h3>
                <p className="text-viking-red font-semibold mb-3">
                  Offensive Coordinator
                </p>
                <p className="text-gray-700 text-sm">
                  Innovative offensive strategist specializing in high-powered
                  passing attacks
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-20 h-20 bg-viking-red rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">DC</span>
                </div>
                <h3 className="text-xl font-bold text-viking-charcoal mb-2">
                  Ragnar Olsen
                </h3>
                <p className="text-viking-red font-semibold mb-3">
                  Defensive Coordinator
                </p>
                <p className="text-gray-700 text-sm">
                  Defensive mastermind known for creating impenetrable defensive
                  schemes
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
