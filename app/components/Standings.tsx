"use client";
import React from "react";

interface StandingRow {
  team: string;
  conf: string;
  gamesPlayed?: number;
  winLoss?: string;
  pct?: number;
  pointsFor?: number;
  pointsPlusMinus?: number;
  pointsPerGame?: number;
  teamLogo?: string;
}

interface StandingsData {
  updatedAt: string;
  rows: StandingRow[];
  source: string;
}

export default function Standings() {
  const [data, setData] = React.useState<StandingsData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/standings", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: StandingsData = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message || "Failed to load standings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading)
    return <p className="text-center text-gray-500">Loading standings...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!data) return null;
  if (!data.rows.length)
    return (
      <div className="text-center text-sm text-gray-500">
        Standings currently unavailable. Source page may be dynamically
        rendered.
      </div>
    );

  // Derive simple ranking by PCT desc then pointsFor desc
  const displayed = [...data.rows].sort((a, b) => {
    const pctA = a.pct ?? -1;
    const pctB = b.pct ?? -1;
    if (pctB !== pctA) return pctB - pctA;
    const pfA = a.pointsFor ?? -1;
    const pfB = b.pointsFor ?? -1;
    if (pfB !== pfA) return pfB - pfA;
    const diffA = a.pointsPlusMinus ?? -9999;
    const diffB = b.pointsPlusMinus ?? -9999;
    return diffB - diffA;
  });

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h3 className="text-xl font-bold text-viking-charcoal">
          League Standings
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>Updated {new Date(data.updatedAt).toLocaleString()}</span>
          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              fetchData();
            }}
            className="px-2 py-1 rounded border text-viking-red border-viking-red/40 hover:bg-viking-red hover:text-white transition text-[11px] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || refreshing}
            aria-label="Refresh standings"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-viking-charcoal">
            <th className="px-2 py-2 text-left">#</th>
            <th className="px-2 py-2 text-left">Team</th>
            <th className="px-2 py-2 text-center">CONF</th>
            <th className="px-2 py-2 text-center">G</th>
            <th className="px-2 py-2 text-center">W-L</th>
            <th className="px-2 py-2 text-center">PCT</th>
            <th className="px-2 py-2 text-center">P</th>
            <th className="px-2 py-2 text-center">P+-</th>
            <th className="px-2 py-2 text-center">P/G</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((r, idx) => (
            <tr
              key={r.team + idx}
              className="border-b last:border-b-0 hover:bg-gray-50"
            >
              <td className="px-2 py-1 font-semibold">{idx + 1}</td>
              <td className="px-2 py-1">
                <div className="flex items-center gap-2">
                  {r.teamLogo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.teamLogo}
                      alt={r.team + " logo"}
                      className="h-6 w-6 object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <span>{r.team}</span>
                </div>
              </td>
              <td className="px-2 py-1 text-center">{r.conf || "-"}</td>
              <td className="px-2 py-1 text-center">{r.gamesPlayed ?? "-"}</td>
              <td className="px-2 py-1 text-center">{r.winLoss ?? "-"}</td>
              <td className="px-2 py-1 text-center">
                {r.pct !== undefined
                  ? r.pct.toFixed(3).replace(/^0+/, "")
                  : "-"}
              </td>
              <td className="px-2 py-1 text-center">{r.pointsFor ?? "-"}</td>
              <td className="px-2 py-1 text-center">
                {r.pointsPlusMinus !== undefined
                  ? `${r.pointsPlusMinus > 0 ? "+" : ""}${r.pointsPlusMinus}`
                  : "-"}
              </td>
              <td className="px-2 py-1 text-center">
                {r.pointsPerGame !== undefined
                  ? Number.isInteger(r.pointsPerGame)
                    ? r.pointsPerGame
                    : r.pointsPerGame.toFixed(1)
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-gray-500">
        Source:{" "}
        <a
          className="underline"
          href={data.source}
          target="_blank"
          rel="noreferrer"
        >
          superserien.se
        </a>
      </p>
    </div>
  );
}
