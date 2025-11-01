import type { GameTeam } from "@/app/types/game";

/**
 * Represents an upcoming event that can be displayed in the Upcoming Events bar.
 * `startsAt` and `endsAt` are ISO 8601 timestamps in UTC to make sorting predictable,
 * while the individual `date` and `time` fields represent the club's display timezone
 * (Europe/Oslo) using 24-hour formatting. `originalDate`/`originalTime` preserve the
 * raw sheet values for auditing or debugging.
 */
export interface UpcomingEvent {
  id: string;
  title: string;
  /** Distinguishes general events from games or practices. */
  category?: string;
  /** Team association. Use "All" for events that should always show. */
  team?: GameTeam | "All" | string;
  /** Display ISO date (yyyy-mm-dd) converted to the club's timezone. */
  date: string;
  /** 24-hour HH:mm string in the club's timezone when available. */
  time?: string;
  /** ISO timestamp (UTC) composed from date/time for ordering. */
  startsAt: string;
  /** Optional end time in ISO (UTC). */
  endsAt?: string;
  location?: string;
  /** Optional internal link that points to a map view for the location. */
  locationHref?: string;
  description?: string;
  link?: string;
  /** Whether this row represents a competitive game. */
  isGame: boolean;
  homeTeam?: string;
  awayTeam?: string;
  sport?: string;
  /** Original ISO date (yyyy-mm-dd) captured from the sheet. */
  originalDate?: string;
  /** Original normalised HH:mm captured from the sheet. */
  originalTime?: string;
  /** Normalised UTC offset string applied when computing timestamps. */
  offset?: string;
  /** Render timezone identifier (usually Europe/Oslo). */
  timeZone?: string;
}
