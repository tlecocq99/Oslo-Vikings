/**
 * Google Sheets API Service
 * Handles authentication, data fetching, and error handling for Google Sheets integration
 */

import { google } from "googleapis";
import { JWT } from "google-auth-library";
import fs from "fs/promises";
import path from "path";
import { loadGoogleSheetsConfig, RATE_LIMIT_CONFIG } from "./googleSheets";
import { cache, CacheKeys, CacheUtils } from "./cache";
import {
  validatePlayersArray,
  rowsToObjects,
  generateDataQualityReport,
  type Player,
  type RawSheetRow,
} from "./dataValidator";

export class GoogleSheetsService {
  private sheets: any;
  private config: ReturnType<typeof loadGoogleSheetsConfig>;
  private authClient: JWT | null = null;
  private isInitialized = false;

  constructor() {
    this.config = loadGoogleSheetsConfig();
  }

  /**
   * Initialize the Google Sheets service with authentication
   * @throws {Error} If authentication fails
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load service account credentials
      const credentialsPath = path.resolve(this.config.serviceAccountPath);
      const credentialsFile = await fs.readFile(credentialsPath, "utf8");
      const credentials = JSON.parse(credentialsFile);

      // Create JWT auth client
      this.authClient = new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: this.config.scopes,
      });

      // Initialize Sheets API
      this.sheets = google.sheets({
        version: this.config.apiVersion,
        auth: this.authClient,
      });

      // Test authentication
      await this.authClient.authorize();

      this.isInitialized = true;
      console.log("Google Sheets service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Google Sheets service:", error);
      throw new Error(
        `Google Sheets initialization failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Fetch data from Google Sheets with retry logic and caching
   * @param {string} range - Sheet range to fetch (e.g., 'A1:Z100' or 'Players!A:Z')
   * @returns {Promise<any[][]>} Raw sheet data
   */
  async fetchSheetData(range?: string): Promise<any[][]> {
    await this.initialize();

    const fullRange = range || `${this.config.sheetName}!A:Z`;
    const cacheKey = CacheKeys.SHEET_DATA(this.config.sheetId, fullRange);

    try {
      return await CacheUtils.getOrSet(
        cacheKey,
        () => this.fetchDataWithRetry(fullRange),
        this.config.cacheTtl
      );
    } catch (error) {
      console.error("Failed to fetch sheet data:", error);

      // Try to return cached data as fallback
      const cachedData = cache.get<any[][]>(cacheKey);
      if (cachedData) {
        console.warn("Using stale cached data due to API failure");
        return cachedData;
      }

      throw error;
    }
  }

  /**
   * Fetch players data with validation and transformation
   * @returns {Promise<Player[]>} Array of validated player objects
   */
  async fetchPlayers(): Promise<Player[]> {
    const cacheKey = CacheKeys.PLAYERS;

    try {
      return await CacheUtils.getOrSet(
        cacheKey,
        async () => {
          const rawData = await this.fetchSheetData();

          if (!rawData || rawData.length === 0) {
            console.warn("No data received from Google Sheets");
            return [];
          }

          // Extract headers and data rows
          const [headers, ...dataRows] = rawData;

          if (!headers || headers.length === 0) {
            throw new Error("No headers found in sheet data");
          }

          // Convert rows to objects
          const rawObjects: RawSheetRow[] = rowsToObjects(headers, dataRows);

          // Validate and transform to player objects
          const players = validatePlayersArray(rawObjects);

          // Generate data quality report
          const qualityReport = generateDataQualityReport(players);
          console.log("Data quality report:", qualityReport);

          if (qualityReport.duplicateNumbers.length > 0) {
            console.warn(
              "Duplicate player numbers found:",
              qualityReport.duplicateNumbers
            );
          }

          return players;
        },
        this.config.cacheTtl
      );
    } catch (error) {
      console.error("Failed to fetch players:", error);

      // Try to return cached players as fallback
      const cachedPlayers = cache.get<Player[]>(cacheKey);
      if (cachedPlayers) {
        console.warn("Using stale cached players due to API failure");
        return cachedPlayers;
      }

      // Return empty array as last resort
      console.warn("No cached data available, returning empty array");
      return [];
    }
  }

