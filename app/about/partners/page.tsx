import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Award, TrendingUp, Users, HeartHandshake } from "lucide-react";

const partnerTiers = [
  {
    name: "Premier Partners",
    blurb:
      "Strategic collaborations that power club-wide initiatives and long-term player development.",
    partners: [
      {
        name: "Nordic Energy",
        description:
          "Sustainable power solutions keeping the lights on across our facilities.",
        url: "https://example.com/nordic-energy",
      },
      {
        name: "Oslo Sports Council",
        description:
          "Key municipal supporter investing in youth sport participation.",
        url: "https://example.com/oslo-sports",
      },
    ],
  },
  {
    name: "Elite Sponsors",
    blurb:
      "Brands standing on the sideline with our Senior Elite and Junior programs every match day.",
    partners: [
      {
        name: "Viking Logistics",
        description:
          "Official travel partner ensuring teams and equipment reach every fixture on time.",
        url: "https://example.com/viking-logistics",
      },
      {
        name: "Stronghold Fitness",
        description:
          "High-performance strength & conditioning support for athletes at all levels.",
        url: "https://example.com/stronghold",
      },
      {
        name: "Northern Brew",
        description:
          "Match-day hospitality provider bringing fans together in the stands.",
        url: "https://example.com/northern-brew",
      },
    ],
  },
  {
    name: "Community Champions",
    blurb:
      "Local businesses and families backing grassroots growth, scholarship funds, and equipment drives.",
    partners: [
      {
        name: "Frogner Hardware",
        description:
          "Neighborhood supplier donating materials for field upkeep and improvements.",
        url: "https://example.com/frogner-hardware",
      },
      {
        name: "Oslo Vikings Booster Club",
        description:
          "Volunteers and alumni raising resources and rallying support every season.",
        url: "/about/boosters",
      },
      {
        name: "Community Backers",
        description:
          "Hundreds of individual donors whose recurring gifts keep programs accessible.",
        url: "/about/boosters",
      },
    ],
  },
];

const partnershipPillars = [
  {
    title: "Brand Visibility",
    description:
      "National and international exposure through game broadcasts, social storytelling, and marquee events.",
    icon: Award,
  },
  {
    title: "Performance Impact",
    description:
      "Direct investment in coaching, equipment, facilities, and sports science elevating athlete development.",
    icon: TrendingUp,
  },
  {
    title: "Community Engagement",
    description:
      "Connect with a loyal fanbase, youth families, and a growing American football audience in Norway.",
    icon: Users,
  },
  {
    title: "Purposeful Partnership",
    description:
      "Align with a mission-driven club advancing inclusivity, education, and positive role models for youth.",
    icon: HeartHandshake,
  },
];

export default function PartnersPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white dark:bg-viking-charcoal/80 transition-colors">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 bg-black/65" aria-hidden />
          <div className="relative mx-auto flex min-h-[40vh] max-w-5xl flex-col items-center justify-center px-4 py-4 text-center sm:px-6 lg:px-8">
            <p className="text-lg font-semibold uppercase tracking-[0.4em] text-viking-red">
              Partners & Sponsors
            </p>
            <h1 className="mt-4 font-Anton_SC text-4xl font-bold text-viking-charcoal sm:text-5xl">
              Fueling Oslo Vikings Together
            </h1>
            <p className="mt-6 max-w-3xl text-base text-viking-charcoal sm:text-lg">
              Partnerships enable us to compete at the highest level, invest in
              future athletes, and create unforgettable gameday experiences.
              Thank you for standing with the shield.
            </p>
          </div>
        </section>

        <section className="bg-white dark:bg-viking-charcoal/90">
          <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-viking-charcoal dark:text-gray-100">
              Partnership Pillars
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-gray-700 dark:text-gray-300">
              Every agreement is tailored, but the foundation is always the
              same: shared ambition, measurable value, and impact across the
              club.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              {partnershipPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-viking-charcoal/70"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-viking-red/90">
                    <pillar.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-viking-charcoal dark:text-gray-100">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 dark:bg-viking-charcoal/70">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-viking-charcoal dark:text-gray-100">
              Partners in the Huddle
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-gray-700 dark:text-gray-300">
              We proudly collaborate with organisations that believe in
              sport-driven growth, equity, and excellence.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">
              {partnerTiers.map((tier) => (
                <div
                  key={tier.name}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-white/10 dark:bg-viking-charcoal/80"
                >
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-viking-charcoal dark:text-gray-100">
                      {tier.name}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {tier.blurb}
                    </p>
                  </div>
                  <ul className="mt-4 space-y-4">
                    {tier.partners.map((partner) => (
                      <li
                        key={partner.name}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5"
                      >
                        <Link
                          href={partner.url}
                          className="text-lg font-semibold text-viking-red underline decoration-2 underline-offset-4 hover:text-viking-red/80"
                        >
                          {partner.name}
                        </Link>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {partner.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-viking-charcoal/90">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-viking-charcoal dark:text-gray-100">
              Become a Partner
            </h2>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              Whether you represent a global brand or a local business, we can
              craft an activation package that meets your goals. Let’s map out
              how you can join the next chapter of Vikings football.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-viking-red hover:bg-viking-red-dark text-white"
              >
                <Link href="mailto:partnerships@oslovikings.com">
                  Schedule a Call
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-gray-100 text-viking-charcoal hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                <Link href="/about/antidoping">View Club Standards</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
