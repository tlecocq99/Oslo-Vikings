import { NextResponse } from "next/server";
import { fetchPlayersCached, findPlayer } from "@/lib/googleSheets";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const players = await fetchPlayersCached();
    const found = findPlayer(players, params.id);
    if (!found)
      return NextResponse.json({ error: "Player not found" }, { status: 404 });

    const ttl = Number(process.env.CACHE_TTL ?? 60);
    return NextResponse.json(found, {
      headers: {
        "Cache-Control": `s-maxage=${ttl}, stale-while-revalidate=${ttl * 3}`,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to load player", detail: e?.message },
      { status: 500 }
    );
  }
}
