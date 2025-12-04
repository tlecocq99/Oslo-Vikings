import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { JourneyTimeline } from "../../components/JourneyTimeline";
import { Trophy, Globe2, Users, Flame } from "lucide-react";
import Image from "next/image";

const milestones = [
  {
    year: "1986",
    event: "Oslo Vikings Founded",
    description: "Team established with 20 founding members",
  },
  {
    year: "1989",
    event: "Junior Programs",
    description: "First junior program introduced",
  },
  {
    year: "1990",
    event: "First Championship",
    description: "Vikings win their first NM Championship title",
  },
  {
    year: "1994",
    event: "First International Competition",
    description: "First Norwegian team to compete internationally",
  },
  {
    year: "1998",
    event: "Eurocup participant",
    description: "Vikings take on Europe's best teams",
  },
  {
    year: "1999",
    event: "Dynasty Begins",
    description: "6th ranked club in Europe",
  },
  {
    year: "2023",
    event: "Consistency Established",
    description: "15th NM championship title won",
  },
  {
    year: "2024",
    event: "Crossing Borders",
    description: "Elite team joins Swedish Superseries for a two season quest",
  },
  {
    year: "2026",
    event: "Future",
    description: "What Next?",
  },
];

const legacyHighlights = [
  {
    title: "Championship Pedigree",
    description:
      "15 NM championships and counting, powered by relentless preparation and a culture of accountability.",
    icon: Trophy,
  },
  {
    title: "International Footprint",
    description:
      "Regular competition abroad sharpens our edge and showcases Norwegian football across Europe.",
    icon: Globe2,
  },
  {
    title: "Community Built",
    description:
      "From youth academies to alumni leadership, the club is sustained by generations of volunteers and families.",
    icon: Users,
  },
  {
    title: "Future Focused",
    description:
      "We invest in coaching, sports science, and player welfare to keep the Vikings blazing a trail forward.",
    icon: Flame,
  },
];

const hallOfFameNames = [
  "Henrik Dahl",
  "Finn-Jarle Mathisen",
  "Nicolay Aslaksen",
];

const hallOfFamePhotos = [
  {
    src: "/images/oldSchool/Coaches-Trophy.jpg",
    alt: "Oslo Vikings coaches celebrate with a trophy",
    caption:
      "Coach Finn-Jarle Mathisen and Coach Henrik Dahl. Two of The Founding Fathers!",
  },
  {
    src: "/images/oldSchool/Nicolay-Aslaksen.jpg",
    alt: "Historic team portrait featuring Nicolay Aslaksen",
    caption: "Nicolay Aslaksen running wild!",
  },
];

export default function HistoryPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white dark:bg-viking-charcoal/80 transition-colors">
        <section className="relative isolate overflow-hidden bg-[url('/images/backgrounds/history-bg.jpg')] bg-cover bg-center">
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"
            aria-hidden
          />
          <div className="relative mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-viking-red">
              Our Story
            </p>
            <h1 className="mt-4 font-Anton_SC text-4xl font-bold text-white sm:text-5xl">
              Decades of Viking Football
            </h1>
            <p className="mt-6 max-w-3xl text-base text-gray-200 sm:text-lg">
              From grassroots beginnings to national powerhouse, the Oslo
              Vikings have spent four decades shaping American football in
              Norway. Explore the milestones, cultures, and people that forged
              the shield we wear today.
            </p>
          </div>
        </section>

        <section className="bg-white dark:bg-viking-charcoal/90">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-viking-charcoal dark:text-gray-100 mb-8 text-center">
              Key Milestones
            </h2>
            <JourneyTimeline milestones={milestones} />
          </div>
        </section>
        <section className="bg-white dark:bg-viking-charcoal/90">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-viking-charcoal dark:text-gray-100">
              Share Your Viking Story
            </h2>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              Alumni, coaches, parents, and fans have all shaped our path. We’d
              love to hear your memories. Reach out to{" "}
              <a
                className="font-semibold text-viking-red underline decoration-2 underline-offset-4"
                href="mailto:marketing@oslovikings.com"
              >
                marketing@oslovikings.com
              </a>{" "}
              with photos, stories, and milestones we should add to the
              timeline.
            </p>
          </div>
        </section>
        <section className="bg-gray-50 dark:bg-viking-charcoal/70">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-viking-charcoal dark:text-gray-100">
                Legacy Highlights
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                Sustained success stems from our commitment to development on
                and off the field.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {legacyHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-viking-charcoal/80"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-viking-red/90">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-viking-charcoal dark:text-gray-100">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-viking-charcoal/85">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.4em] text-viking-red">
                Honors
              </p>
              <h2 className="mt-2 text-3xl font-bold text-viking-charcoal dark:text-gray-100">
                VIKINGS’ MEMBERS OF THE NOAFF – HALL OF FAME
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Celebrating the pioneers whose dedication and excellence earned
                them a place among Norway’s football greats.
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <ul className="grid gap-4 rounded-2xl bg-gray-50 p-6 text-center text-lg font-semibold text-viking-charcoal shadow-md dark:bg-viking-charcoal/60 dark:text-gray-100">
                {hallOfFameNames.map((name) => (
                  <li key={name} className="py-1">
                    {name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
              {hallOfFamePhotos.map((photo) => (
                <figure
                  key={photo.src}
                  className="overflow-hidden rounded-2xl bg-gray-900/5 shadow-lg ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10"
                >
                  <div className="relative h-80 w-full">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-[center_30%]"
                    />
                  </div>
                  <figcaption className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    {photo.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
