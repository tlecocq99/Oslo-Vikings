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
  heroImageMobile?: string;
  heroBlurDataURL?: string;
  heroTagline?: string;
  staffRange?: string;
}

const DEFAULT_HERO_IMAGE = "/images/backgrounds/teamClose.avif";
const eliteBanner = "/images/backgrounds/elite-banner.avif";
const eliteBannerMobile = "/images/backgrounds/elite-banner(16x9).avif";
const d2Banner = "/images/backgrounds/d2-banner.avif";
const d2BannerMobile = "/images/backgrounds/D2-banner(16x9).avif";
const u17Banner = "/images/backgrounds/u17-banner.avif";
const u17BannerMobile = "/images/backgrounds/u17-banner(16x9).avif";
const u14Banner = "/images/backgrounds/u14-banner.avif";
const u14BannerMobile = "/images/backgrounds/u14-banner(16x9).avif";
const flagBanner = "/images/backgrounds/flag-banner.png";
const flagBannerMobile = "/images/backgrounds/flag-banner(16x9).png";
const DEFAULT_TAGLINE = "Proudly representing the Oslo Vikings organization.";
const DEFAULT_BLUR_DATA_URL =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%201%201'%3E%3Crect%20width='1'%20height='1'%20fill='%230b0e12'/%3E%3C/svg%3E";

export const TEAM_CONFIG: Record<TeamSlug, TeamInfo> = {
  "senior-elite": {
    slug: "senior-elite",
    name: "Senior Elite",
    sheetTab: "Senior Elite",
    staffRange: "A28:D42",
    description:
      "The top-tier Oslo Vikings squad competing for national championships in Norway.",
    heroImage: eliteBanner,
    heroImageMobile: eliteBannerMobile,
    heroBlurDataURL: DEFAULT_BLUR_DATA_URL,
    heroTagline: "",
  },
  "senior-d2": {
    slug: "senior-d2",
    name: "Senior D2",
    sheetTab: "Senior D2",
    staffRange: "A45:D57",
    description:
      "Developing talent and providing competitive opportunities in Norway's Division 2 league.",
    heroImage: d2Banner,
    heroImageMobile: d2BannerMobile,
    heroBlurDataURL: DEFAULT_BLUR_DATA_URL,
    heroTagline: DEFAULT_TAGLINE,
  },
  u17: {
    slug: "u17",
    name: "U17",
    sheetTab: "U17",
    staffRange: "A60:D71",
    description:
      "Elite youth program cultivating the next generation of Oslo Vikings standouts.",
    heroImage: u17Banner,
    heroImageMobile: u17BannerMobile,
    heroBlurDataURL: DEFAULT_BLUR_DATA_URL,
    heroTagline: DEFAULT_TAGLINE,
  },
  u14: {
    slug: "u14",
    name: "U14",
    sheetTab: "U14",
    staffRange: "A74:D82",
    description:
      "Early development and fundamentals with a focus on fun, teamwork, and skill building.",
    heroImage: u14Banner,
    heroImageMobile: u14BannerMobile,
    heroBlurDataURL: DEFAULT_BLUR_DATA_URL,
    heroTagline: DEFAULT_TAGLINE,
  },
  "flag-football": {
    slug: "flag-football",
    name: "Flag Football",
    sheetTab: "Flag",
    staffRange: "A84:D90",
    description:
      "Fast-paced flag football squads introducing players to the sport in a non-contact format.",
    heroImage: DEFAULT_HERO_IMAGE,
    heroImageMobile: DEFAULT_HERO_IMAGE,
    heroBlurDataURL: DEFAULT_BLUR_DATA_URL,
    heroTagline: DEFAULT_TAGLINE,
  },
};

export const ALL_TEAMS: TeamInfo[] = Object.values(TEAM_CONFIG);

export function getTeamBySlug(slug: string): TeamInfo | undefined {
  return TEAM_CONFIG[slug as TeamSlug];
}
