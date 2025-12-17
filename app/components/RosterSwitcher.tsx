"use client";
import React from "react";
import { Player } from "@/app/types/player";
import RosterClient from "./RosterClient";
import { RosterUIProvider, useRosterUI } from "./RosterUIContext";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { ArrowLeft } from "lucide-react";
import { ROSTER_SIDES } from "@/app/config/positions";
import type { TeamTableOfContentsItem } from "./TeamTableOfContents";
import { useScrollSpy } from "./TeamTableOfContents";

interface RosterSwitcherProps {
  rosters: Record<string, Player[]>;
  anchorId?: string;
  sections?: TeamTableOfContentsItem[];
}

export default function RosterSwitcher({
  rosters,
  anchorId,
  sections = [],
}: RosterSwitcherProps) {
  const rosterKeys = Object.keys(rosters);
  return (
    <RosterUIProvider rosterKeys={rosterKeys}>
      <RosterSwitcherInner
        rosters={rosters}
        anchorId={anchorId}
        sections={sections}
      />
    </RosterUIProvider>
  );
}

function RosterSwitcherInner({
  rosters,
  anchorId,
  sections = [],
}: RosterSwitcherProps) {
  const {
    selectedRoster,
    setSelectedRoster,
    rosterKeys,
    sideFilter,
    setSideFilter,
    viewMode,
    setViewMode,
  } = useRosterUI();
  const current = rosters[selectedRoster] || [];
  const { activeId: activeSectionId, setActiveId: setActiveSectionId } =
    useScrollSpy(sections, 112);
  const hasMultipleRosters = rosterKeys.length > 1;
  const hasSections = sections.length > 0;

  return (
    <section
      id={anchorId ?? "team-roster"}
      className="py-16 bg-white dark:bg-viking-surface transition-colors relative scroll-mt-32"
    >
      {/* Mobile floating menu button */}
      <div className="md:hidden fixed top-1/2 right-0 z-40 -translate-y-1/2">
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex h-20 w-10 items-center justify-center rounded-l-full rounded-r-none bg-viking-red text-white shadow-lg hover:bg-viking-red/90 focus:outline-none focus:ring-2 focus:ring-viking-red/40">
              <ArrowLeft className="w-8 h-8" />
              <span className="sr-only">Open team menu and filters</span>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 flex flex-col">
            <SheetHeader className="p-6 border-b">
              <SheetTitle>Roster Filters</SheetTitle>
            </SheetHeader>
            <div className="p-6 space-y-10 overflow-y-auto">
              {hasSections && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                    Page Sections
                  </h3>
                  <div className="flex flex-col gap-2">
                    {sections.map((section) => {
                      const active = section.id === activeSectionId;
                      return (
                        <SheetClose asChild key={`section-${section.id}`}>
                          <a
                            href={`#${section.id}`}
                            onClick={() => setActiveSectionId(section.id)}
                            className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                              active
                                ? "bg-viking-red text-white border-viking-red shadow"
                                : "bg-gray-100 dark:bg-gray-800 text-viking-charcoal dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                          >
                            {section.label}
                          </a>
                        </SheetClose>
                      );
                    })}
                  </div>
                </div>
              )}
              {hasMultipleRosters && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                    Team
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {rosterKeys.map((rk) => {
                      const active = rk === selectedRoster;
                      return (
                        <button
                          key={`sheet-${rk}`}
                          onClick={() => setSelectedRoster(rk)}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                            active
                              ? "bg-viking-red text-white border-viking-red shadow"
                              : "bg-gray-100 dark:bg-gray-800 text-viking-charcoal dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        >
                          {rk}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                  Side
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["All", ...ROSTER_SIDES].map((side) => {
                    const active = side === sideFilter;
                    return (
                      <button
                        key={`side-${side}`}
                        onClick={() => setSideFilter(side as any)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          active
                            ? "bg-viking-red text-white border-viking-red shadow"
                            : "bg-gray-100 dark:bg-gray-800 text-viking-charcoal dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {side}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                  View
                </h3>
                <div className="flex gap-2">
                  {(["grid", "list"] as const).map((m) => {
                    const active = viewMode === m;
                    return (
                      <button
                        key={`view-${m}`}
                        onClick={() => setViewMode(m)}
                        className={`px-4 py-2 rounded-md text-sm font-medium border transition-all ${
                          active
                            ? "bg-white text-viking-red border-viking-red shadow"
                            : "bg-gray-100 dark:bg-gray-800 text-viking-charcoal dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {m === "grid" ? "Grid" : "List"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-bold text-viking-charcoal mb-6 dark:text-white">
            {selectedRoster} Roster
          </h2>
          {hasMultipleRosters && (
            <div className="hidden md:flex flex-wrap justify-center gap-3 mb-8">
              {rosterKeys.map((rk) => {
                const active = rk === selectedRoster;
                return (
                  <button
                    key={rk}
                    onClick={() => setSelectedRoster(rk)}
                    className={[
                      "px-5 py-2 rounded-full text-sm font-medium transition-all",
                      active
                        ? "bg-viking-red text-white shadow"
                        : "bg-gray-100 text-viking-charcoal hover:bg-gray-200",
                    ].join(" ")}
                  >
                    {rk}
                  </button>
                );
              })}
            </div>
          )}
          {current.length === 0 && (
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Roster data for{" "}
              <span className="font-semibold">{selectedRoster}</span> is not yet
              available.
            </p>
          )}
        </header>
        {current.length > 0 && <RosterClient players={current} />}
      </div>
    </section>
  );
}
