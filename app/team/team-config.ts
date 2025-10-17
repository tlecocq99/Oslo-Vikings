export type TeamSlug =
  | "senior-elite"
  | "senior-d2"
  | "u17"
  | "u14"
  | "flag-football";

export interface TeamInfo {
  slug: TeamSlug;
  name: string;
  sheetTab: string;
  shortName?: string;
  description: string;
  heroImage?: string;
  heroTagline?: string;
}

const DEFAULT_HERO_IMAGE = "/images/backgrounds/teamClose.avif";
const DEFAULT_TAGLINE = "Proudly representing the Oslo Vikings organization.";

export const TEAM_CONFIG: Record<TeamSlug, TeamInfo> = {
  "senior-elite": {
    slug: "senior-elite",
    name: "Senior Elite",
    sheetTab: "Senior Elite",
    description:
      "The top-tier Oslo Vikings squad competing for national championships in Norway.",
    heroImage: DEFAULT_HERO_IMAGE,
    heroTagline: "The flagship program of the Oslo Vikings.",
  },
  "senior-d2": {
    slug: "senior-d2",
    name: "Senior D2",
    sheetTab: "Senior D2",
    description:
      "Developing talent and providing competitive opportunities in Norway's Division 2 league.",
    heroImage: DEFAULT_HERO_IMAGE,
    heroTagline: DEFAULT_TAGLINE,
  },
  u17: {
    slug: "u17",
    name: "U17",
    sheetTab: "U17",
    description:
      "Elite youth program cultivating the next generation of Oslo Vikings standouts.",
    heroImage: DEFAULT_HERO_IMAGE,
    heroTagline: DEFAULT_TAGLINE,
  },
  u14: {
    slug: "u14",
    name: "U14",
    sheetTab: "U14",
    description:
      "Early development and fundamentals with a focus on fun, teamwork, and skill building.",
    heroImage: DEFAULT_HERO_IMAGE,
    heroTagline: DEFAULT_TAGLINE,
  },
  "flag-football": {
    slug: "flag-football",
    name: "Flag Football",
    sheetTab: "Flag",
    description:
      "Fast-paced flag football squads introducing players to the sport in a non-contact format.",
    heroImage: DEFAULT_HERO_IMAGE,
    heroTagline: DEFAULT_TAGLINE,
  },
};

export const ALL_TEAMS: TeamInfo[] = Object.values(TEAM_CONFIG);

export function getTeamBySlug(slug: string): TeamInfo | undefined {
  return TEAM_CONFIG[slug as TeamSlug];
}