  /**
   * Fetch a specific player by ID
   * @param {string} playerId - Player ID to fetch
   * @returns {Promise<Player | null>} Player object or null if not found
   */
  async fetchPlayerById(playerId: string): Promise<Player | null> {
    const cacheKey = CacheKeys.PLAYER_BY_ID(playerId);

    try {
      return await CacheUtils.getOrSet(
        cacheKey,
        async () => {
          const players = await this.fetchPlayers();
          const player = players.find((p) => p.id === playerId);
          return player || null;
        },
        this.config.cacheTtl
      );
    } catch (error) {
      console.error(`Failed to fetch player ${playerId}:`, error);
      return null;
    }
  }

  /**
   * Fetch data with exponential backoff retry logic
   * @param {string} range - Sheet range to fetch
   * @returns {Promise<any[][]>} Raw sheet data
   */
  private async fetchDataWithRetry(range: string): Promise<any[][]> {
    let lastError: Error = new Error("No attempts made");

    for (let attempt = 0; attempt < RATE_LIMIT_CONFIG.maxRetries; attempt++) {
      try {
        console.log(
          `Fetching sheet data (attempt ${attempt + 1}/${
            RATE_LIMIT_CONFIG.maxRetries
          })`
        );

        const response = await this.sheets.spreadsheets.values.get({
          spreadsheetId: this.config.sheetId,
          range: range,
          valueRenderOption: "UNFORMATTED_VALUE",
          dateTimeRenderOption: "FORMATTED_STRING",
        });

        if (!response.data.values) {
          throw new Error("No data returned from Google Sheets");
        }

        console.log(
          `Successfully fetched ${response.data.values.length} rows from sheet`
        );
        return response.data.values;
      } catch (error) {
        lastError = error as Error;
        console.error(
          `Attempt ${attempt + 1} failed:`,
          error instanceof Error ? error.message : "Unknown error"
        );

        // Don't retry on authentication or permission errors
        if ((error as any)?.code === 401 || (error as any)?.code === 403) {
          throw error;
        }

        // Don't retry on the last attempt
        if (attempt === RATE_LIMIT_CONFIG.maxRetries - 1) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          RATE_LIMIT_CONFIG.initialDelayMs *
            Math.pow(RATE_LIMIT_CONFIG.backoffMultiplier, attempt),
          RATE_LIMIT_CONFIG.maxDelayMs
        );

        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    cache.clear();
    console.log("All cached data cleared");
  }

  /**
   * Get cache statistics
   * @returns {object} Cache statistics
   */
  getCacheStats() {
    return cache.getStats();
  }

  /**
   * Validate Google Sheets connection and permissions
   * @returns {Promise<boolean>} True if connection is valid
   */
  async validateConnection(): Promise<boolean> {
    try {
      await this.initialize();

      // Try to fetch just the first row to test access
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.config.sheetId,
        range: `${this.config.sheetName}!A1:Z1`,
      });

      console.log("Google Sheets connection validated successfully");
      return true;
    } catch (error) {
      console.error("Google Sheets connection validation failed:", error);
      return false;
    }
  }

  /**
   * Get sheet metadata and information
   * @returns {Promise<object>} Sheet metadata
   */
  async getSheetInfo(): Promise<{
    title: string;
    sheetCount: number;
    lastUpdated: string;
  }> {
    await this.initialize();

    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.config.sheetId,
      });

      return {
        title: response.data.properties.title,
        sheetCount: response.data.sheets.length,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Failed to get sheet info:", error);
      throw error;
    }
  }
}

// Singleton instance
export const googleSheetsService = new GoogleSheetsService();
