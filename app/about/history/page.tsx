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

type HallOfFameMember = {
  name: string;
  imageSrc?: string;
  imageAlt?: string;
  caption?: string;
};

const hallOfFameMembers: HallOfFameMember[] = [
  {
    name: "Henrik Dahl",
    imageSrc: "/images/oldSchool/HOF-Dahl.png",
    imageAlt: "",
    caption:
      "Coach Henrik Dahl helped lay the foundation for Vikings football and a culture of excellence.",
  },
  {
    name: "Finn-Jarle Mathisen",
    imageSrc: "/images/oldSchool/HOF-FJ.png",
    imageAlt: "",
    caption:
      "Coach Finn-Jarle Mathisen, one of the founding fathers, championed discipline and belief.",
  },
  {
    name: "Nicolay Aslaksen",
    imageSrc: "/images/oldSchool/HOF-Aslaksen.png",
    imageAlt: "",
    caption:
      "Nicolay Aslaksen running wild and inspiring a new era of Vikings athletes.",
  },
  {
    name: "Gaute Moseby Engebretsen",
    imageSrc: "/images/oldSchool/HOF-Gaute.png",
    caption:
      "Gaute Moseby Engebretsen embodied Vikings spirit on and off the field as a tireless leader.",
  },
];

const hallOfFameGallery = [
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

        <section className="bg-white dark:bg-viking-charcoal/70">
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

            <div className="mx-auto max-w-5xl">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                {hallOfFameMembers.map((member) => (
                  <article
                    key={member.name}
                    className="flex flex-col items-center rounded-[36px] border border-black/10 bg-gradient-to-b from-white via-slate-100 to-slate-200 p-6 text-center shadow-[0_20px_50px_rgba(15,23,42,0.15)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.22)] dark:border-white/10 dark:bg-gradient-to-b dark:from-[#171B21] dark:via-[#12161C] dark:to-[#0C1015] dark:shadow-[0_18px_40px_rgba(8,11,17,0.45)] dark:hover:shadow-[0_24px_55px_rgba(8,11,17,0.6)]"
                  >
                    <div className="relative w-full overflow-hidden rounded-[28px] bg-slate-200 shadow-inner dark:bg-[#11161d]">
                      {member.imageSrc ? (
                        <>
                          <div className="relative h-56 w-full">
                            <Image
                              src={member.imageSrc}
                              alt={member.imageAlt ?? member.name}
                              fill
                              className="object-cover object-center saturate-0 dark:opacity-95"
                              sizes="(max-width: 768px) 100vw, 320px"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-viking-red/60 via-viking-red/15 to-white/25 dark:from-viking-red/28 dark:via-viking-red/12 dark:to-white/12" />
                        </>
                      ) : (
                        <div className="flex h-56 w-full items-center justify-center bg-gradient-to-br from-slate-200 via-white to-slate-300 dark:from-[#1D2128] dark:via-[#13171E] dark:to-[#0B0E12]">
                          <span className="text-5xl font-black tracking-[0.35em] text-viking-red">
                            {getInitials(member.name)}
                          </span>
                        </div>
                      )}
                      <div
                        className="absolute inset-0 rounded-[28px] ring-1 ring-white/40 dark:ring-white/5"
                        aria-hidden
                      />
                    </div>
                    <div className="mt-6 w-full rounded-full border border-black/10 bg-gradient-to-b from-white via-slate-50 to-slate-200 px-6 py-3 text-center shadow-[inset_2px_2px_6px_rgba(255,255,255,0.9),inset_-3px_-3px_8px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-gradient-to-b dark:from-[#141820] dark:via-[#12161d] dark:to-[#0C0F13] dark:shadow-[inset_1px_1px_3px_rgba(255,255,255,0.08),inset_-2px_-2px_5px_rgba(0,0,0,0.6)]">
                      <span className="text-[0.75rem] font-semibold uppercase tracking-[0.5em] text-slate-700 dark:text-gray-100">
                        {member.name.toUpperCase()}
                      </span>
                    </div>
                    {member.caption && (
                      <p className="mt-4 max-w-xs text-sm text-gray-600 dark:text-gray-300">
                        {member.caption}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
              {hallOfFameGallery.map((photo) => (
                <figure
                  key={photo.src}
                  className="overflow-hidden rounded-2xl bg-gray-900/5 shadow-lg ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10"
                >
                  <div className="relative h-80 w-full flex items-center justify-center bg-slate-200 dark:bg-[#11161d]">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={800}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="h-full w-full object-contain"
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
