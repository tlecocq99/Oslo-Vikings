"use client";
import React from "react";
import { ROSTER_SIDES, Side } from "@/app/config/positions";

export type SideFilter = "All" | Side;

interface RosterUIContextValue {
  selectedRoster: string;
  setSelectedRoster: (r: string) => void;
  sideFilter: SideFilter;
  setSideFilter: (s: SideFilter) => void;
  viewMode: "grid" | "list";
  setViewMode: (m: "grid" | "list") => void;
  rosterKeys: string[];
}

const RosterUIContext = React.createContext<RosterUIContextValue | undefined>(
  undefined
);

export function RosterUIProvider({
  children,
  rosterKeys,
}: {
  children: React.ReactNode;
  rosterKeys: string[];
}) {
  const [selectedRoster, setSelectedRoster] = React.useState<string>(
    rosterKeys[0]
  );
  const [sideFilter, setSideFilter] = React.useState<SideFilter>("All");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const value = React.useMemo(
    () => ({
      selectedRoster,
      setSelectedRoster,
      sideFilter,
      setSideFilter,
      viewMode,
      setViewMode,
      rosterKeys,
    }),
    [selectedRoster, sideFilter, viewMode, rosterKeys]
  );

  return (
    <RosterUIContext.Provider value={value}>
      {children}
    </RosterUIContext.Provider>
  );
}

export function useRosterUI() {
  const ctx = React.useContext(RosterUIContext);
  if (!ctx) throw new Error("useRosterUI must be used within RosterUIProvider");
  return ctx;
}
