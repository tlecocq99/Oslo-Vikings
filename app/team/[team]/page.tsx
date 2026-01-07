import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import RosterSwitcher from "@/app/components/RosterSwitcher";
import { TeamStaffSection } from "@/app/components/TeamStaffSection";
import { TeamRecruitsSection } from "@/app/components/TeamRecruitsSection";
import { TeamScheduleSection } from "@/app/components/TeamScheduleSection";
import TeamTableOfContents, {
  type TeamTableOfContentsItem,
} from "@/app/components/TeamTableOfContents";
import { fetchRoster } from "@/app/services/fetchRoster";
import { fetchSeniorRecruits } from "@/app/services/fetchRecruits";
import { fetchSchedule } from "@/app/services/fetchSchedule";
import { fetchStaffForTeam } from "@/app/services/fetchStaff";
import Image from "next/image";
import Link from "next/link";
import { getTeamBySlug, TEAM_CONFIG, type TeamSlug } from "../team-config";
import type { StaffMember } from "@/app/types/staff";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getImageLoaderProps } from "@/lib/imageLoader";

export const revalidate = 300;

const STAFF_FALLBACK_HEADSHOT = "/images/players/playerFiller.png";
const FLAG_CONTACT_FALLBACK: StaffMember = {
  id: "flag-contact-fallback",
  name: "Even Flom-Grundstrøm",
  role: "Team Manager",
  email: "evenflomgrundstrom@gmail.com",
  teams: ["flag-football"],
};

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
  const recruitsAnchorId = "team-recruits";
  const scheduleAnchorId = "team-schedule";

  if (!team) {
    notFound();
  }

  const teamName = team.name;
  const shouldShowRecruits = team.slug === "senior-elite";
  const isUnderConstruction = team.slug === "flag-football";

  if (isUnderConstruction) {
    const staff = await fetchStaffForTeam(team);
    const primaryContact = selectPrimaryContact(staff) ?? FLAG_CONTACT_FALLBACK;

    return (
      <>
        <Navigation />
        <main className="min-h-screen">
          <section className="flex min-h-[60vh] items-center py-24">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center sm:px-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-viking-red/15 px-4 py-1 text-sm font-semibold uppercase tracking-[0.45em] text-viking-red">
                Flag Football
              </span>
              <h2 className="text-3xl font-bold text-viking-charcoal dark:text-white sm:text-4xl">
                This page is under construction
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-300 sm:text-lg">
                We&apos;re working on bringing you updated rosters, schedules,
                and coaching staff details for the Oslo Vikings Flag Football
                program. Check back soon or reach out to our club leadership for
                the latest information.
              </p>
              <div className="w-full max-w-2xl text-left">
                <p className="mb-3 text-xs uppercase tracking-[0.35em] text-viking-red">
                  Flag football contact
                </p>
                <FlagStaffContactCard member={primaryContact} />
              </div>
              <div className="flex justify-center">
                <Link
                  href="/team"
                  className="inline-flex items-center justify-center rounded-full border border-viking-red/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-viking-red transition-colors hover:border-viking-red hover:text-viking-red-dark dark:border-white/30 dark:text-white dark:hover:border-white/60"
                >
                  View other teams
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const tableOfContents: TeamTableOfContentsItem[] = [
    { id: staffAnchorId, label: "Staff" },
    { id: rosterAnchorId, label: "Roster" },
  ];

  if (shouldShowRecruits) {
    tableOfContents.push({ id: recruitsAnchorId, label: "Recruits" });
  }

  tableOfContents.push({ id: scheduleAnchorId, label: "Schedule" });

  const recruitsPromise = shouldShowRecruits
    ? fetchSeniorRecruits()
    : Promise.resolve<Awaited<ReturnType<typeof fetchSeniorRecruits>>>([]);

  const [players, schedule, staff, recruits] = await Promise.all([
    fetchRoster(team.sheetTab),
    fetchSchedule(team.sheetTab),
    fetchStaffForTeam(team),
    recruitsPromise,
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
        <TeamTableOfContents items={tableOfContents} pinAfterId="team-hero" />
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
          {shouldShowRecruits && (
            <TeamRecruitsSection
              teamName={teamName}
              recruits={recruits}
              anchorId={recruitsAnchorId}
            />
          )}
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
  const desktopLoaderProps = getImageLoaderProps(desktopImage);
  const mobileLoaderProps = getImageLoaderProps(mobileImage);

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
              {...mobileLoaderProps}
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
              {...desktopLoaderProps}
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
            {...desktopLoaderProps}
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

function selectPrimaryContact(staff: StaffMember[]): StaffMember | null {
  if (!staff.length) {
    return null;
  }

  const preferredMatches = staff.filter((member) => {
    const role = member.role.toLowerCase();
    return /flag/.test(role) || /head/.test(role) || /coach/.test(role);
  });

  const candidates = preferredMatches.length ? preferredMatches : staff;
  const withDirectContact = candidates.filter(
    (member) => member.email || member.phone
  );

  return withDirectContact[0] ?? candidates[0] ?? null;
}

function FlagStaffContactCard({ member }: { member: StaffMember }) {
  const initials = getInitials(member.name);
  const imageSrc = member.image?.trim()
    ? member.image
    : STAFF_FALLBACK_HEADSHOT;
  const altText = member.imageAlt
    ? member.imageAlt
    : member.image
    ? `${member.name} headshot`
    : `${initials || member.name || "Oslo Vikings"} placeholder portrait`;

  return (
    <article className="rounded-2xl border border-gray-200/60 dark:border-gray-800/80 bg-white/95 dark:bg-viking-charcoal/60 shadow-sm">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6">
        <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full shadow-lg sm:mx-0 sm:h-28 sm:w-28">
          <Image
            src={imageSrc}
            alt={altText}
            fill
            sizes="112px"
            className="object-cover"
            {...getImageLoaderProps(imageSrc)}
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-viking-charcoal dark:text-white">
            {member.name}
          </h3>
          <p className="mt-1 text-[0.7rem] uppercase tracking-[0.3em] text-viking-red/80 dark:text-viking-red/80">
            {member.role}
          </p>
          {(member.email || member.phone) && (
            <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
              {member.email ? (
                <p>
                  <a
                    href={`mailto:${member.email}`}
                    className="underline-offset-4 hover:text-viking-red hover:underline dark:hover:text-viking-red"
                  >
                    {member.email}
                  </a>
                </p>
              ) : null}
              {member.phone ? (
                <p>
                  <a
                    href={`tel:${member.phone}`}
                    className="hover:text-viking-red dark:hover:text-viking-red"
                  >
                    {member.phone}
                  </a>
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function getInitials(name: string): string {
  const sanitized = name.replace(/\s+/g, " ").trim();
  if (!sanitized) {
    return "OV";
  }

  const parts = sanitized.split(" ").filter(Boolean);
  const [first = "", second = ""] = parts;
  const initials = `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();

  return initials || "OV";
}
