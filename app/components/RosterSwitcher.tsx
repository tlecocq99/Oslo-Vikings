"use client";
import React from "react";
import { Player } from "@/app/types/player";
import RosterClient from "./RosterClient";

interface RosterSwitcherProps {
  rosters: Record<string, Player[]>;
}

export default function RosterSwitcher({ rosters }: RosterSwitcherProps) {
  const rosterKeys = Object.keys(rosters);
  const [selectedRoster, setSelectedRoster] = React.useState<string>(rosterKeys[0]);
  const current = rosters[selectedRoster] || [];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-bold text-viking-charcoal mb-6">{selectedRoster} Roster</h2>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {rosterKeys.map((rk) => {
              const active = rk === selectedRoster;
              return (
                <button
                  key={rk}
                  onClick={() => setSelectedRoster(rk)}
                  className={[
                    "px-5 py-2 rounded-full text-sm font-medium transition-all",
                    active ? "bg-viking-red text-white shadow" : "bg-gray-100 text-viking-charcoal hover:bg-gray-200",
                  ].join(" ")}
                >
                  {rk}
                </button>
              );
            })}
          </div>
          {current.length === 0 && (
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Roster data for <span className="font-semibold">{selectedRoster}</span> is not yet available.
            </p>
          )}
        </header>
        {current.length > 0 && <RosterClient players={current} />}
      </div>
    </section>
  );
}
