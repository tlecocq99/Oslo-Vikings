import { fetchSheetRows } from "./googleSheets";
import type { Recruit, RecruitField } from "@/app/types/recruit";

const SENIOR_RECRUITS_TAB =
  process.env.GOOGLE_SENIOR_RECRUITS_TAB ?? "Senior Recruits";
const SENIOR_RECRUITS_RANGE =
  process.env.GOOGLE_SENIOR_RECRUITS_RANGE ?? "A1:H200";

const HEADER_KEYS = {
  name: ["name", "player", "full name", "recruit"],
  position: ["position", "pos", "role"],
  hometown: ["hometown", "home town", "city", "from"],
  school: ["school", "program", "club", "team"],
  notes: ["notes", "detail", "details", "info", "comment", "about"],
  class: ["class", "year", "grad", "graduation"],
} as const;

type HeaderKey = keyof typeof HEADER_KEYS;

function normaliseHeader(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

const HEADER_ALIAS_TO_KEY = new Map<string, HeaderKey>();
Object.entries(HEADER_KEYS).forEach(([key, aliases]) => {
  aliases.forEach((alias) => {
    HEADER_ALIAS_TO_KEY.set(normaliseHeader(alias), key as HeaderKey);
  });
});

function buildHeaderIndex(headerRow: string[]): Map<string, number> {
  const map = new Map<string, number>();
  headerRow.forEach((header, index) => {
    const normalised = normaliseHeader(header);
    if (normalised && !map.has(normalised)) {
      map.set(normalised, index);
    }
  });
  return map;
}

function pickIndex(
  headerMap: Map<string, number>,
  keys: readonly string[]
): number | undefined {
  for (const key of keys) {
    const index = headerMap.get(normaliseHeader(key));
    if (index !== undefined) {
      return index;
    }
  }
  return undefined;
}

function normaliseCell(cell: unknown): string {
  if (cell === undefined || cell === null) return "";
  return String(cell).trim();
}

function parseSeniorRecruitRows(rows: unknown[][]): Recruit[] {
  if (!rows.length) return [];

  const normalisedRows = rows
    .map((row) => row.map((cell) => normaliseCell(cell)))
    .filter((row) => row.some((cell) => cell !== ""));

  if (!normalisedRows.length) {
    return [];
  }

  const [firstRow, ...rest] = normalisedRows;
  const headerDetected = firstRow.some((cell) =>
    HEADER_ALIAS_TO_KEY.has(normaliseHeader(cell))
  );

  const headerRow = headerDetected ? firstRow : [];
  const dataRows = headerDetected ? rest : normalisedRows;
  const headerMap = headerDetected
    ? buildHeaderIndex(firstRow)
    : new Map<string, number>();

  const nameIndex = headerDetected
    ? pickIndex(headerMap, HEADER_KEYS.name) ?? 0
    : 0;
  const positionIndex = headerDetected
    ? pickIndex(headerMap, HEADER_KEYS.position)
    : dataRows[0]?.length > 1
    ? 1
    : undefined;

  const recruits: Recruit[] = [];

  dataRows.forEach((row, rowIndex) => {
    const name =
      nameIndex >= 0 && nameIndex < row.length ? row[nameIndex] : row[0] ?? "";
    if (!name) {
      return;
    }

    let position: string | undefined;
    const fields: RecruitField[] = [];

    row.forEach((value, columnIndex) => {
      if (!value) return;
      if (columnIndex === nameIndex) return;

      const headerLabel = headerRow[columnIndex] ?? "";
      const canonicalKey = headerDetected
        ? HEADER_ALIAS_TO_KEY.get(normaliseHeader(headerLabel))
        : undefined;

      if (
        canonicalKey === "position" ||
        (!headerDetected &&
          positionIndex !== undefined &&
          columnIndex === positionIndex)
      ) {
        if (!position) {
          position = value;
          return;
        }
      }

      const label =
        headerDetected && headerLabel
          ? headerLabel
          : `Detail ${columnIndex + 1}`;

      fields.push({ label, value });
    });

    const recruit: Recruit = {
      id: `senior-elite-recruit-${rowIndex + 1}`,
      name,
      fields,
      ...(position ? { position } : {}),
    };

    recruits.push(recruit);
  });

  return recruits;
}

export async function fetchSeniorRecruits(): Promise<Recruit[]> {
  const rows = await fetchSheetRows(SENIOR_RECRUITS_TAB, SENIOR_RECRUITS_RANGE);
  return parseSeniorRecruitRows(rows);
}

export type { Recruit };
