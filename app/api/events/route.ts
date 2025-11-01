import { NextResponse } from "next/server";
import { fetchUpcomingEvents } from "@/app/services/fetchUpcomingEvents";

export const revalidate = 900; // 15 minutes

export async function GET() {
  try {
    const events = await fetchUpcomingEvents();
    return NextResponse.json(events, { status: 200 });
  } catch (err: any) {
    console.error("[api/events] Failed to fetch events", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to load events" },
      { status: 500 }
    );
  }
}
