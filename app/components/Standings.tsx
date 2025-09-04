"use client";
import React from "react";

interface StandingRow {
  rank: number;
  team: string;
  gamesPlayed?: number;
  wins?: number;
  losses?: number;
  pointsFor?: number;
  pointsAgainst?: number;
  points?: number;
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

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/standings", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: StandingsData = await res.json();
        if (!cancelled) {
          setData(json);
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Failed to load standings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading standings...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!data) return null;

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-viking-charcoal">League Standings</h3>
        <span className="text-xs text-gray-500">Updated {new Date(data.updatedAt).toLocaleString()}</span>
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-viking-charcoal">
            <th className="px-2 py-2 text-left">#</th>
            <th className="px-2 py-2 text-left">Team</th>
            <th className="px-2 py-2 text-center">GP</th>
            <th className="px-2 py-2 text-center">W</th>
            <th className="px-2 py-2 text-center">L</th>
            <th className="px-2 py-2 text-center">PF</th>
            <th className="px-2 py-2 text-center">PA</th>
            <th className="px-2 py-2 text-center">Pts</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((r) => (
            <tr key={r.rank} className="border-b last:border-b-0 hover:bg-gray-50">
              <td className="px-2 py-1 font-semibold">{r.rank}</td>
              <td className="px-2 py-1">{r.team}</td>
              <td className="px-2 py-1 text-center">{r.gamesPlayed ?? "-"}</td>
              <td className="px-2 py-1 text-center">{r.wins ?? "-"}</td>
              <td className="px-2 py-1 text-center">{r.losses ?? "-"}</td>
              <td className="px-2 py-1 text-center">{r.pointsFor ?? "-"}</td>
              <td className="px-2 py-1 text-center">{r.pointsAgainst ?? "-"}</td>
              <td className="px-2 py-1 text-center">{r.points ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-gray-500">Source: <a className="underline" href={data.source} target="_blank" rel="noreferrer">superserien.se</a></p>
    </div>
  );
}
