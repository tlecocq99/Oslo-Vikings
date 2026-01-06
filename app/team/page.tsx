// Revalidate contact page every 5 minutes
export const revalidate = 300;

import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Link from "next/link";
import Image from "next/image";
import { ALL_TEAMS } from "./team-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oslo Vikings – Teams Overview",
  description: "Meet the Oslo Vikings teams and their players.",
};

// Server component: fetch players securely (no bundling googleapis into client)
export default function TeamPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Hero />
        <TeamsOverview />
      </main>
      <Footer />
    </>
  );
}

function Hero() {
  const desktopImage: string = "/images/backgrounds/TEAMS-hero.png";
  const mobileImage: string = "/images/backgrounds/TEAMS-hero(16x9).png";
  const hasDistinctMobileImage = desktopImage !== mobileImage;
  const heroPlaceholder =
    "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%201%201'%3E%3Crect%20width='1'%20height='1'%20fill='%230b0e12'/%3E%3C/svg%3E";

  return (
    <section
      id="team-hero-overview"
      className="relative w-full overflow-hidden bg-black aspect-[16/9] lg:aspect-auto lg:min-h-[60vh]"
    >
      <div className="pointer-events-none absolute inset-0 block h-full w-full">
        {hasDistinctMobileImage ? (
          <>
            <Image
              src={mobileImage}
              alt="Oslo Vikings team hero (mobile)"
              fill
              priority
              sizes="100vw"
              className="object-cover lg:hidden"
              placeholder="blur"
              blurDataURL={heroPlaceholder}
            />
            <Image
              src={desktopImage}
              alt="Oslo Vikings team hero (desktop)"
              fill
              priority
              sizes="100vw"
              className="hidden lg:block object-cover"
              placeholder="blur"
              blurDataURL={heroPlaceholder}
            />
          </>
        ) : (
          <Image
            src={desktopImage}
            alt="Oslo Vikings team hero"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={heroPlaceholder}
          />
        )}
      </div>
      <div className="absolute inset-0 hidden bg-gradient-to-b from-black/75 via-black/60 to-black/75 dark:block" />
      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-viking-red/30 shadow-[0_25px_60px_-25px_rgba(172,20,22,0.65)] dark:bg-transparent dark:shadow-none dark:ring-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight drop-shadow-[0_0_32px_rgba(0,0,0,0.45)] dark:drop-shadow-[0_0_35px_rgba(0,0,0,0.65)] relative after:content-[''] after:block after:h-1 after:w-24 after:bg-viking-red after:rounded-full after:mx-auto after:mt-6">
            Meet the Vikings
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-3xl mx-auto drop-shadow-[0_0_24px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_0_25px_rgba(0,0,0,0.55)]">
            Our roster of dedicated athletes representing Norwegian American
            football excellence
          </p>
        </div>
      </div>
    </section>
  );
}

function TeamsOverview() {
  return (
    <section className="py-16 bg-white dark:bg-viking-surface transition-colors">
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
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-viking-red/20 dark:border-viking-red/30 bg-gradient-to-tr from-white to-viking-red/5 dark:from-viking-charcoal dark:to-viking-charcoal/60"
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
                <p className="text-xs uppercase tracking-[0.4em] text-viking-red">
                  Oslo Vikings
                </p>
                <h3 className="text-2xl font-bold text-viking-charcoal dark:text-gray-100">
                  {team.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {team.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 text-viking-red dark:text-viking-red font-semibold">
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
  accent: "solid" | "subtle";
}) {
  const badgeClasses =
    accent === "solid"
      ? "bg-viking-red text-white"
      : "bg-viking-red/15 text-viking-red dark:bg-viking-red/25 dark:text-viking-red";
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg dark:border dark:border-viking-red shadow-lg p-6 text-center transition-colors">
      <div
        className={`w-20 h-20 ${badgeClasses} rounded-full mx-auto mb-4 flex items-center justify-center`}
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
