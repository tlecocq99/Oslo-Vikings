"use client";
import type { Game } from "@/app/types/game";
import Navigation from "./components/Navigation";
import SplashScreen from "./components/SplashScreen";
import UpcomingGamesBar from "./components/UpcomingGamesBar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import NewsCard from "./components/NewsCard";
import GameCard from "./components/GameCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Trophy, Users, Calendar } from "lucide-react";
import { Teko } from "next/font/google";

const teko = Teko({ subsets: ["latin"] });

// Type guard to ensure valid status
function normalizeGameStatus(
  status: string
): "upcoming" | "live" | "completed" {
  if (status === "upcoming" || status === "live" || status === "completed") {
    return status;
  }
  return "upcoming"; // Default fallback
}

export default function Home() {
  const heroData = {
    component: "hero",
    title: "Oslo Vikings",
    subtitle:
      "Conquering the field with Norwegian strength and American football passion",
    cta_text: "Join OV Now!",
    cta_link: { url: "/recruitment" },
  };

  const featuredNews = [
    {
      component: "news_card",
      title: "Vikings Dominate Season Opener",
      excerpt:
        "Oslo Vikings secured a commanding 28-14 victory in their season opener against Bergen Bears.",
      author: "Sports Desk",
      date: "2025-01-15",
      category: "Game Recap",
      slug: "vikings-dominate-season-opener",
    },
    {
      component: "news_card",
      title: "New Head Coach Brings Championship Experience",
      excerpt:
        "Former NFL assistant coach joins Oslo Vikings with plans to elevate the program.",
      author: "Team Management",
      date: "2025-01-10",
      category: "Team News",
      slug: "new-head-coach",
    },
  ];

  const upcomingGame = {
    component: "game",
    home_team: "Oslo Vikings",
    away_team: "Stavanger Stallions",
    date: "2025-01-22",
    time: "15:00",
    location: "Viking Stadium, Oslo",
    status: normalizeGameStatus("upcoming"), // Safely convert string to literal type
  };

  // Example upcoming games data
  const upcomingGames: Game[] = [
    {
      id: "1",
      date: "2025-09-07",
      time: "15:00",
      home_team: "Oslo Vikings",
      away_team: "Bergen Bears",
      location: "Viking Stadium, Oslo",
      sport: "Football",
      team: "Main",
    },
    {
      id: "2",
      date: "2025-09-14",
      time: "14:00",
      home_team: "Trondheim Thunder",
      away_team: "Oslo Vikings",
      location: "Thunder Field, Trondheim",
      sport: "Football",
      team: "Main",
    },
    {
      id: "3",
      date: "2025-09-21",
      time: "16:00",
      home_team: "Oslo Vikings D2",
      away_team: "Stavanger Stallions D2",
      location: "Viking Stadium, Oslo",
      sport: "Football",
      team: "D2",
    },
    {
      id: "4",
      date: "2025-09-28",
      time: "13:00",
      home_team: "Oslo Vikings U17",
      away_team: "Kristiansand Knights U17",
      location: "Knights Arena, Kristiansand",
      sport: "Football",
      team: "U17",
    },
    {
      id: "5",
      date: "2025-10-05",
      time: "12:00",
      home_team: "Oslo Vikings",
      away_team: "Stavanger Stallions",
      location: "Viking Stadium, Oslo",
      sport: "Football",
      team: "Main",
    },
  ];

  const sponsors = [
    {
      name: "Nordic Energy Group",
      tier: "Premier Partner",
      description: "Powering every kickoff with sustainable energy solutions.",
      website: "https://example.com/nordic-energy",
      initials: "NE",
      accent: "from-viking-red to-viking-gold",
    },
    {
      name: "Viking Financial",
      tier: "Gold Sponsor",
      description: "Supporting our athletes with smart financial planning.",
      website: "https://example.com/viking-financial",
      initials: "VF",
      accent: "from-viking-gold to-amber-400",
    },
    {
      name: "Oslo Sports Medicine",
      tier: "Official Medical Partner",
      description: "Keeping the roster ready for battle all season long.",
      website: "https://example.com/oslo-sports-medicine",
      initials: "OS",
      accent: "from-sky-500 to-blue-600",
    },
    {
      name: "FjordTech Labs",
      tier: "Technology Partner",
      description: "Delivering cutting-edge analytics for performance gains.",
      website: "https://example.com/fjordtech",
      initials: "FT",
      accent: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <>
      <SplashScreen />
      <Navigation />

      {/* Upcoming Games Bar */}
      <UpcomingGamesBar games={upcomingGames} />

      {/* Hero Section */}
      <Hero {...heroData} />

      {/* Quick Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-viking-charcoal/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ac1416] rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-viking-charcoal dark:text-viking-gold mb-2">
                5
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Championship Wins
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-viking-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-viking-charcoal" />
              </div>
              <h3 className="text-2xl font-bold text-viking-charcoal dark:text-viking-red mb-2">
                45
              </h3>
              <p className="text-gray-600 dark:text-gray-200">Active Players</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-viking-red rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-viking-charcoal dark:text-viking-gold mb-2">
                15
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Years Established
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Game Section */}
      <section className="py-16 bg-white dark:bg-viking-charcoal/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-viking-charcoal dark:text-gray-200 mb-4">
              Next Game
            </h2>
          </div>
          <div className="max-w-md mx-auto">
            <GameCard {...upcomingGame} />
          </div>

          <div className="text-center mt-8">
            <Button
              asChild
              variant="outline"
              className="border-viking-red text-viking-red hover:bg-viking-red hover:text-white"
            >
              <Link href="/schedule">
                View Full Schedule <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-gray-50 dark:bg-viking-charcoal/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-viking-charcoal dark:text-gray-200 mb-4">
              Latest News
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              Stay updated with the latest Oslo Vikings news, game recaps, and
              team announcements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-8">
            {featuredNews.map((news, index) => (
              <NewsCard key={index} {...news} />
            ))}
          </div>

          <div className="text-center">
            <Button
              asChild
              variant="outline"
              className="border-viking-red text-viking-red hover:bg-viking-red hover:text-white"
            >
              <Link href="/news">
                All News <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-16 bg-white dark:bg-viking-charcoal/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-viking-charcoal dark:text-gray-200 mb-4">
              Proud Sponsors
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We’re grateful for the partners who help grow Oslo Vikings
              football. Interested in joining this roster? Reach out to our
              partnerships team.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.name}
                className="rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/90 dark:bg-viking-charcoal/60 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col h-full">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${sponsor.accent} flex items-center justify-center text-white text-xl font-semibold mx-auto mb-4 shadow-md`}
                  >
                    {sponsor.initials}
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-sm uppercase tracking-wide text-viking-red/80 dark:text-viking-gold/80 font-semibold">
                      {sponsor.tier}
                    </p>
                    <h3 className="text-xl font-bold text-viking-charcoal dark:text-gray-100 mt-1">
                      {sponsor.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
                      {sponsor.description}
                    </p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-6 border-viking-red text-viking-red hover:bg-viking-red hover:text-white"
                  >
                    <a href={sponsor.website} rel="noreferrer">
                      Visit Site
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
