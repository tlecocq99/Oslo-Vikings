/**
 * Google Sheets API Configuration
 * Handles environment variables and API settings
 */

export interface GoogleSheetsConfig {
  sheetId: string;
  sheetName: string;
  cacheTtl: number;
  serviceAccountPath: string;
  apiVersion: "v4";
  scopes: string[];
}

/**
 * Load and validate Google Sheets configuration from environment variables
 * @returns {GoogleSheetsConfig} Configuration object
 * @throws {Error} If required environment variables are missing
 */
export function loadGoogleSheetsConfig(): GoogleSheetsConfig {
  const sheetId = process.env.SHEET_ID;
  const sheetName = process.env.SHEET_NAME || "Players";
  const cacheTtl = parseInt(process.env.CACHE_TTL || "60", 10);
  const serviceAccountPath =
    process.env.SERVICE_ACCOUNT_JSON || "./gsa-key.json";

  if (!sheetId) {
    throw new Error("SHEET_ID environment variable is required");
  }

  if (!serviceAccountPath) {
    throw new Error("SERVICE_ACCOUNT_JSON environment variable is required");
  }

  return {
    sheetId,
    sheetName,
    cacheTtl,
    serviceAccountPath,
    apiVersion: "v4",
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  };
}

/**
 * Default configuration for fallback scenarios
 */
export const DEFAULT_CONFIG: Partial<GoogleSheetsConfig> = {
  sheetName: "Players",
  cacheTtl: 60,
  apiVersion: "v4",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
};

/**
 * API rate limiting configuration
 */
export const RATE_LIMIT_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 8000,
  backoffMultiplier: 2,
};
