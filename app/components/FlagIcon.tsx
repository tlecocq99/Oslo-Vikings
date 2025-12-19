"use client";
import * as React from "react";
// Import a subset of flags. Add more as needed.
// Library ships plain ESM; React builds are at /react/3x2
// @ts-ignore - types not provided by the package
import {
  NO,
  US,
  SE,
  DK,
  GB,
  DE,
  FR,
  CA,
  ES,
  IT,
  NL,
  PL,
  UA,
  TR,
} from "country-flag-icons/react/3x2";

// Loosen the flag component type to align with library signature
type FlagComponent = React.ComponentType<any>;

// Explicit ISO alpha‑2 -> component map (extend as you import more flags)
const CODE_MAP: Record<string, FlagComponent> = {
  NO,
  US,
  SE,
  DK,
  GB,
  DE,
  FR,
  CA,
  ES,
  IT,
  NL,
  PL,
  UA,
  TR,
};

// Map common nationality strings (case-insensitive) to ISO alpha-2 codes
const NAME_TO_CODE: Record<string, string> = {
  norway: "NO",
  norwegian: "NO",
  usa: "US",
  american: "US",
  unitedstates: "US",
  sweden: "SE",
  swedish: "SE",
  denmark: "DK",
  danish: "DK",
  england: "GB",
  britain: "GB",
  british: "GB",
  uk: "GB",
  germany: "DE",
  german: "DE",
  france: "FR",
  french: "FR",
  canada: "CA",
  canadian: "CA",
  spain: "ES",
  spanish: "ES",
  italy: "IT",
  italian: "IT",
  netherlands: "NL",
  dutch: "NL",
  poland: "PL",
  polish: "PL",
  ukraine: "UA",
  ukrainian: "UA",
  turkey: "TR",
  turkish: "TR",
  turkiye: "TR",
  trkiye: "TR",
};

export interface FlagIconProps {
  nationality?: string; // raw input (e.g., "Norwegian" or "NO")
  className?: string;
  title?: string;
}

export function FlagIcon({
  nationality,
  className = "w-5 h-5",
  title,
}: FlagIconProps) {
  if (!nationality) return null;
  const raw = nationality.trim();
  let code = raw.toUpperCase();
  if (code.length !== 2) {
    const key = raw.toLowerCase().replace(/[^a-z]/g, "");
    const mapped = NAME_TO_CODE[key];
    if (mapped) code = mapped;
  }
  const Comp = CODE_MAP[code];
  if (!Comp) return null; // silently fail if not in our subset
  return (
    <Comp className={className} role="img" aria-label={title || code}>
      {/* Provide accessible text for screen readers */}
      <title>{title || code}</title>
    </Comp>
  );
}

export default FlagIcon;
