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

const PLAYER_RANGE = "A2:I500"; // includes Nationality (column I)

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

// -------- Future expansion --------
// Additional helpers (e.g., fetchStaff, fetchBoard) can reuse fetchSheetRows with
// new mapping functions once those Sheets tabs are defined.
