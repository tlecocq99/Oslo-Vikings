import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Award, TrendingUp, Users, HeartHandshake } from "lucide-react";
import { partners } from "@/app/data/partners";

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
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-viking-charcoal dark:text-gray-100">
              Partners in the Huddle
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-gray-700 dark:text-gray-300">
              We proudly collaborate with organisations that believe in
              sport-driven growth, equity, and excellence.
            </p>
            <div className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[720px] divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:divide-white/10 dark:border-white/10 dark:bg-viking-charcoal/80">
                <thead className="bg-gray-100 text-left dark:bg-white/10">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                      Partner
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                      Description
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                      Site Link
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                  {partners.map((partner) => {
                    const isExternal = partner.website?.startsWith("http");

                    return (
                      <tr
                        key={partner.name}
                        className="bg-white transition-colors hover:bg-gray-50 dark:bg-viking-charcoal/70 dark:hover:bg-viking-charcoal/60"
                      >
                        <td className="px-4 py-4 align-top">
                          <div className="flex items-center gap-4">
                            {partner.logoSrc ? (
                              <div className="relative h-16 w-32 overflow-hidden rounded-md bg-white dark:bg-white/5">
                                <Image
                                  src={partner.logoSrc}
                                  alt={
                                    partner.logoAlt ?? `${partner.name} logo`
                                  }
                                  fill
                                  sizes="128px"
                                  className="object-contain object-center"
                                />
                              </div>
                            ) : null}
                            <span className="text-base font-semibold text-viking-charcoal dark:text-gray-100">
                              {partner.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top text-sm text-gray-600 dark:text-gray-200">
                          {partner.description}
                        </td>
                        <td className="px-4 py-4 align-top text-sm">
                          {partner.website ? (
                            <Link
                              href={partner.website}
                              target={isExternal ? "_blank" : undefined}
                              rel={isExternal ? "noreferrer" : undefined}
                              className="inline-flex items-center gap-2 font-semibold text-viking-red underline underline-offset-4 hover:text-viking-red/80"
                            >
                              Visit site
                              <span aria-hidden className="text-base">
                                ↗
                              </span>
                            </Link>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">
                              Contact for details
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-viking-charcoal/90">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 text-center">
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
