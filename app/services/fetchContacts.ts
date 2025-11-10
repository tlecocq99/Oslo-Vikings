import { fetchSheetRows } from "./googleSheets";
import type { ContactPerson } from "@/app/types/contact";

const DEFAULT_CONTACT_SHEET =
  process.env.GOOGLE_STAFF_SHEET ?? "Coaching Staff & Board";
const BOARD_RANGE = process.env.GOOGLE_BOARD_RANGE ?? "A3:D12";
const CENTRAL_RANGE = process.env.GOOGLE_CENTRAL_RANGE ?? "A15:D25";

function normaliseCell(cell: string | undefined | null): string {
  if (cell === undefined || cell === null) return "";
  return String(cell).trim();
}

function parseContacts(rows: (string | undefined | null)[][]): ContactPerson[] {
  return rows
    .map((rawRow) => rawRow.map((cell) => normaliseCell(cell)))
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row, index) => {
      const [name = "", position = "", email = "", phone = ""] = row;

      return {
        name,
        position,
        email: email || undefined,
        phone: phone || undefined,
      } satisfies ContactPerson;
    })
    .filter((entry) => entry.name || entry.position);
}

export async function fetchBoardContacts(): Promise<ContactPerson[]> {
  const rows = await fetchSheetRows(DEFAULT_CONTACT_SHEET, BOARD_RANGE);
  return parseContacts(rows);
}

export async function fetchCentralFunctionContacts(): Promise<ContactPerson[]> {
  const rows = await fetchSheetRows(DEFAULT_CONTACT_SHEET, CENTRAL_RANGE);
  return parseContacts(rows);
}

export async function fetchAllContacts(): Promise<{
  board: ContactPerson[];
  central: ContactPerson[];
}> {
  const [board, central] = await Promise.all([
    fetchBoardContacts(),
    fetchCentralFunctionContacts(),
  ]);

  return { board, central };
}
