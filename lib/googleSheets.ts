import { google } from "googleapis";
import type { PlayerCard, PlayerCardProps } from "@/types/player";

const TTL = Number(process.env.CACHE_TTL ?? 60) * 1000;

// simple module-scoped cache (persists while the serverless/Node process is warm)
let cache: { key: string; data: PlayerCardProps; expiresAt: number } | null =
  null;

function makeAuth() {
  const scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
  const json = process.env.SERVICE_ACCOUNT_JSON;
  if (json) {
    return new google.auth.GoogleAuth({
      credentials: JSON.parse(json),
      scopes,
    });
  }
  // Fallback to GOOGLE_APPLICATION_CREDENTIALS path for local dev if you prefer
  return new google.auth.GoogleAuth({ scopes });
}

function normalizeHeaders(headers: string[]) {
  return headers.map((h) => String(h || "").trim());
}

function idxOf(headers: string[], key: string) {
  return headers.findIndex(
    (h) => h.replace(/[\s_]/g, "").toLowerCase() === key.toLowerCase()
  );
}

function getter(headers: string[]) {
  return (row: string[], key: string): string | undefined => {
    const i = idxOf(headers, key);
    const v = i >= 0 ? row[i] : undefined;
    const s = v == null ? "" : String(v).trim();
    return s ? s : undefined;
  };
}

async function fetchPlayersFromSheets(): Promise<PlayerCardProps> {
  const spreadsheetId = process.env.SHEET_ID!;
  if (!spreadsheetId) throw new Error("Missing SHEET_ID");

  const auth = makeAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const range =
    process.env.SHEET_RANGE ||
    `${process.env.SHEET_NAME || "Players"}!A1:Z1000`;

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const values = data.values || [];
  if (values.length === 0) return [];

  const headers = normalizeHeaders(values[0]);
  const get = getter(headers);

  return values.slice(1).map<PlayerCard>((r) => {
    const name = get(r, "name");
    const position = get(r, "position");
    const number = get(r, "number");
    const height = get(r, "height");
    const weight = get(r, "weight");
    const bio = get(r, "bio");
    const image = get(r, "image");

    const photoFilename =
      get(r, "photofilename") ||
      get(r, "photofile") ||
      get(r, "photo") ||
      get(r, "headshot");
    const photoAlt =
      get(r, "photoalt") ||
      get(r, "photoalttext") ||
      (name ? `${name} headshot` : undefined);

    const p: PlayerCard = {
      name,
      position,
      number,
      height,
      weight,
      bio,
      image,
    };
    if (photoFilename || photoAlt)
      p.photo = { filename: photoFilename || "", alt: photoAlt || "" };
    return p;
  });
}

export async function fetchPlayersCached(): Promise<PlayerCardProps> {
  const key = `${process.env.SHEET_ID}|${
    process.env.SHEET_RANGE || process.env.SHEET_NAME
  }|v1`;
  const now = Date.now();
  if (cache && cache.key === key && cache.expiresAt > now) return cache.data;

  const data = await fetchPlayersFromSheets();
  cache = { key, data, expiresAt: now + TTL };
  return data;
}

export function findPlayer(
  players: PlayerCardProps,
  id: string
): PlayerCard | undefined {
  const want = id.toLowerCase();
  const kebab = (s?: string) => (s || "").toLowerCase().replace(/\s+/g, "-");
  return players.find(
    (p) =>
      p.number?.toLowerCase() === want ||
      p.name?.toLowerCase() === want ||
      kebab(p.name) === want
  );
}
