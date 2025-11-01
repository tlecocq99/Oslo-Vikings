import { fetchSheetRows } from "./googleSheets";
import { SCHEDULE_RANGE } from "./fetchSchedule";
import type { UpcomingEvent } from "@/app/types/event";
import type { GameTeam } from "@/app/types/game";

const DEFAULT_EVENTS_TAB = process.env.GOOGLE_EVENTS_SHEET ?? "UpcomingEvents";
const DEFAULT_EVENTS_RANGE = process.env.GOOGLE_EVENTS_RANGE ?? "A1:K200";

const OSLO_TIMEZONE = "Europe/Oslo";
const DEFAULT_OSLO_OFFSET = "+01:00";

const OFFSET_ALIASES: Record<string, string> = {
  cet: "+01:00",
  cest: "+02:00",
  "gmt+1": "+01:00",
  "gmt+01": "+01:00",
  "gmt+2": "+02:00",
  "gmt+02": "+02:00",
  "utc+1": "+01:00",
  "utc+01": "+01:00",
  "utc+2": "+02:00",
  "utc+02": "+02:00",
  utc: "+00:00",
  gmt: "+00:00",
  z: "+00:00",
  "+1": "+01:00",
  "+01": "+01:00",
  "+0100": "+01:00",
  "1": "+01:00",
  "01": "+01:00",
  "+2": "+02:00",
  "+02": "+02:00",
  "+0200": "+02:00",
  "2": "+02:00",
  "02": "+02:00",
  "-1": "-01:00",
  "-01": "-01:00",
  "-0100": "-01:00",
  "-2": "-02:00",
  "-02": "-02:00",
  "-0200": "-02:00",
};

const OFFSET_HEADER_KEYS = [
  "offset",
  "utcoffset",
  "timezone",
  "tz",
  "utc",
  "gmt",
];
const END_OFFSET_HEADER_KEYS = [
  "endoffset",
  "utcoffsetend",
  "timezoneend",
  "offsetend",
  "endtz",
];

const TEAM_LOOKUP: Record<string, GameTeam | "All"> = {
  all: "All",
  main: "Main",
  elite: "Main",
  senior: "Main",
  "senior elite": "Main",
  d2: "D2",
  "division 2": "D2",
  u17: "U17",
  "under 17": "U17",
  u14: "U14",
  "under 14": "U14",
  flag: "flag",
  "flag football": "flag",
};

const TEAM_DEFAULT_HOME: Record<GameTeam, string> = {
  Main: "Oslo Vikings",
  D2: "Oslo Vikings D2",
  U17: "Oslo Vikings U17",
  U14: "Oslo Vikings U14",
  flag: "Oslo Vikings Flag",
};

const TEAM_DEFAULT_SPORT: Record<GameTeam, string> = {
  Main: "Football",
  D2: "Football",
  U17: "Football",
  U14: "Football",
  flag: "Flag Football",
};

const CONTACT_LOCATION_SLUGS: Record<string, string> = {
  "viking stadium": "stadium",
  "frogner stadium": "stadium",
  "frogner stadion": "stadium",
  stadium: "stadium",
  "middelthuns gate 26": "stadium",
  "viking stadium frogner stadium": "stadium",
  "club office": "office",
  office: "office",
  "head office": "office",
  "oslo vikings office": "office",
  "molleparken 4": "office",
  "wang gym": "gym",
  "wang sports gym": "gym",
  gym: "gym",
  "kronprinsens gate 5": "gym",
  "wang toppidrett": "gym",
  nih: "nih-field",
  "nih kunstgressbane": "nih-field",
  "sognsveien 220": "nih-field",
};

const LOCATION_BLOCKLIST = new Set(["gjovik", "gjoevik", "gjøvik"]);

function normaliseLocationKey(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function resolveContactLocationSlug(location: string): string | undefined {
  if (!location) return undefined;
  const base = normaliseLocationKey(location);
  const candidates = new Set<string>();
  if (base) {
    candidates.add(base);
  }
  const withoutParens = location.replace(/\([^)]*\)/g, "");
  const noParensKey = normaliseLocationKey(withoutParens);
  if (noParensKey) {
    candidates.add(noParensKey);
  }
  location.split(",").forEach((part) => {
    const key = normaliseLocationKey(part);
    if (key) {
      candidates.add(key);
    }
  });

  if (
    Array.from(candidates).some((candidate) =>
      LOCATION_BLOCKLIST.has(candidate)
    )
  ) {
    return undefined;
  }

  for (const candidate of Array.from(candidates)) {
    const slug = CONTACT_LOCATION_SLUGS[candidate];
    if (slug) return slug;
  }
  return undefined;
}

