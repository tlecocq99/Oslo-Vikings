import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import RosterSwitcher from "@/app/components/RosterSwitcher";
import { TeamStaffSection } from "@/app/components/TeamStaffSection";
import { TeamScheduleSection } from "@/app/components/TeamScheduleSection";
import TeamTableOfContents, {
  type TeamTableOfContentsItem,
} from "@/app/components/TeamTableOfContents";
import { fetchRoster } from "@/app/services/fetchRoster";
import { fetchSchedule } from "@/app/services/fetchSchedule";
import { fetchStaffForTeam } from "@/app/services/fetchStaff";
import Image from "next/image";
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
  const staffAnchorId = "team-staff";
  const rosterAnchorId = "team-roster";
  const scheduleAnchorId = "team-schedule";

  if (!team) {
    notFound();
  }

  const teamName = team.name;
  const tableOfContents: TeamTableOfContentsItem[] = [
    { id: staffAnchorId, label: "Staff" },
    { id: rosterAnchorId, label: "Roster" },
    { id: scheduleAnchorId, label: "Schedule" },
  ];

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
          blurDataURL={team.heroBlurDataURL}
          tagline={team.heroTagline}
        />
        <TeamTableOfContents
          items={tableOfContents}
          pinAfterId="team-hero"
        />
        <div className="lg:pl-64">
          <TeamStaffSection
            teamName={teamName}
            staff={staff}
            anchorId={staffAnchorId}
          />
          <RosterSwitcher
            rosters={rosters}
            anchorId={rosterAnchorId}
            sections={tableOfContents}
          />
          <TeamScheduleSection
            teamName={teamName}
            schedule={schedule}
            anchorId={scheduleAnchorId}
          />
        </div>
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
  blurDataURL,
  tagline,
}: {
  title: string;
  description: string;
  backgroundImage?: string;
  backgroundImageMobile?: string;
  blurDataURL?: string;
  tagline?: string;
}) {
  const desktopImage = backgroundImage ?? "/images/backgrounds/teamClose.avif";
  const mobileImage = backgroundImageMobile ?? desktopImage;
  const subheading = tagline ?? "Oslo Vikings Football";
  const placeholder =
    blurDataURL ??
    "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%201%201'%3E%3Crect%20width='1'%20height='1'%20fill='%230b0e12'/%3E%3C/svg%3E";
  const hasDistinctMobileImage = desktopImage !== mobileImage;

  return (
    <section
      id="team-hero"
      className="relative w-full overflow-hidden bg-black aspect-[16/9] lg:aspect-auto lg:min-h-[60vh]"
    >
      <div className="pointer-events-none absolute inset-0 block h-full w-full">
        {hasDistinctMobileImage ? (
          <>
            <Image
              src={mobileImage}
              alt={`${title} background`}
              fill
              priority
              sizes="100vw"
              className="object-cover lg:hidden"
              placeholder="blur"
              blurDataURL={placeholder}
            />
            <Image
              src={desktopImage}
              alt={`${title} background`}
              fill
              priority
              sizes="100vw"
              className="hidden lg:block object-cover"
              placeholder="blur"
              blurDataURL={placeholder}
            />
          </>
        ) : (
          <Image
            src={desktopImage}
            alt={`${title} background`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={placeholder}
          />
        )}
      </div>
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
