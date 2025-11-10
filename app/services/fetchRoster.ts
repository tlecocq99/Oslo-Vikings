import { Player } from "@/app/types/player";
import { fetchSheetRows } from "./googleSheets";

// -------- Player helpers --------

const PLAYER_RANGE = "A2:I200"; // includes Nationality (column I)

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
  return rows
    .filter(isValidPlayerRow)
    .map((row, index) => mapPlayerRow(row, index, tab));
}

export async function fetchPlayers(): Promise<Player[]> {
  return fetchRoster("Players");
}
