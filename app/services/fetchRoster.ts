import { Player } from "@/app/types/player";
import { fetchSheetRows } from "./googleSheets";

// -------- Player helpers --------

const PLAYER_RANGE = "A2:K200"; // extends to Nationality (column K)

function getCell(row: any[], index: number): string {
  const value = row[index];
  if (value === undefined || value === null) {
    return "";
  }
  return String(value).trim();
}

function isValidPlayerRow(row: any[]): boolean {
  if (!row || row.length < 3) return false;

  const [rawName, rawPosition, rawNumber] = row;

  const hasName = typeof rawName === "string" && rawName.trim().length > 0;
  const hasPosition =
    typeof rawPosition === "string" && rawPosition.trim().length > 0;

  let hasValidNumber = false;
  if (typeof rawNumber === "number") {
    hasValidNumber = Number.isFinite(rawNumber);
  } else if (typeof rawNumber === "string") {
    const cleaned = rawNumber.trim().replace(/^#/, "");
    if (cleaned !== "") {
      const parsed = parseInt(cleaned, 10);
      hasValidNumber = !Number.isNaN(parsed);
    }
  }

  return hasName && hasPosition && hasValidNumber;
}

function mapPlayerRow(row: any[], index: number, namespace: string): Player {
  const name = getCell(row, 0);
  const position = getCell(row, 1);
  const rawNumber = row[2];
  const height = getCell(row, 3);
  const weight = getCell(row, 4);
  const imageUrl = getCell(row, 7);
  const imageAlt = getCell(row, 8);
  const bio = getCell(row, 9);
  const nationality = getCell(row, 10);

  let parsedNumber: number | undefined;
  if (rawNumber) {
    const cleaned = String(rawNumber).trim().replace(/^#/, "");
    const n = parseInt(cleaned, 10);
    if (!Number.isNaN(n)) parsedNumber = n;
  }

  return {
    id: `${namespace}-${index + 1}`,
    name,
    position,
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
  return rows
    .filter(isValidPlayerRow)
    .map((row, index) => mapPlayerRow(row, index, tab));
}

export async function fetchPlayers(): Promise<Player[]> {
  return fetchRoster("Players");
}
