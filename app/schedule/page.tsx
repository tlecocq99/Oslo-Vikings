"use client";

import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import GameCard from "../components/GameCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SchedulePage() {
  const games = [
    {
      home_team: "Oslo Vikings",
      away_team: "Bergen Bears",
      date: "2025-01-15",
      time: "15:00",
      venue: "Viking Stadium, Oslo",
      home_score: 28,
      away_score: 14,
      status: "completed" as const,
    },
    {
      home_team: "Trondheim Thunder",
      away_team: "Oslo Vikings",
      date: "2025-01-08",
      time: "14:00",
      venue: "Thunder Field, Trondheim",
      home_score: 21,
      away_score: 35,
      status: "completed" as const,
    },
    {
      home_team: "Oslo Vikings",
      away_team: "Stavanger Stallions",
      date: "2025-01-22",
      time: "15:00",
      venue: "Viking Stadium, Oslo",
      status: "upcoming" as const,
    },
    {
      home_team: "Kristiansand Knights",
      away_team: "Oslo Vikings",
      date: "2025-01-29",
      time: "13:00",
      venue: "Knights Arena, Kristiansand",
      status: "upcoming" as const,
    },
    {
      home_team: "Oslo Vikings",
      away_team: "Bergen Bears",
      date: "2025-02-05",
      time: "15:30",
      venue: "Viking Stadium, Oslo",
      status: "upcoming" as const,
    },
  ];

  const completedGames = games.filter((game) => game.status === "completed");
  const upcomingGames = games.filter((game) => game.status === "upcoming");

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
                  <GameCard key={index} game={game} />
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
                  <GameCard key={index} game={game} />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Season Stats */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-viking-charcoal mb-4">
                Season Stats
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-viking-red mb-2">
                  2-0
                </div>
                <div className="text-gray-600">Record</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-viking-red mb-2">
                  63
                </div>
                <div className="text-gray-600">Points For</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-viking-red mb-2">
                  35
                </div>
                <div className="text-gray-600">Points Against</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-viking-red mb-2">
                  1st
                </div>
                <div className="text-gray-600">Division Rank</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
