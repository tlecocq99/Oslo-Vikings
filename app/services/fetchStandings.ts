// Lightweight HTML scraper for Superserien standings.
// NOTE: For production robustness you'd likely want a dedicated backend cron + cache.

export interface StandingRow {
  rank: number;
  team: string;
  gamesPlayed?: number;
  wins?: number;
  losses?: number;
  pointsFor?: number;
  pointsAgainst?: number;
  points?: number; // league points
}

export interface StandingsResult {
  updatedAt: string;
  rows: StandingRow[];
  source: string;
}

const TARGET_URL = "https://www.superserien.se/standings";

// Simple in-memory cache (per server instance)
let cache: { data: StandingsResult; expires: number } | null = null;
const TTL_MS = 1000 * 60 * 30; // 30 minutes

export async function fetchStandings(): Promise<StandingsResult> {
  if (cache && Date.now() < cache.expires) return cache.data;

  const res = await fetch(TARGET_URL, { next: { revalidate: 1800 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch standings (${res.status})`);
  }
  const html = await res.text();

  // Very naive parsing: look for table rows. Adjust selectors when real markup differs.
  const rows: StandingRow[] = [];
  // Use [\s\S] instead of dotAll to stay compatible with older targets
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;
  while ((match = rowRegex.exec(html))) {
    const rowHtml = match[1];
    // Extract columns
  const cols = Array.from(rowHtml.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)).map((m) =>
      m[1]
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim()
    );
    if (cols.length < 2) continue;
    // Heuristic: first col rank, second team
    const rank = parseInt(cols[0], 10);
    if (isNaN(rank)) continue;
    const team = cols[1];
    const toNum = (v?: string) => {
      if (!v) return undefined;
      const n = parseInt(v, 10);
      return isNaN(n) ? undefined : n;
    };
    rows.push({
      rank,
      team,
      gamesPlayed: toNum(cols[2]),
      wins: toNum(cols[3]),
      losses: toNum(cols[4]),
      pointsFor: toNum(cols[5]),
      pointsAgainst: toNum(cols[6]),
      points: toNum(cols[7]),
    });
  }

  const data: StandingsResult = {
    updatedAt: new Date().toISOString(),
    rows,
    source: TARGET_URL,
  };
  cache = { data, expires: Date.now() + TTL_MS };
  return data;
}
