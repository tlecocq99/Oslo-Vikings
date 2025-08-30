/**
 * Individual Player API Route
 * Serves specific player data by ID
 */

import { NextRequest, NextResponse } from "next/server";
import { googleSheetsService } from "../../../lib/googleSheetsService";

export const revalidate = 60; // Cache for 60 seconds

/**
 * GET /api/players/[id]
 * Fetch specific player by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: playerId } = await params;

    if (!playerId) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    console.log(`API: Fetching player with ID: ${playerId}`);

    const player = await googleSheetsService.fetchPlayerById(playerId);

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Add cache headers
    const response = NextResponse.json(player);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=30"
    );
    response.headers.set("X-Player-ID", playerId);

    console.log(`API: Successfully returned player: ${player.name}`);
    return response;
  } catch (error) {
    console.error("API: Error fetching player:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch player",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
