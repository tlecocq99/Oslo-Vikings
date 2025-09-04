export type Side = "Offense" | "Defense" | "Special Teams";

/**
 * POSITION_GROUPS: simple arrays of full position names grouped by side.
 * Use these directly for UI (filters, grouping) without short codes.
 */
export const POSITION_GROUPS: Record<Side, string[]> = {
  Offense: [
    "Quarterback",
    "Running Back",
    "Fullback",
    "Wide Receiver",
    "Tight End",
    "Left Tackle",
    "Left Guard",
    "Center",
    "Right Guard",
    "Right Tackle",
  ],
  Defense: [
    "Defensive End",
    "Defensive Tackle",
    "Defensive Back",
    "Defensive Lineman",
    "Nose Tackle",
    "Edge Rusher",
    "Linebacker",
    "Outside Linebacker",
    "Inside Linebacker",
    "Middle Linebacker",
    "Cornerback",
    "Safety",
    "Free Safety",
    "Strong Safety",
    "Nickel Back",
  ],
  "Special Teams": [
    "Kicker",
    "Punter",
    "Long Snapper",
    "Kick Returner",
    "Punt Returner",
    "Kickoff Returner",
  ],
};

/** Reverse lookup: full position name (case-insensitive) -> side */
export const POSITION_SIDE: Record<string, Side> = Object.fromEntries(
  Object.entries(POSITION_GROUPS).flatMap(([side, names]) =>
    names.map((n) => [n.toLowerCase(), side as Side])
  )
);

/** Return side (defaults to Offense) for a full position name. */
export function getSideForPosition(pos: string | undefined): Side {
  return (pos && POSITION_SIDE[pos.toLowerCase()]) || "Offense";
}

/** Identity helper retained for API symmetry; with full names no transformation needed. */
export function getFullNameForPosition(pos: string | undefined): string {
  if (!pos) return "Unknown";
  return pos;
}

/** List of sides in display order */
export const ROSTER_SIDES: Side[] = ["Offense", "Defense", "Special Teams"];
