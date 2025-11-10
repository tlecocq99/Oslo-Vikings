import { Player } from "@/app/types/player";
import { fetchSheetRows } from "./googleSheets";

// -------- Player helpers --------

const PLAYER_RANGE = "A2:I200"; // includes Nationality (column I)
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
