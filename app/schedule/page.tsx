"use client";

import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import GameCard from "../components/GameCard";
import dynamic from "next/dynamic";

// Dynamically import standings (client component)
const Standings = dynamic(() => import("../components/Standings"), {
  ssr: false,
});
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UpcomingGame {
  component: string;
  home_team: string;
  away_team: string;
  date: string;
  time: string;
  location: string;
  status: "upcoming";
}

interface CompletedGame {
  component: string;
  home_team: string;
  away_team: string;
  date: string;
  time: string;
  location: string;
  home_score: number;
  away_score: number;
  status: "completed";
}

const upcomingGames: UpcomingGame[] = [
  {
    component: "game",
    home_team: "Vikings",
    away_team: "Eagles",
    date: "2024-01-15",
    time: "19:00",
    location: "Viking Stadium",
    status: "upcoming", // Now properly typed
  },
];

const completedGames: CompletedGame[] = [
  {
    component: "game",
    home_team: "Vikings",
    away_team: "Panthers",
    date: "2024-01-08",
    time: "18:00",
    location: "Panthers Stadium",
    home_score: 21,
    away_score: 14,
    status: "completed", // Now properly typed
  },
];

export default function SchedulePage() {
  const games = [
    {
      component: "game_card",
      home_team: "Oslo Vikings",
      away_team: "Bergen Bears",
      date: "2025-01-15",
      time: "15:00",
      location: "Viking Stadium, Oslo",
      home_score: 28,
      away_score: 14,
      status: "completed" as const,
    },
    {
      component: "game_card",
      home_team: "Trondheim Thunder",
      away_team: "Oslo Vikings",
      date: "2025-01-08",
      time: "14:00",
      location: "Thunder Field, Trondheim",
      home_score: 21,
      away_score: 35,
      status: "completed" as const,
    },
    {
      component: "game_card",
      home_team: "Oslo Vikings",
      away_team: "Stavanger Stallions",
      date: "2025-01-22",
      time: "15:00",
      location: "Viking Stadium, Oslo",
      status: "upcoming" as const,
    },
    {
      component: "game_card",
      home_team: "Kristiansand Knights",
      away_team: "Oslo Vikings",
      date: "2025-01-29",
      time: "13:00",
      location: "Knights Arena, Kristiansand",
      status: "upcoming" as const,
    },
    {
      component: "game_card",
      home_team: "Oslo Vikings",
      away_team: "Bergen Bears",
      date: "2025-02-05",
      time: "15:30",
      location: "Viking Stadium, Oslo",
      status: "upcoming",
    },
  ];

  return (
    <>
      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="oslo-gradient norse-pattern py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 hero-text-shadow">
              Season Schedule
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto">
              Follow the Oslo Vikings through the 2025 season. Never miss a
              game!
            </p>
          </div>
        </section>

        {/* Schedule Content */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="upcoming">Upcoming Games</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-viking-charcoal mb-2">
                    Upcoming Matches
                  </h2>
                  <p className="text-gray-600">
                    Get ready for these exciting games!
                  </p>
                </div>
                {upcomingGames.map((game, index) => (
                  <GameCard key={index} {...game} />
                ))}
              </TabsContent>

              <TabsContent value="results" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-viking-charcoal mb-2">
                    Game Results
                  </h2>
                  <p className="text-gray-600">
                    Review our recent performances
                  </p>
                </div>
                {completedGames.map((game, index) => (
                  <GameCard key={index} {...game} />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Standings */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-viking-charcoal mb-4">
                Standings
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Live league table pulled from superserien.se (cached every 30
                minutes).
              </p>
            </div>
            <Standings />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