function createLocationHref(location: string | undefined): string | undefined {
  if (!location) return undefined;
  const slug = resolveContactLocationSlug(location);
  if (!slug) return undefined;
  return `/contact?location=${encodeURIComponent(slug)}#map`;
}

function formatTimestampInTimeZone(
  isoTimestamp: string,
  timeZone: string
): { date: string; time: string } {
  try {
    const date = new Date(isoTimestamp);
    if (Number.isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    const displayDate = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);

    const displayTime = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(date);

    return { date: displayDate, time: displayTime };
  } catch (error) {
    const fallbackDate = isoTimestamp.slice(0, 10);
    const fallbackTime = isoTimestamp.slice(11, 16);
    return { date: fallbackDate, time: fallbackTime };
  }
}

type ScheduleSource = {
  team: GameTeam;
  sheet: string;
};

const SCHEDULE_SOURCES: ScheduleSource[] = [
  { team: "Main", sheet: "Senior Elite" },
  { team: "D2", sheet: "Senior D2" },
  { team: "U17", sheet: "U17" },
  { team: "U14", sheet: "U14" },
  { team: "flag", sheet: "Flag" },
];

type HeaderMap = Map<string, number>;

type SheetRow = string[];

type SplitSheetRows = {
  header: SheetRow;
  dataRows: SheetRow[];
};

function normaliseHeader(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function buildHeaderMap(headers: string[]): HeaderMap {
  const map: HeaderMap = new Map();
  headers.forEach((header, index) => {
    const key = normaliseHeader(header);
    if (key) {
      map.set(key, index);
    }
  });
  return map;
}

function pickValue(
  row: SheetRow,
  headerMap: HeaderMap,
  keys: string[],
  fallbackIndex?: number
): string {
  for (const key of keys) {
    const idx = headerMap.get(key);
    if (idx !== undefined) {
      const value = row[idx];
      if (value !== undefined && value !== null) {
        const trimmed = String(value).trim();
        if (trimmed !== "") {
          return trimmed;
        }
      }
    }
  }
  if (
    fallbackIndex !== undefined &&
    fallbackIndex >= 0 &&
    fallbackIndex < row.length
  ) {
    const fallbackValue = row[fallbackIndex];
    if (fallbackValue !== undefined && fallbackValue !== null) {
      const trimmed = String(fallbackValue).trim();
      if (trimmed !== "") {
        return trimmed;
      }
    }
  }
  return "";
}

function splitHeaderAndData(rows: SheetRow[]): SplitSheetRows {
  const firstPopulatedIndex = rows.findIndex((row) =>
    row.some((cell) => (cell ?? "").toString().trim() !== "")
  );

  if (firstPopulatedIndex === -1) {
    return { header: [], dataRows: [] };
  }

  const header = rows[firstPopulatedIndex].map((cell) =>
    (cell ?? "").toString()
  );
  const dataRows = rows.slice(firstPopulatedIndex + 1);
  return { header, dataRows };
}

function rowIsBlank(row: SheetRow): boolean {
  return row.every((cell) => cell.trim() === "");
}

function rowMatchesHeader(row: SheetRow, header: SheetRow): boolean {
  return (
    row.length === header.length &&
    row.every((cell, index) => {
      const headerValue = header[index] ?? "";
      return cell !== "" && cell === headerValue;
    })
  );
}

function normaliseTeam(raw: string): GameTeam | "All" | string | undefined {
  if (!raw) return undefined;
  const key = raw.toLowerCase().trim();
  return TEAM_LOOKUP[key] ?? raw.trim();
}

function parseDateParts(
  value: string
): { year: number; month: number; day: number } | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (!Number.isNaN(Number(trimmed)) && trimmed.length <= 5) {
    const serial = Number(trimmed);
    const base = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(base.getTime() + serial * 86400000);
    return {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
    };
  }

  const isoParsed = Date.parse(trimmed);
  if (!Number.isNaN(isoParsed)) {
    const date = new Date(isoParsed);
    return {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
    };
  }

  const dateMatch = trimmed.match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{2,4})$/);
  if (dateMatch) {
    const [, dayStr, monthStr, yearStr] = dateMatch;
    const day = Number(dayStr);
    const month = Number(monthStr);
    const year = Number(yearStr.length === 2 ? `20${yearStr}` : yearStr);
    if (
      Number.isFinite(day) &&
      Number.isFinite(month) &&
      Number.isFinite(year)
    ) {
      return { year, month, day };
    }
  }

  return null;
}

