"use client";

import { useState } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import PlayerCard from "../components/PlayerCard";
import { Grid3X3, List, Users } from "lucide-react";

export default function TeamPage() {
  // Mock player data - replace with Storyblok data
  const players = [
    {
      component: "player_card",
      name: "William Sewell",
      position: "Quarterback",
      number: "01",
      height: "6'2\"",
      weight: "210 lbs",
      bio: "Team captain and veteran quarterback leading the Vikings offense with precision and Norwegian grit.",
      photo: { filename: "/images/players/williamsewell.avif" },
    },
    {
      component: "player_card",
      name: "Jesper Jørgensen",
      position: "Running Back",
      number: "02",
      height: "5'11\"",
      weight: "195 lbs",
      bio: "Explosive running back known for his speed and agility on the field.",
      photo: { filename: "/images/players/jesperjorgensen.avif" },
    },
    {
      component: "player_card",
      name: "Ahmed Yasin",
      position: "Wide Receiver",
      number: "04",
      height: "6'0\"",
      weight: "185 lbs",
      bio: "Sure-handed receiver with excellent route running and catching ability.",
      photo: { filename: "/images/players/ahmedyasin.avif" },
    },
    {
      component: "player_card",
      name: "Robin Rossvold Ekstrøm",
      position: "Linebacker",
      number: "06",
      height: "6'3\"",
      weight: "235 lbs",
      bio: "Defensive anchor with incredible tackling skills and field awareness.",
      photo: { filename: "/images/players/robinekstrom.avif" },
    },
    {
      component: "player_card",
      name: "Vegard Tysse",
      position: "Running Back",
      number: "07",
      height: "6'4\"",
      weight: "250 lbs",
      bio: "Pass rush specialist bringing pressure from the edge with relentless pursuit.",
      photo: { filename: "/images/players/vegardtysse.avif" },
    },
    {
      component: "player_card",
      name: "Daniel Nygård",
      position: "Wide Receiver",
      number: "08",
      height: "6'5\"",
      weight: "290 lbs",
      bio: "Veteran lineman protecting the quarterback with strength and technique.",
      photo: { filename: "/images/players/danielnygard.avif" },
    },
  ];

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
                {players.map((player, index) => (
                  <PlayerCard key={index} blok={player} />
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-4">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center p-4">
                      {/* Player Image */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        {player.image ? (
                          <img
                            src={player.image}
                            alt={player.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-viking-red flex items-center justify-center">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                        )}
                        {/* Number overlay */}
                        <div className="absolute inset-0 bg-black/20 flex items-end justify-end p-1">
                          <span className="text-white text-xs font-bold bg-black/50 px-1 rounded">
                            #{player.number}
                          </span>
                        </div>
                      </div>

                      {/* Player Info */}
                      <div className="flex-1 ml-4 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-viking-charcoal truncate">
                              {player.name}
                            </h3>
                            <p className="text-viking-red font-semibold text-sm">
                              {player.position}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 sm:mt-0">
                            <div className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {player.height}
                            </div>
                            <div className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {player.weight}
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                          {player.bio}
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
