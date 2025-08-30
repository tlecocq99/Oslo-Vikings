/**
 * Players API Route
 * Serves player data from Google Sheets with caching and error handling
 */

import { NextRequest, NextResponse } from "next/server";
import { googleSheetsService } from "../../lib/googleSheetsService";

export const revalidate = 60; // Cache for 60 seconds

/**
 * GET /api/players
 * Fetch all players from Google Sheets
 */
export async function GET(request: NextRequest) {
  try {
    console.log("API: Fetching players from Google Sheets");

    const players = await googleSheetsService.fetchPlayers();

    // Add cache headers
    const response = NextResponse.json(players);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=30"
    );
    response.headers.set("X-Players-Count", players.length.toString());
    response.headers.set(
      "X-Cache-Stats",
      JSON.stringify(googleSheetsService.getCacheStats())
    );

    console.log(`API: Successfully returned ${players.length} players`);
    return response;
  } catch (error) {
    console.error("API: Error fetching players:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch players",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/players/refresh
 * Force refresh cache (for admin use)
 */
export async function POST(request: NextRequest) {
  try {
    // Clear cache and fetch fresh data
    googleSheetsService.clearCache();
    const players = await googleSheetsService.fetchPlayers();

    console.log(`API: Cache refreshed, fetched ${players.length} players`);

    return NextResponse.json({
      success: true,
      message: "Cache refreshed successfully",
      playersCount: players.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API: Error refreshing cache:", error);

    return NextResponse.json(
      {
        error: "Failed to refresh cache",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
