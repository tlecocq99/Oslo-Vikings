/**
 * Data validation and sanitization utilities for player data
 * Ensures Google Sheets data matches expected player object structure
 */

export interface Player {
  id: string;
  name: string;
  position: string;
  number: string;
  height?: string;
  weight?: string;
  photo?: {
    filename: string;
    alt: string;
  };
  bio?: string;
  image?: string;
}

export interface RawSheetRow {
  [key: string]: string | number | undefined;
}

/**
 * Player data validation schema
 */
const REQUIRED_FIELDS = ["id", "name", "position", "number"] as const;
const OPTIONAL_FIELDS = [
  "height",
  "weight",
  "bio",
  "photoFilename",
  "photoAlt",
] as const;

/**
 * Default values for missing or invalid player data
 */
const DEFAULT_PLAYER_VALUES: Partial<Player> = {
  height: "N/A",
  weight: "N/A",
  bio: "",
};

/**
 * Valid positions for player validation
 */
const VALID_POSITIONS = [
  "Quarterback",
  "Running Back",
  "Wide Receiver",
  "Tight End",
  "Offensive Line",
  "Center",
  "Guard",
  "Tackle",
  "Defensive End",
  "Defensive Tackle",
  "Linebacker",
  "Cornerback",
  "Safety",
  "Kicker",
  "Punter",
];

/**
 * Validate and sanitize a single player object
 * @param {RawSheetRow} rawData - Raw data from Google Sheets
 * @param {number} rowIndex - Row index for error reporting
 * @returns {Player | null} Validated player object or null if invalid
 */
export function validatePlayer(
  rawData: RawSheetRow,
  rowIndex: number = 0
): Player | null {
  try {
    // Extract and clean basic fields
    const id = sanitizeString(rawData.ID || rawData.id);
    const name = sanitizeString(rawData.Name || rawData.name);
    const position = sanitizeString(rawData.Position || rawData.position);
    const number = sanitizeString(rawData.Number || rawData.number);

    // Validate required fields
    const validationErrors: string[] = [];

    if (!id) validationErrors.push("ID is required");
    if (!name) validationErrors.push("Name is required");
    if (!position) validationErrors.push("Position is required");
    if (!number) validationErrors.push("Number is required");

    if (validationErrors.length > 0) {
      console.warn(`Row ${rowIndex + 1} validation failed:`, validationErrors);
      return null;
    }

    // Validate position
    if (!VALID_POSITIONS.includes(position)) {
      console.warn(
        `Row ${rowIndex + 1}: Invalid position "${position}". Using as-is.`
      );
    }

    // Validate number is numeric
    if (!/^\d+$/.test(number)) {
      console.warn(
        `Row ${rowIndex + 1}: Number "${number}" is not numeric. Using as-is.`
      );
    }

    // Extract optional fields
    const height =
      sanitizeString(rawData.Height || rawData.height) ||
      DEFAULT_PLAYER_VALUES.height;
    const weight =
      sanitizeString(rawData.Weight || rawData.weight) ||
      DEFAULT_PLAYER_VALUES.weight;
    const bio =
      sanitizeString(rawData.Bio || rawData.bio) || DEFAULT_PLAYER_VALUES.bio;
    const photoFilename = sanitizeString(
      rawData.PhotoFilename || rawData.photoFilename
    );
    const photoAlt = sanitizeString(rawData.PhotoAlt || rawData.photoAlt);

    // Build player object
    const player: Player = {
      id,
      name,
      position,
      number,
      height,
      weight,
      bio,
    };

    // Add photo if available
    if (photoFilename) {
      player.photo = {
        filename: photoFilename,
        alt: photoAlt || `${name} - ${position}`,
      };
      player.image = photoFilename; // For backward compatibility
    }

    return player;
  } catch (error) {
    console.error(
      `Error validating player data at row ${rowIndex + 1}:`,
      error
    );
    return null;
  }
}

/**
 * Validate and transform array of raw sheet data to player objects
 * @param {RawSheetRow[]} rawData - Raw data from Google Sheets
 * @returns {Player[]} Array of validated player objects
 */
export function validatePlayersArray(rawData: RawSheetRow[]): Player[] {
  if (!Array.isArray(rawData)) {
    console.error("Invalid data: Expected array, received:", typeof rawData);
    return [];
  }

  const validPlayers: Player[] = [];
  const errors: string[] = [];

  rawData.forEach((row, index) => {
    const player = validatePlayer(row, index);
    if (player) {
      validPlayers.push(player);
    } else {
      errors.push(`Row ${index + 1}: Failed validation`);
    }
  });

  if (errors.length > 0) {
    console.warn(
      `Player validation completed with ${errors.length} errors:`,
      errors
    );
  }

  console.log(
    `Successfully validated ${validPlayers.length} players from ${rawData.length} rows`
  );
  return validPlayers;
}

/**
 * Sanitize and trim string values
 * @param {any} value - Value to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeString(value: any): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

/**
 * Transform Google Sheets headers to normalized field names
 * @param {string[]} headers - Raw headers from Google Sheets
 * @returns {string[]} Normalized headers
 */
export function normalizeHeaders(headers: string[]): string[] {
  return headers.map((header) => {
    // Remove spaces, convert to camelCase
    return header
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/gi, "");
  });
}

/**
 * Convert sheet rows to objects using headers
 * @param {string[]} headers - Sheet headers
 * @param {any[][]} rows - Sheet data rows
 * @returns {RawSheetRow[]} Array of objects with header keys
 */
export function rowsToObjects(headers: string[], rows: any[][]): RawSheetRow[] {
  const normalizedHeaders = normalizeHeaders(headers);

  return rows.map((row) => {
    const obj: RawSheetRow = {};
    normalizedHeaders.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

/**
 * Data quality checks for the entire dataset
 * @param {Player[]} players - Array of validated players
 * @returns {object} Data quality report
 */
export function generateDataQualityReport(players: Player[]): {
  totalPlayers: number;
  missingPhotos: number;
  missingBios: number;
  duplicateNumbers: string[];
  positionBreakdown: Record<string, number>;
} {
  const report = {
    totalPlayers: players.length,
    missingPhotos: 0,
    missingBios: 0,
    duplicateNumbers: [] as string[],
    positionBreakdown: {} as Record<string, number>,
  };

  const numbers = new Set<string>();
  const duplicates = new Set<string>();

  players.forEach((player) => {
    // Check for missing photos
    if (!player.photo?.filename && !player.image) {
      report.missingPhotos++;
    }

    // Check for missing bios
    if (!player.bio || player.bio.trim() === "") {
      report.missingBios++;
    }

    // Check for duplicate numbers
    if (numbers.has(player.number)) {
      duplicates.add(player.number);
    } else {
      numbers.add(player.number);
    }

    // Position breakdown
    report.positionBreakdown[player.position] =
      (report.positionBreakdown[player.position] || 0) + 1;
  });

  report.duplicateNumbers = Array.from(duplicates);

  return report;
}
