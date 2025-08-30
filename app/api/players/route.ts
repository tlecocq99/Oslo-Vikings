import { NextResponse } from "next/server";
import { fetchPlayersCached } from "@/lib/googleSheets";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const position = url.searchParams.get("position")?.toLowerCase();
    const q = url.searchParams.get("q")?.toLowerCase();

    let data = await fetchPlayersCached();

    if (position) {
      data = data.filter((p) => p.position?.toLowerCase() === position);
    }
    if (q) {
      const contains = (s?: string) => (s || "").toLowerCase().includes(q);
      data = data.filter((p) =>
        [
          p.name,
          p.position,
          p.number,
          p.height,
          p.weight,
          p.bio,
          p.image,
          p.photo?.filename,
          p.photo?.alt,
        ].some(contains)
      );
    }

    // CDN cache for Vercel (survives between serverless invocations)
    const ttl = Number(process.env.CACHE_TTL ?? 60);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `s-maxage=${ttl}, stale-while-revalidate=${ttl * 3}`,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to fetch players", detail: e?.message },
      { status: 500 }
    );
  }
}
