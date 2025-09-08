// Fresh implementation (from scratch) using Cheerio to scrape a specific table structure.
// Table: <table class="Table_table__nHJtt"> on https://www.superserien.se/standings
// Columns required (headers in source -> interface fields):
// Team -> team (string)
// CONF -> conf (string)
// G -> gamesPlayed (number)
// W - L -> winLoss (string "W-L" extracted; keep as string for display)
// PCT -> pct (number)
// P -> pointsFor (number)
// P+- -> pointsPlusMinus (number)
// P/G -> pointsPerGame (number)

export interface StandingRow {
  team: string;
  conf: string;
  gamesPlayed?: number;
  winLoss?: string; // "W-L"
  pct?: number;
  pointsFor?: number;
  pointsPlusMinus?: number;
  pointsPerGame?: number;
  teamLogo?: string; // extracted logo URL
}

export interface StandingsResult {
  updatedAt: string;
  rows: StandingRow[];
  source: string;
}

const TARGET_URL = "https://www.superserien.se/standings";
const TABLE_SELECTOR = "table.Table_table__nHJtt";

let cache: { data: StandingsResult; expires: number } | null = null;
const TTL_MS = 1000 * 60 * 30; // 30 minutes

function toNum(raw?: string): number | undefined {
  if (!raw) return undefined;
  const cleaned = raw.replace(/[^0-9.+-]/g, "");
  if (!cleaned) return undefined;
  const n = Number(cleaned);
  return Number.isNaN(n) ? undefined : n;
}

export async function fetchStandings(): Promise<StandingsResult> {
  if (cache && Date.now() < cache.expires) return cache.data;

  const res = await fetch(TARGET_URL, {
    next: { revalidate: 1800 },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      Connection: "keep-alive",
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch standings (${res.status})`);
  const html = await res.text();

  const cheerio = await import("cheerio");
  const $ = cheerio.load(html);

  let table = $(TABLE_SELECTOR).first();
  if (!table.length) {
    table = $("table")
      .filter((_, el) => {
        const cls = $(el).attr("class") || "";
        return /Table_table/.test(cls) && $(el).text().includes("Team");
      })
      .first();
  }

  const rows: StandingRow[] = [];
  if (!table.length) {
    console.warn("[fetchStandings] Target table not found.");
  } else {
    // If thead missing, treat first row as header
    let headerRow = table.find("thead tr").first();
    if (!headerRow.length) headerRow = table.find("tr").first();
    const headerCells = headerRow.find("th,td").toArray();
    const headers = headerCells.map((c) => $(c).text().trim());
    const normalized = headers.map((h) => h.replace(/\s+/g, " ").trim());

    // Build precise mapping from provided header samples
    interface ColSpec {
      key: keyof StandingRow;
      labels: RegExp;
    }
    const specs: ColSpec[] = [
      { key: "team", labels: /^team$/i },
      { key: "conf", labels: /^conf$/i },
      { key: "gamesPlayed", labels: /^g$/i },
      { key: "winLoss", labels: /^w\s*-\s*l$/i },
      { key: "pct", labels: /^pct$/i },
      { key: "pointsFor", labels: /^p$/i },
      { key: "pointsPlusMinus", labels: /^p\+-$/i },
      { key: "pointsPerGame", labels: /^p\/g$/i },
    ];

    const colMap: Record<string, number> = {};
    normalized.forEach((h, i) => {
      for (const spec of specs) {
        if (spec.labels.test(h)) {
          colMap[spec.key] = i;
          break;
        }
      }
    });

    table.find("tbody tr").each((_, tr) => {
      const cellEls = $(tr).find("td,th").toArray();
      if (!cellEls.length) return;
      const teamIdx = colMap.team;
      if (teamIdx === undefined || !cellEls[teamIdx]) return;
      const teamCell = $(cellEls[teamIdx]);
      // Extract logo src if present
      const teamLogo = teamCell.find("img").attr("src");
      // Remove images and links to isolate text
      // Extract raw textual content for the team (remove media elements first)
      const rawTeamText = teamCell
        .clone()
        .find("img, svg, picture, source")
        .remove()
        .end()
        .text()
        .replace(/\s+/g, " ")
        .trim();

      // Some rows concatenate the playoff stage directly after the team name
      // e.g. "CrusadersSemi-Final 1." (no separating space). Our previous
      // regex using a word boundary failed in that scenario. Remove any
      // trailing playoff / finals annotation regardless of preceding space.
      let teamName = rawTeamText
        .replace(/(Semi[- ]?Final.*|Quarter[- ]?Final.*|Playoff.*)$/i, "")
        .trim();
      // Extra defensive cleanup: strip any stray HTML tags (if present) and trailing periods
      if (/[<>]/.test(teamName))
        teamName = teamName
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      teamName = teamName.replace(/\.+$/, "");
      if (!teamName) return;
      const row: StandingRow = { team: teamName, conf: "", teamLogo };

      const textAt = (idx?: number) =>
        idx !== undefined && cellEls[idx]
          ? $(cellEls[idx]).text().trim()
          : undefined;

      if (colMap.conf !== undefined) row.conf = textAt(colMap.conf) || "";
      if (colMap.gamesPlayed !== undefined)
        row.gamesPlayed = toNum(textAt(colMap.gamesPlayed));
      if (colMap.winLoss !== undefined) {
        const wlRaw = (textAt(colMap.winLoss) || "")
          .replace(/\s+/g, "")
          .replace(/–/, "-");
        if (/^\d+[-]\d+$/.test(wlRaw)) row.winLoss = wlRaw;
        else if (wlRaw) row.winLoss = wlRaw; // keep original if something else
      }
      if (colMap.pct !== undefined) row.pct = toNum(textAt(colMap.pct));
      if (colMap.pointsFor !== undefined)
        row.pointsFor = toNum(textAt(colMap.pointsFor));
      if (colMap.pointsPlusMinus !== undefined)
        row.pointsPlusMinus = toNum(textAt(colMap.pointsPlusMinus));
      if (colMap.pointsPerGame !== undefined)
        row.pointsPerGame = toNum(textAt(colMap.pointsPerGame));

      rows.push(row);
    });
  }

  if (!rows.length) {
    console.warn("[fetchStandings] No rows parsed from target table.");
  }

  const data: StandingsResult = {
    updatedAt: new Date().toISOString(),
    rows,
    source: TARGET_URL,
  };
  cache = { data, expires: Date.now() + TTL_MS };
  return data;
}
