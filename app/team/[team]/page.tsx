import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import RosterSwitcher from "@/app/components/RosterSwitcher";
import { TeamStaffSection } from "@/app/components/TeamStaffSection";
import { TeamScheduleSection } from "@/app/components/TeamScheduleSection";
import { Button } from "@/components/ui/button";
import { fetchRoster } from "@/app/services/fetchRoster";
import { fetchSchedule } from "@/app/services/fetchSchedule";
import { fetchStaffForTeam } from "@/app/services/fetchStaff";
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
  const description = team.heroTagline;

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
  const scheduleAnchorId = "team-schedule";

  if (!team) {
    notFound();
  }

  const teamName = team.name;

  const [players, schedule, staff] = await Promise.all([
    fetchRoster(team.sheetTab),
    fetchSchedule(team.sheetTab),
    fetchStaffForTeam(team),
  ]);
  const rosters = { [teamName]: players } as const;

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <TeamHero
          title={team.name}
          description={team.description}
          backgroundImage={team.heroImage}
          backgroundImageMobile={team.heroImageMobile}
          tagline={team.heroTagline}
        />
        <nav
          aria-label="Team shortcuts"
          className="bg-white/90 dark:bg-viking-charcoal/75 border-b border-gray-200/60 dark:border-gray-700/60"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-center">
            <Button
              asChild
              variant="secondary"
              className="uppercase tracking-wide font-semibold text-sm"
            >
              <a href={`#${scheduleAnchorId}`}>Jump to Schedule</a>
            </Button>
          </div>
        </nav>
        <TeamStaffSection teamName={teamName} staff={staff} />
        <RosterSwitcher rosters={rosters} />
        <TeamScheduleSection
          teamName={teamName}
          schedule={schedule}
          anchorId={scheduleAnchorId}
        />
      </main>
      <Footer />
    </>
  );
}

function TeamHero({
  title,
  description,
  backgroundImage,
  backgroundImageMobile,
  tagline,
}: {
  title: string;
  description: string;
  backgroundImage?: string;
  backgroundImageMobile?: string;
  tagline?: string;
}) {
  const desktopImage = backgroundImage ?? "/images/backgrounds/teamClose.avif";
  const mobileImage = backgroundImageMobile ?? desktopImage;
  const subheading = tagline ?? "Oslo Vikings Football";

  return (
    <section className="relative w-full overflow-hidden bg-black aspect-[16/9] lg:aspect-auto lg:min-h-[60vh]">
      <picture className="pointer-events-none absolute inset-0 block h-full w-full">
        <source media="(min-width: 1024px)" srcSet={desktopImage} />
        <img
          src={mobileImage}
          alt={`${title} background`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </picture>
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <h1 className="sr-only">{title}</h1>
        <span className="sr-only" aria-hidden={false}>
          {subheading}
        </span>
        <span className="sr-only" aria-hidden={false}>
          {description}
        </span>
      </div>
    </section>
  );
}
