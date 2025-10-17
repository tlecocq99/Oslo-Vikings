import { google } from "googleapis";
import { Player } from "@/app/types/player";

// -------- Google Sheets client bootstrapping --------

function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== "" ? v : undefined;
}

type SheetsClient = {
  sheets: ReturnType<typeof google.sheets>;
  sheetId: string;
};

let sheetsClientPromise: Promise<SheetsClient | null> | null = null;

async function getSheetsClient(): Promise<SheetsClient | null> {
  if (!sheetsClientPromise) {
    sheetsClientPromise = (async () => {
      const sheetId = getEnv("GOOGLE_SHEET_ID");
      const clientEmail = getEnv("GOOGLE_CLIENT_EMAIL");
      const privateKeyRaw = getEnv("GOOGLE_PRIVATE_KEY");
      if (!sheetId || !clientEmail || !privateKeyRaw) {
        console.warn(
          "[sheets] Missing Google Sheets env vars; skipping fetch."
        );
        return null;
      }
      const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
      const auth = new google.auth.GoogleAuth({
        credentials: { client_email: clientEmail, private_key: privateKey },
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      });
      const sheets = google.sheets({ version: "v4", auth });
      return { sheets, sheetId } satisfies SheetsClient;
    })();
  }
  return sheetsClientPromise;
}

async function fetchSheetRows(
  sheetName: string,
  range: string
): Promise<any[][]> {
  const client = await getSheetsClient();
  if (!client) return [];
  try {
    const resp = await client.sheets.spreadsheets.values.get({
      spreadsheetId: client.sheetId,
      range: `${sheetName}!${range}`,
    });
    return resp.data.values || [];
  } catch (err) {
    console.error(
      `[sheets] Failed to fetch range '${sheetName}!${range}':`,
      err
    );
    return [];
  }
}

// -------- Player helpers --------

const PLAYER_RANGE = "A2:I50"; // includes Nationality (column I)
const SCHEDULE_RANGE = "A71:G90";
const SCHEDULE_HEADER_KEYWORDS = [
  "date",
  "opponent",
  "home",
  "away",
  "location",
  "time",
  "result",
  "status",
  "kickoff",
  "venue",
  "team",
];

export type ScheduleColumn = {
  key: string;
  label: string;
};

export interface ScheduleEntry {
  id: string;
  data: Record<string, string>;
  raw: string[];
}

export interface ScheduleTable {
  columns: ScheduleColumn[];
  entries: ScheduleEntry[];
}

function mapPlayerRow(row: any[], index: number, namespace: string): Player {
  const [
    name = "",
    position = "",
    rawNumber = "",
    height = "",
    weight = "",
    imageUrl = "",
    imageAlt = "",
    bio = "",
    nationality = "",
  ] = row;

  let parsedNumber: number | undefined;
  if (rawNumber) {
    const cleaned = String(rawNumber).trim().replace(/^#/, "");
    const n = parseInt(cleaned, 10);
    if (!Number.isNaN(n)) parsedNumber = n;
  }

  return {
    id: `${namespace}-${index + 1}`,
    name: name.trim(),
    position: position.trim(),
    number: parsedNumber,
    height: height || undefined,
    weight: weight || undefined,
    image: imageUrl || undefined,
    imageAlt: imageAlt || undefined,
    bio: bio || undefined,
    nationality: nationality || undefined,
  };
}

export async function fetchRoster(tab: string): Promise<Player[]> {
  const rows = await fetchSheetRows(tab, PLAYER_RANGE);
  return rows.map((row, index) => mapPlayerRow(row, index, tab));
}

export async function fetchPlayers(): Promise<Player[]> {
  return fetchRoster("Players");
}

// -------- Schedule helpers --------

function normalizeHeaderToKey(label: string, fallbackIndex: number): string {
  const cleaned = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  if (!cleaned) {
    return `column${fallbackIndex + 1}`;
  }

  const parts = cleaned.split(" ").filter(Boolean);
  if (parts.length === 0) {
    return `column${fallbackIndex + 1}`;
  }

  const [first, ...rest] = parts;
  return (
    first +
    rest
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join("")
  );
}

function buildScheduleColumns(headers: string[]): ScheduleColumn[] {
  const counter = new Map<string, number>();
  return headers.map((header, index) => {
    const label = header.trim();
    const baseKey = normalizeHeaderToKey(label, index);
    const nextCount = (counter.get(baseKey) ?? 0) + 1;
    counter.set(baseKey, nextCount);

    const key = nextCount > 1 ? `${baseKey}${nextCount}` : baseKey;
    return {
      key,
      label: label || `Column ${index + 1}`,
    } satisfies ScheduleColumn;
  });
}

function deriveScheduleStructure(rows: string[][]) {
  const [firstRow = []] = rows;
  const maxColumns = rows.reduce(
    (max, row) => Math.max(max, row.length),
    firstRow.length
  );

  const hasHeader = firstRow.some((cell) => {
    const lowered = cell.toLowerCase();
    return SCHEDULE_HEADER_KEYWORDS.some((keyword) =>
      lowered.includes(keyword)
    );
  });

  const headerRowBase = hasHeader
    ? [...firstRow]
    : firstRow.map((_, index) => `Column ${index + 1}`);

  if (headerRowBase.length < maxColumns) {
    for (let i = headerRowBase.length; i < maxColumns; i += 1) {
      headerRowBase[i] = `Column ${i + 1}`;
    }
  }

  const headerRow = headerRowBase;
  const columns = buildScheduleColumns(headerRow);
  return {
    columns,
    headerRow,
    dataStartIndex: hasHeader ? 1 : 0,
    hasHeader,
  } as const;
}

function mapScheduleTable(rows: any[][], namespace: string): ScheduleTable {
  if (!rows.length) {
    return { columns: [], entries: [] } satisfies ScheduleTable;
  }

  const normalizedRows = rows.map((rawRow) =>
    rawRow.map((value) =>
      value === undefined || value === null ? "" : String(value).trim()
    )
  );

  const { columns, headerRow, dataStartIndex, hasHeader } =
    deriveScheduleStructure(normalizedRows);

  const entries = normalizedRows
    .slice(dataStartIndex)
    .filter((row) => row.some((cell) => cell !== ""))
    // Guard against duplicate header rows copied into the range.
    .filter((row) =>
      hasHeader
        ? !row.every((cell, idx) => cell === headerRow[idx] && cell !== "")
        : true
    )
    .map((row, index) => {
      const data: Record<string, string> = {};
      columns.forEach(({ key }, columnIndex) => {
        data[key] = row[columnIndex] ?? "";
      });

      return {
        id: `${namespace}-schedule-${index + 1}`,
        data,
        raw: row,
      } satisfies ScheduleEntry;
    });

  return { columns, entries } satisfies ScheduleTable;
}

export async function fetchSchedule(tab: string): Promise<ScheduleTable> {
  const rows = await fetchSheetRows(tab, SCHEDULE_RANGE);
  return mapScheduleTable(rows, tab);
}

// -------- Future expansion --------
// Additional helpers (e.g., fetchStaff, fetchBoard) can reuse fetchSheetRows with
// new mapping functions once those Sheets tabs are defined.