function parseTimeParts(
  value: string
): { hour: number; minute: number } | null {
  if (!value) return null;
  let trimmed = value.trim();
  if (!trimmed) return null;

  // Normalise range separators and keep the first segment (start time)
  trimmed = trimmed.replace(/[–—]/g, "-");
  if (trimmed.includes("-")) {
    trimmed = trimmed.split("-")[0]?.trim() ?? trimmed;
  }

  // Remove surrounding parentheses content (e.g. "19:00 (CET)")
  trimmed = trimmed.replace(/\([^)]*\)$/, "").trim();

  // Capture meridiem before stripping trailing words
  const meridiemMatch = trimmed.match(/\b(am|pm)\b/i);
  const meridiem = meridiemMatch ? meridiemMatch[1].toLowerCase() : undefined;
  if (meridiem) {
    trimmed = trimmed.replace(/\b(am|pm)\b/gi, "").trim();
  }

  // Drop trailing timezone abbreviations or words (e.g. CET, CEST)
  trimmed = trimmed
    .replace(
      /\b(?:utc|gmt|cet|cest|bst|est|edt|pst|pdt|mez|mesz|hrs|hours?)\b$/i,
      ""
    )
    .trim();

  // Replace dots with colons (19.30 -> 19:30)
  trimmed = trimmed.replace(/\./g, ":");

  // Numeric formats like 1900 or 730
  const numeric = Number(trimmed);
  if (!Number.isNaN(numeric) && /^\d{1,4}$/.test(trimmed)) {
    const hour = Math.floor(numeric / 100);
    const minute = numeric % 100;
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      const adjusted = applyMeridiem(hour, minute, meridiem);
      if (adjusted) return adjusted;
    }
  }

  // Formats like HH:MM[:SS]
  const colonMatch = trimmed.match(/^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?$/);
  if (colonMatch) {
    let hour = Number(colonMatch[1]);
    const minute = Number(colonMatch[2] ?? "0");
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      const adjusted = applyMeridiem(hour, minute, meridiem);
      if (adjusted) return adjusted;
    }
  }

  return null;
}

function applyMeridiem(
  hour: number,
  minute: number,
  meridiem?: string
): { hour: number; minute: number } | null {
  let adjustedHour = hour;
  if (meridiem === "pm" && adjustedHour < 12) {
    adjustedHour += 12;
  } else if (meridiem === "am" && adjustedHour === 12) {
    adjustedHour = 0;
  }

  if (adjustedHour >= 0 && adjustedHour <= 23 && minute >= 0 && minute <= 59) {
    return { hour: adjustedHour, minute };
  }

  return null;
}

function toIsoDate({
  year,
  month,
  day,
}: {
  year: number;
  month: number;
  day: number;
}): string {
  return [
    year.toString().padStart(4, "0"),
    month.toString().padStart(2, "0"),
    day.toString().padStart(2, "0"),
  ].join("-");
}

function toUtcTimestamp(
  dateParts: { year: number; month: number; day: number },
  timeParts?: { hour: number; minute: number }
): string {
  const { year, month, day } = dateParts;
  const hour = timeParts?.hour ?? 0;
  const minute = timeParts?.minute ?? 0;
  const timestamp = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  return new Date(timestamp).toISOString();
}

