// Revalidate contact page every 5 minutes
export const revalidate = 300;

import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Link from "next/link";
import { ALL_TEAMS } from "./team-config";

// Server component: fetch players securely (no bundling googleapis into client)
export default function TeamPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Hero />
        <TeamsOverview />
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

function TeamsOverview() {
  return (
    <section className="py-16 bg-white dark:bg-viking-charcoal/70 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-viking-charcoal dark:text-gray-100 mb-4">
            Choose Your Team
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore dedicated roster pages for each Oslo Vikings program to
            learn more about the players representing the organization.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {ALL_TEAMS.map((team) => (
            <Link
              key={team.slug}
              href={`/team/${team.slug}`}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-viking-red/20 dark:border-viking-gold/20 bg-gradient-to-tr from-white to-viking-red/5 dark:from-viking-charcoal dark:to-viking-charcoal/60"
            >
              <div
                className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                style={{
                  backgroundImage: `url('${
                    team.heroImage ?? "/images/backgrounds/teamClose.avif"
                  }')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="relative p-8 flex flex-col gap-4">
                <p className="text-xs uppercase tracking-[0.4em] text-viking-gold">
                  Oslo Vikings
                </p>
                <h3 className="text-2xl font-bold text-viking-charcoal dark:text-gray-100">
                  {team.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {team.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 text-viking-red dark:text-viking-gold font-semibold">
                  View roster
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoachingStaff() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-viking-charcoal/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-viking-charcoal mb-4 dark:text-gray-200">
            Coaching Staff
          </h2>
          <p className="text-gray-600 dark:text-gray-200">
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
    <div className="bg-white dark:bg-gray-800 rounded-lg dark:border dark:border-viking-red shadow-lg p-6 text-center transition-colors">
      <div
        className={`w-20 h-20 ${bg} rounded-full mx-auto mb-4 flex items-center justify-center`}
      >
        <span className="font-bold text-xl">{code}</span>
      </div>
      <h3 className="text-xl font-bold text-viking-charcoal mb-2 dark:text-gray-200">
        {name}
      </h3>
      <p className="text-viking-red font-semibold mb-3">{title}</p>
      <p className="text-gray-700 text-sm dark:text-gray-200">{desc}</p>
    </div>
  );
}
