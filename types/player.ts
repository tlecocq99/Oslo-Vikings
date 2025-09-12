export interface PlayerCard {
  name?: string;
  position?: string;
  number?: string;
  height?: string;
  weight?: string;
  photo?: { filename: string; alt: string };
  bio?: string;
  image?: string; // background image URL
  nationality?: string; // ISO country code, e.g., "NO", "US", "SE"
};
export type PlayerCardProps = PlayerCard[];

const VALID_CODES = new Set([
  "NO",
  "US",
  "SE",
  "DK",
  "GB",
  "DE",
  "FR",
  "CA",
  "ES",
  "IT",
]);
function normalizeNationality(raw?: string) {
  if (!raw) return undefined;
  const code = raw.trim().toUpperCase();
  return VALID_CODES.has(code) ? code : undefined;
}