function normaliseTimeString(
  timeParts: { hour: number; minute: number } | null
): string | undefined {
  if (!timeParts) return undefined;
  const { hour, minute } = timeParts;
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

function normaliseOffset(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  if (OFFSET_ALIASES[lower] !== undefined) {
    return OFFSET_ALIASES[lower];
  }

  const isoWithColon = trimmed.match(/^([+-])(\d{2}):(\d{2})$/);
  if (isoWithColon) {
    const [, sign, hour, minute] = isoWithColon;
    const hourNum = Number(hour);
    const minuteNum = Number(minute);
    if (hourNum <= 14 && minuteNum <= 59) {
      return `${sign}${hour}:${minute}`;
    }
    return null;
  }

  const isoNoColon = trimmed.match(/^([+-])(\d{2})(\d{2})$/);
  if (isoNoColon) {
    const [, sign, hour, minute] = isoNoColon;
    const hourNum = Number(hour);
    const minuteNum = Number(minute);
    if (hourNum <= 14 && minuteNum <= 59) {
      return `${sign}${hour}:${minute}`;
    }
    return null;
  }

  const sanitised = lower.replace(/^utc/, "").replace(/^gmt/, "");
  const simpleMatch = sanitised.match(/^([+-]?)(\d{1,2})(?::?(\d{2}))?$/);
  if (simpleMatch) {
    const [, rawSign, hourStr, minuteStr] = simpleMatch;
    const sign = rawSign === "-" ? "-" : "+";
    const hourNum = Number(hourStr);
    const minuteNum = minuteStr ? Number(minuteStr) : 0;
    if (
      !Number.isNaN(hourNum) &&
      !Number.isNaN(minuteNum) &&
      hourNum <= 14 &&
      minuteNum <= 59
    ) {
      return `${sign}${hourNum.toString().padStart(2, "0")}:${minuteNum
        .toString()
        .padStart(2, "0")}`;
    }
  }

  return null;
}

function buildUtcTimestampWithOffset(
  dateParts: { year: number; month: number; day: number },
  timeParts: { hour: number; minute: number } | null,
  offset: string
): string {
  const date = toIsoDate(dateParts);
  const time = normaliseTimeString(timeParts) ?? "00:00";
  const suffix = offset === "+00:00" ? "Z" : offset;
  const isoCandidate = `${date}T${time}${suffix}`;
  const parsed = Date.parse(isoCandidate);
  if (Number.isNaN(parsed)) {
    return toUtcTimestamp(dateParts, timeParts ?? undefined);
  }
  return new Date(parsed).toISOString();
}

function coerceBooleanGame(type: string, home: string, away: string): boolean {
  const typeLower = type.toLowerCase();
  if (
    typeLower.includes("game") ||
    typeLower.includes("match") ||
    typeLower.includes("fixture")
  ) {
    return true;
  }
  return Boolean(home && away);
}

function createGeneralEventId(index: number): string {
  return `upcoming-event-${index + 1}`;
}

function createScheduleEventId(team: GameTeam, index: number): string {
  return `schedule-${team}-${index + 1}`;
}

function parseGeneralEvents(rows: any[][], nowIso: string): UpcomingEvent[] {
  if (!rows.length) return [];

  const normalisedRows: SheetRow[] = rows.map((rawRow) =>
    rawRow.map((cell) => (cell ?? "").toString())
  );

  let { header, dataRows } = splitHeaderAndData(normalisedRows);
  if (!header.length) return [];

  let headerMap = buildHeaderMap(header);
  const essentialKeys = ["date", "time", "location", "team", "activitytype"];
  const hasEssentialHeader = essentialKeys.some((key) => headerMap.has(key));

  if (!hasEssentialHeader) {
    const headerLooksLikeData =
      header.length >= 3 && Boolean(parseDateParts(header[0]));
    if (headerLooksLikeData) {
      dataRows = [header, ...dataRows];
      header = [
        "Date",
        "Time",
        "Location",
        "Team",
        "Activity type",
        "Title",
        "Description",
        "Link",
        "Sport",
      ];
      headerMap = buildHeaderMap(header);
    }
  }

  if (headerMap.size === 0) return [];

  const events: UpcomingEvent[] = [];

  dataRows.forEach((rawRow, rowIndex) => {
    const row = rawRow.map((cell) => (cell ?? "").toString().trim());
    if (rowIsBlank(row)) return;
    if (rowMatchesHeader(row, header)) return;

    const dateValue = pickValue(
      row,
      headerMap,
      ["date", "startdate", "eventdate"],
      0
    );
    const dateParts = parseDateParts(dateValue);
    if (!dateParts) {
      return;
    }

    const timeValue = pickValue(
      row,
      headerMap,
      ["time", "starttime", "eventtime", "kickoff"],
      1
    );
    const timeParts = parseTimeParts(timeValue);
    const hasExplicitTime = Boolean(timeParts);

    const offsetRaw = pickValue(row, headerMap, OFFSET_HEADER_KEYS);
    const offset = normaliseOffset(offsetRaw) ?? DEFAULT_OSLO_OFFSET;

    const startsAt = buildUtcTimestampWithOffset(dateParts, timeParts, offset);
    if (startsAt < nowIso) {
      return;
    }

    const endDateValue = pickValue(row, headerMap, ["enddate", "finishdate"]);
    const endDateParts = parseDateParts(endDateValue);
    const endTimeValue = pickValue(row, headerMap, ["endtime", "finishtime"]);
    const endTimeParts = parseTimeParts(endTimeValue);
    const endOffsetRaw = pickValue(row, headerMap, END_OFFSET_HEADER_KEYS);
    const endOffset = normaliseOffset(endOffsetRaw) ?? offset;

    const titleRaw = pickValue(
      row,
      headerMap,
      ["title", "event", "name", "eventname"],
      5
    );
    const homeTeam = pickValue(row, headerMap, [
      "hometeam",
      "home",
      "host",
      "homeclub",
    ]);
    const awayTeam = pickValue(row, headerMap, [
      "awayteam",
      "away",
      "opponent",
      "guestclub",
    ]);
    const typeRaw = pickValue(
      row,
      headerMap,
      ["type", "category", "eventtype", "activitytype"],
      4
    );
    const location = pickValue(
      row,
      headerMap,
      ["location", "venue", "place", "field"],
      2
    );
    const description = pickValue(
      row,
      headerMap,
      ["description", "details", "notes"],
      6
    );
    const link = pickValue(row, headerMap, ["link", "url", "cta"], 7);
    const sport = pickValue(row, headerMap, ["sport", "discipline"], 8);
    const teamRaw = pickValue(row, headerMap, ["team", "program", "squad"], 3);

    const normalisedTeam = normaliseTeam(teamRaw);
    const defaultHome =
      typeof normalisedTeam === "string" && normalisedTeam !== "All"
        ? TEAM_DEFAULT_HOME[normalisedTeam as GameTeam] ?? "Oslo Vikings"
        : "Oslo Vikings";

    const locationHref = createLocationHref(location || undefined);

    const isGame = coerceBooleanGame(typeRaw, homeTeam, awayTeam);
    const title =
      titleRaw ||
      (isGame
        ? `${homeTeam || defaultHome} vs ${awayTeam || "Opponent"}`
        : typeRaw || "Club Event");

    const originalDate = toIsoDate(dateParts);
    const originalTime = normaliseTimeString(timeParts);
    const displayDateTime = formatTimestampInTimeZone(startsAt, OSLO_TIMEZONE);

    const event: UpcomingEvent = {
      id: createGeneralEventId(rowIndex),
      title,
      category: typeRaw || (isGame ? "Game" : undefined),
      team: normalisedTeam,
      date: displayDateTime.date,
      time: hasExplicitTime ? displayDateTime.time : undefined,
      startsAt,
      endsAt: endDateParts
        ? buildUtcTimestampWithOffset(
            endDateParts,
            endTimeParts ?? timeParts,
            endOffset
          )
        : undefined,
      location: location || undefined,
      locationHref,
      description: description || undefined,
      link: link || undefined,
      isGame,
      homeTeam: isGame ? homeTeam || defaultHome : undefined,
      awayTeam: isGame ? awayTeam || "Opponent" : undefined,
      sport: sport || undefined,
      originalDate,
      originalTime: hasExplicitTime ? originalTime : undefined,
      offset,
      timeZone: OSLO_TIMEZONE,
    };

    events.push(event);
  });

  return events;
}

function inferHomeAwayTeams(
  rawHome: string,
  rawAway: string,
  opponent: string,
  indicator: string,
  defaultHome: string
): { homeTeam: string; awayTeam: string } {
  let homeTeam = rawHome;
  let awayTeam = rawAway;

  if (!homeTeam && !awayTeam) {
    if (opponent) {
      const indicatorLower = indicator.toLowerCase();
      if (indicatorLower.startsWith("a")) {
        homeTeam = opponent;
        awayTeam = defaultHome;
      } else {
        homeTeam = defaultHome;
        awayTeam = opponent;
      }
    } else {
      homeTeam = defaultHome;
      awayTeam = "Opponent";
    }
  } else {
    if (!homeTeam) {
      homeTeam = defaultHome;
    }
    if (!awayTeam) {
      awayTeam = opponent || "Opponent";
    }
  }

  return { homeTeam, awayTeam };
}

function parseScheduleEvents(
  rows: any[][],
  source: ScheduleSource,
  nowIso: string
): UpcomingEvent[] {
  if (!rows.length) return [];

  const normalisedRows: SheetRow[] = rows.map((rawRow) =>
    rawRow.map((cell) => (cell ?? "").toString())
  );

  const { header, dataRows } = splitHeaderAndData(normalisedRows);
  if (!header.length) return [];

  const headerMap = buildHeaderMap(header);
  if (headerMap.size === 0) return [];

  const events: UpcomingEvent[] = [];

  dataRows.forEach((rawRow, rowIndex) => {
    const row = rawRow.map((cell) => (cell ?? "").toString().trim());
    if (rowIsBlank(row)) return;
    if (rowMatchesHeader(row, header)) return;

    const dateValue = pickValue(row, headerMap, [
      "date",
      "gamedate",
      "matchdate",
      "eventdate",
    ]);
    const dateParts = parseDateParts(dateValue);
    if (!dateParts) {
      return;
    }

    const timeValue = pickValue(row, headerMap, [
      "time",
      "starttime",
      "eventtime",
      "kickoff",
    ]);
    const timeParts = parseTimeParts(timeValue);
    const hasExplicitTime = Boolean(timeParts);

    const offsetRaw = pickValue(row, headerMap, OFFSET_HEADER_KEYS);
    const offset = normaliseOffset(offsetRaw) ?? DEFAULT_OSLO_OFFSET;

    const startsAt = buildUtcTimestampWithOffset(dateParts, timeParts, offset);
    if (startsAt < nowIso) {
      return;
    }

    const location = pickValue(row, headerMap, [
      "location",
      "venue",
      "place",
      "field",
      "stadium",
    ]);
    const locationHref = createLocationHref(location || undefined);
    const description = pickValue(row, headerMap, [
      "description",
      "details",
      "notes",
    ]);
    const link = pickValue(row, headerMap, ["link", "url", "tickets"]);

    const rawHomeTeam = pickValue(row, headerMap, [
      "hometeam",
      "home",
      "homeclub",
    ]);
    const rawAwayTeam = pickValue(row, headerMap, [
      "awayteam",
      "away",
      "awayclub",
      "visitor",
      "guestclub",
    ]);
    const opponent = pickValue(row, headerMap, [
      "opponent",
      "opposition",
      "rival",
    ]);
    const indicator = pickValue(row, headerMap, [
      "homeaway",
      "ha",
      "homeoraway",
      "h/a",
    ]);

    const defaultHome = TEAM_DEFAULT_HOME[source.team];
    const sport = TEAM_DEFAULT_SPORT[source.team];

    const { homeTeam, awayTeam } = inferHomeAwayTeams(
      rawHomeTeam,
      rawAwayTeam,
      opponent,
      indicator,
      defaultHome
    );

    const originalDate = toIsoDate(dateParts);
    const originalTime = normaliseTimeString(timeParts);
    const displayDateTime = formatTimestampInTimeZone(startsAt, OSLO_TIMEZONE);

    const event: UpcomingEvent = {
      id: createScheduleEventId(source.team, rowIndex),
      title: `${homeTeam} vs ${awayTeam}`,
      category: "Game",
      team: source.team,
      date: displayDateTime.date,
      time: hasExplicitTime ? displayDateTime.time : undefined,
      startsAt,
      location: location || undefined,
      locationHref,
      description: description || undefined,
      link: link || undefined,
      isGame: true,
      homeTeam,
      awayTeam,
      sport,
      originalDate,
      originalTime: hasExplicitTime ? originalTime : undefined,
      offset,
      timeZone: OSLO_TIMEZONE,
    };

    events.push(event);
  });

  return events;
}

export async function fetchUpcomingEvents(
  tab: string = DEFAULT_EVENTS_TAB,
  range: string = DEFAULT_EVENTS_RANGE
): Promise<UpcomingEvent[]> {
  const nowIso = new Date().toISOString();

  const [generalRows, scheduleResults] = await Promise.all([
    fetchSheetRows(tab, range),
    Promise.all(
      SCHEDULE_SOURCES.map(async (source) => ({
        source,
        rows: await fetchSheetRows(source.sheet, SCHEDULE_RANGE),
      }))
    ),
  ]);

  const generalEvents = parseGeneralEvents(generalRows, nowIso);
  const scheduleEvents = scheduleResults.flatMap(({ source, rows }) =>
    parseScheduleEvents(rows, source, nowIso)
  );

  const combined = [...generalEvents, ...scheduleEvents];
  return combined.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
