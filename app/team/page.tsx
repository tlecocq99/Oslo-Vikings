import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import PlayerCard from "../components/PlayerCard"; // still used via RosterClient
import { Player } from "../types/player";
import React from "react";
import RosterSwitcher from "@/app/components/RosterSwitcher";
import { fetchRoster } from "@/app/services/fetchRoster";

// Server component: fetch players securely (no bundling googleapis into client)
export default async function TeamPage() {
  const ROSTER_TABS = {
    "Senior Elite": "Senior Elite",
    "Senior D2": "Senior D2",
    U17: "U17",
    U14: "U14",
    "Flag Football": "Flag",
  } as const;

  // Fetch each roster tab in parallel; if a tab is missing, return empty list instead of throwing.
  const entries = await Promise.all(
    Object.entries(ROSTER_TABS).map(async ([label, tab]) => {
      try {
        const list = await fetchRoster(tab);
        return [label, list] as const;
      } catch (e) {
        console.warn(`Roster tab '${tab}' failed to load:`, e);
        return [label, [] as Player[]] as const;
      }
    })
  );
  const rosters: Record<string, Player[]> = Object.fromEntries(entries);

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Hero />
        <RosterSwitcher rosters={rosters} />
        <CoachingStaff />
      </main>
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <section
      className="py-20 md:py-24 bg-cover bg-center bg-no-repeat relative min-h-[50vh] md:min-h-[60vh] flex items-center"
      style={{ backgroundImage: "url('/images/backgrounds/teamClose.avif')" }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl leading-tight">
          Meet the Vikings
        </h1>
        <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto drop-shadow-lg">
          Our roster of dedicated athletes representing Norwegian American
          football excellence
        </p>
      </div>
    </section>
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
