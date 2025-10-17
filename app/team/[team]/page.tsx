import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import RosterSwitcher from "@/app/components/RosterSwitcher";
import { fetchRoster } from "@/app/services/fetchRoster";
import { getTeamBySlug, TEAM_CONFIG, type TeamSlug } from "../team-config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 300;

interface TeamPageParams {
  team: string;
}

type TeamPageProps = {
  params: Promise<TeamPageParams>;
};

export function generateStaticParams(): { team: TeamSlug }[] {
  return Object.keys(TEAM_CONFIG).map((slug) => ({ team: slug as TeamSlug }));
}

export async function generateMetadata({
  params,
}: TeamPageProps): Promise<Metadata> {
  const { team: teamSlug } = await params;
  const team = getTeamBySlug(teamSlug);
  if (!team) {
    return {};
  }

  const title = `${team.name} | Oslo Vikings`;
  const description = team.heroTagline ?? team.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  } satisfies Metadata;
}

export default async function TeamDetailPage({ params }: TeamPageProps) {
  const { team: teamSlug } = await params;
  const team = getTeamBySlug(teamSlug);

  if (!team) {
    notFound();
  }

  const players = await fetchRoster(team.sheetTab);
  const rosters = { [team.name]: players } as const;

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <TeamHero
          title={team.name}
          description={team.description}
          backgroundImage={team.heroImage}
          tagline={team.heroTagline}
        />
        <RosterSwitcher rosters={rosters} />
      </main>
      <Footer />
    </>
  );
}

function TeamHero({
  title,
  description,
  backgroundImage,
  tagline,
}: {
  title: string;
  description: string;
  backgroundImage?: string;
  tagline?: string;
}) {
  const imageUrl = backgroundImage ?? "/images/backgrounds/teamClose.avif";
  const subheading = tagline ?? "Oslo Vikings Football";

  return (
    <section
      className="py-20 md:py-24 bg-cover bg-center bg-no-repeat relative min-h-[50vh] md:min-h-[60vh] flex items-center"
      style={{ backgroundImage: `url('${imageUrl}')` }}
    >
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm uppercase tracking-[0.5em] text-viking-gold mb-4">
          {subheading}
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl leading-tight">
          {title}
        </h1>
        <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto drop-shadow-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
