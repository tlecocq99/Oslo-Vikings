import { fetchStandings } from "@/app/services/fetchStandings";
import { NextResponse } from "next/server";

export const revalidate = 1800; // 30 min

export async function GET() {
  try {
    const data = await fetchStandings();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to load standings" },
      { status: 500 }
    );
  }
}
