import { fetchSheetRows } from "./googleSheets";

const SCHEDULE_RANGE = "A70:G90";
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
