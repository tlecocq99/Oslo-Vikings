const DISPLAY_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function normaliseYear(year: number): number {
  if (Number.isNaN(year)) return year;
  if (year >= 100) return year;
  return year + (year >= 70 ? 1900 : 2000);
}

export function parseEuropeanDate(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return Number.NaN;

  const match = trimmed.match(
    /^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
  );

  if (!match) return Number.NaN;

  const [, dayStr, monthStr, yearStr, hourStr, minuteStr, secondStr] = match;
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = normaliseYear(Number(yearStr));
  const hour = hourStr !== undefined ? Number(hourStr) : 0;
  const minute = minuteStr !== undefined ? Number(minuteStr) : 0;
  const second = secondStr !== undefined ? Number(secondStr) : 0;

  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year) ||
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    Number.isNaN(second)
  ) {
    return Number.NaN;
  }

  if (day < 1 || day > 31 || month < 1 || month > 12) {
    return Number.NaN;
  }

  const date = new Date(year, month - 1, day, hour, minute, second);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return Number.NaN;
  }

  return date.getTime();
}

export function parseSheetDate(value?: string): number {
  if (!value) return Number.NaN;
  const trimmed = value.trim();
  if (!trimmed) return Number.NaN;

  const european = parseEuropeanDate(trimmed);
  if (!Number.isNaN(european)) {
    return european;
  }

  const native = Date.parse(trimmed);
  return Number.isNaN(native) ? Number.NaN : native;
}

export function formatSheetDate(value?: string): string | undefined {
  if (!value) return undefined;
  const timestamp = parseSheetDate(value);
  if (!Number.isFinite(timestamp)) {
    return value;
  }

  return DISPLAY_DATE_FORMATTER.format(new Date(timestamp));
}
