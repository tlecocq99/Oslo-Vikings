import { fetchSheetRows } from "./googleSheets";
import type { StaffMember } from "@/app/types/staff";
import type { TeamInfo } from "@/app/team/team-config";

const DEFAULT_STAFF_SHEET =
  process.env.GOOGLE_STAFF_SHEET ?? "Coaching Staff & Board";
const DEFAULT_STAFF_RANGE = process.env.GOOGLE_STAFF_RANGE ?? "A1:H200";

const HEADER_KEYS = {
  name: ["name", "full name", "coach", "staff"],
  role: ["role", "position", "title", "job"],
  email: ["email", "mail", "e-mail"],
  phone: ["phone", "mobile", "cell", "contact", "tel", "telephone"],
  image: ["image", "photo", "headshot", "picture", "avatar"],
  imageAlt: ["imagealt", "imgalt", "alt", "image description"],
  teams: ["teams", "team", "program", "squad", "unit", "group"],
} as const;

function normaliseHeader(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function normaliseTeamToken(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const UNIVERSAL_TEAM_TOKENS = new Set(
  ["all", "all teams", "club", "organisation", "organization", "board"].map(
    (token) => normaliseTeamToken(token)
  )
);

function buildHeaderIndex(headers: string[]): Map<string, number> {
  const map = new Map<string, number>();
  headers.forEach((header, index) => {
    const normalised = normaliseHeader(header);
    if (normalised) {
      map.set(normalised, index);
    }
  });
  return map;
}

function pickValue(
  row: string[],
  headerMap: Map<string, number>,
  keys: readonly string[]
): string {
  for (const key of keys) {
    const lookup = normaliseHeader(key);
    const index = headerMap.get(lookup);
    if (index !== undefined) {
      const value = row[index];
      if (value !== undefined && value.trim() !== "") {
        return value.trim();
      }
    }
  }
  return "";
}

function parseTeamTokens(raw: string): string[] {
  if (!raw) return [];
  const normalised = raw.replace(/\band\b/gi, ",");
  return normalised
    .split(/[,/\n;]/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function rowIsEmpty(row: string[]): boolean {
  return row.every((cell) => cell.trim() === "");
}

interface ParseStaffOptions {
  fallbackTeam?: TeamInfo;
  idPrefix?: string;
}

function buildFallbackTeamTokens(team: TeamInfo): string[] {
  const tokens = new Set<string>();
  [
    team.slug,
    team.name,
    team.sheetTab,
    team.shortName,
    `Oslo Vikings ${team.name}`,
  ]
    .filter(Boolean)
    .forEach((value) => {
      const token = String(value).trim();
      if (token) {
        tokens.add(token);
      }
    });
  return Array.from(tokens);
}

function parseStaffRows(
  rows: (string | undefined | null)[][],
  options: ParseStaffOptions = {}
): StaffMember[] {
  if (!rows.length) return [];

  const [rawHeader = [], ...dataRows] = rows;
  const header = rawHeader.map((value) => (value ?? "").toString().trim());
  const headerMap = buildHeaderIndex(header);
  const hasTeamsColumn = HEADER_KEYS.teams.some((key) =>
    headerMap.has(normaliseHeader(key))
  );

  const fallbackTeams = options.fallbackTeam
    ? buildFallbackTeamTokens(options.fallbackTeam)
    : [];
  const idPrefix = options.idPrefix ?? "staff";

  const staffMembers: StaffMember[] = [];

  dataRows.forEach((raw, index) => {
    const row = raw.map((value) => (value ?? "").toString().trim());
    if (rowIsEmpty(row)) return;

    const name = pickValue(row, headerMap, HEADER_KEYS.name);
    if (!name) return;

    const role = pickValue(row, headerMap, HEADER_KEYS.role);
    const email = pickValue(row, headerMap, HEADER_KEYS.email) || undefined;
    const phone = pickValue(row, headerMap, HEADER_KEYS.phone) || undefined;
    const image = pickValue(row, headerMap, HEADER_KEYS.image) || undefined;
    const imageAltRaw =
      pickValue(row, headerMap, HEADER_KEYS.imageAlt) || undefined;

    const teamsRaw = hasTeamsColumn
      ? pickValue(row, headerMap, HEADER_KEYS.teams)
      : "";

    const teams = (
      hasTeamsColumn && teamsRaw
        ? parseTeamTokens(teamsRaw)
        : [...fallbackTeams]
    ).filter(Boolean);

    if (!teams.length && fallbackTeams.length) {
      teams.push(...fallbackTeams);
    }

    if (!teams.length) {
      return;
    }

    staffMembers.push({
      id: `${idPrefix}-${index + 1}`,
      name,
      role: role || "Coach",
      email,
      phone,
      image,
      imageAlt: imageAltRaw ?? (image ? `${name} headshot` : undefined),
      teams,
    });
  });

  return staffMembers;
}

export async function fetchStaff(
  sheet: string = DEFAULT_STAFF_SHEET,
  range: string = DEFAULT_STAFF_RANGE
): Promise<StaffMember[]> {
  const rows = await fetchSheetRows(sheet, range);
  return parseStaffRows(rows, { idPrefix: "staff" });
}

function staffMatchesTeam(staff: StaffMember, team: TeamInfo): boolean {
  if (staff.teams.length === 0) {
    return false;
  }

  const staffTokens = staff.teams.map(normaliseTeamToken);
  if (staffTokens.some((token) => UNIVERSAL_TEAM_TOKENS.has(token))) {
    return true;
  }

  const teamAliases = new Set<string>();
  [
    team.name,
    team.sheetTab,
    team.slug,
    team.shortName,
    `oslo vikings ${team.name}`,
  ]
    .filter(Boolean)
    .forEach((value) => {
      teamAliases.add(normaliseTeamToken(String(value)));
    });

  return staffTokens.some((token) => teamAliases.has(token));
}

export async function fetchStaffForTeam(
  team: TeamInfo
): Promise<StaffMember[]> {
  if (team.staffRange) {
    const rows = await fetchSheetRows(DEFAULT_STAFF_SHEET, team.staffRange);
    return parseStaffRows(rows, {
      fallbackTeam: team,
      idPrefix: `staff-${team.slug}`,
    });
  }

  const staff = await fetchStaff();
  return staff.filter((member) => staffMatchesTeam(member, team));
}
