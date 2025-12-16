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
    year: "1997",
    event: "Expansion",
    description: "Club expands; win Spring Bowl II; debut in Eurocup.",
  },
  {
    year: "1998",
    event: "Eurocup participant",
    description: "Vikings take on Europe's best teams",
  },
  {
    year: "1999",
    event: "Dynasty Begins",
    description: "Undefeated champions; Eurocup finalists; ranked #6 in Europe",
  },
  {
    year: "2000",
    event: "Three-Peat",
    description: "Three-peat title; first Eurobowl appearance.",
  },
  {
    year: "2001",
    event: "Finals Loss",
    description:
      "Lose finals to Eidsvoll; Viqueens win first cheer championship.",
  },
  {
    year: "2002",
    event: "7th Title",
    description: "Vikings win 7th title, beating Trolls 24–21.",
  },
  {
    year: "2003",
    event: "Shift",
    description: "Seniors miss finals; juniors win Norwegian Championship.",
  },
  {
    year: "2004",
    event: "Missed Finals",
    description: "Miss finals again; Viqueens win Moskva Cup.",
  },
  {
    year: "2005",
    event: "Setback",
    description: "Third straight year missing the championship.",
  },
  {
    year: "2006",
    event: "Return",
    description: "Val Gunn returns; Vikings reach finals; join 2007 EFAF Cup.",
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
  "Gaute Moseby Engebretsen",
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
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-viking-charcoal dark:text-gray-100 mb-8 text-center">
              Key Milestones
            </h2>
            <JourneyTimeline milestones={milestones} />
          </div>
        </section>
        <section className="bg-white dark:bg-viking-charcoal/90">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 text-center">
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
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
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
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
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
              <ul className="flex flex-wrap justify-center gap-5 rounded-3xl bg-gradient-to-br from-slate-200 via-gray-200 to-slate-300 p-6 shadow-2xl ring-1 ring-white/40 dark:from-[#1E232B] dark:via-[#151921] dark:to-[#101419] dark:ring-white/10">
                {hallOfFameNames.map((name) => (
                  <li
                    key={name}
                    className="inline-flex items-center rounded-full border border-black/10 bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300 px-6 py-3 text-base font-semibold uppercase tracking-[0.35em] text-slate-700 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.75),inset_-2px_-2px_6px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[inset_1px_1px_3px_rgba(255,255,255,0.9),inset_-1px_-1px_5px_rgba(0,0,0,0.35)] dark:border-white/10 dark:bg-gradient-to-br dark:from-[#171B21] dark:via-[#101418] dark:to-[#0B0E12] dark:text-gray-200 dark:shadow-[inset_2px_2px_4px_rgba(255,255,255,0.06),inset_-3px_-3px_6px_rgba(0,0,0,0.65)] dark:hover:shadow-[inset_1px_1px_3px_rgba(255,255,255,0.12),inset_-1px_-1px_4px_rgba(0,0,0,0.7)]"
                  >
                    <span
                      className="whitespace-nowrap text-sm sm:text-base"
                      style={{
                        textShadow:
                          "1px 1px 1px rgba(255,255,255,0.7), -1px -1px 1px rgba(0,0,0,0.35)",
                        letterSpacing: "0.4em",
                      }}
                    >
                      {name.toUpperCase()}
                    </span>
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

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (!parts.length) {
    return "OV";
  }
  const first = parts[0]?.[0] ?? "";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  const initials = `${first}${second}`.toUpperCase();
  return initials || "OV";
}
