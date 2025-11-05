"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, ExternalLink } from "lucide-react";
import type { UpcomingEvent } from "@/app/types/event";
import type { GameTeam } from "@/app/types/game";

const TEAM_OPTIONS: Array<{ value: "All" | GameTeam; label: string }> = [
  { value: "All", label: "ALL TEAMS" },
  { value: "Main", label: "SENIOR ELITE" },
  { value: "D2", label: "SENIOR D2" },
  { value: "U17", label: "U17" },
  { value: "U14", label: "U14" },
  { value: "flag", label: "FLAG FOOTBALL" },
];
const DEFAULT_TIMEZONE = "Europe/Oslo";

function formatDateLabel(event: UpcomingEvent) {
  const fallbackDate = event.date || event.originalDate || "";
  const fallbackTime = event.time ?? event.originalTime;
  const fallbackLabel = fallbackDate
    ? fallbackTime
      ? `${fallbackDate} @ ${fallbackTime}`
      : fallbackDate
    : fallbackTime ?? "";

  if (!event.startsAt) {
    return fallbackLabel;
  }

  try {
    const date = new Date(event.startsAt);
    if (Number.isNaN(date.getTime())) {
      return fallbackLabel;
    }

    const timeZone = event.timeZone ?? DEFAULT_TIMEZONE;

    const dateLabel = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);

    const timeLabel = fallbackTime
      ? fallbackTime
      : new Intl.DateTimeFormat("en-GB", {
          timeZone,
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }).format(date);

    return timeLabel ? `${dateLabel} @ ${timeLabel}` : dateLabel;
  } catch (error) {
    return fallbackLabel;
  }
}

function eventBadgeLabel(event: UpcomingEvent): string {
  if (event.team && event.team !== "All") {
    return String(event.team).toUpperCase();
  }
  return event.category ? event.category.toUpperCase() : "CLUB EVENT";
}

function isGeneralEvent(event: UpcomingEvent): boolean {
  return !event.team || event.team === "All";
}

interface UpcomingEventsBarProps {
  events: UpcomingEvent[];
}

export default function UpcomingEventsBar({ events }: UpcomingEventsBarProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [teamFilter, setTeamFilter] = React.useState<"All" | GameTeam>("All");

  const sortedEvents = React.useMemo(() => {
    return [...events]
      .filter((event): event is UpcomingEvent => {
        if (!event) return false;
        if (!event.startsAt) {
          console.warn(
            "[upcoming-events] Dropping event without startsAt",
            event
          );
          return false;
        }
        return true;
      })
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }, [events]);

  const filteredEvents = React.useMemo(() => {
    if (teamFilter === "All") {
      return sortedEvents;
    }

    return sortedEvents.filter((event) => {
      if (isGeneralEvent(event)) return true;
      return String(event.team).toLowerCase() === teamFilter.toLowerCase();
    });
  }, [sortedEvents, teamFilter]);

  const scroll = (dir: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const amount = container.clientWidth * 0.8;
    container.scrollTo({
      left:
        dir === "left"
          ? container.scrollLeft - amount
          : container.scrollLeft + amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="hidden md:block w-full bg-gray-50 dark:bg-viking-charcoal/70 border-b border-gray-200 dark:border-gray-700 py-4 transition-colors">
      <div className="w-full px-2 sm:px-4 lg:px-6 flex items-center">
        <div className="mr-10">
          <label
            htmlFor="team-filter"
            className="block text-m font-semibold text-viking-red mb-1"
          >
            Team
          </label>
          <select
            id="team-filter"
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value as any)}
            className="block w-44 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-1 px-2 text-lg text-viking-red focus:outline-none focus:ring-2 focus:ring-viking-red font-teko"
          >
            {TEAM_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <h2 className="font-bold text-viking-red text-lg mr-6 whitespace-nowrap flex items-center gap-1">
          <Calendar className="w-5 h-5" /> Upcoming Events
        </h2>
        <button
          className="hidden md:inline-flex p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-viking-red mr-2 transition-colors"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto scrollbar-hide flex gap-4 h-48"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {filteredEvents.length === 0 ? (
            <div className="min-w-[220px] max-w-xs h-full bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 px-4 py-3 flex flex-col justify-center items-center text-center text-sm text-gray-600 dark:text-gray-300">
              No upcoming events found. Check back soon!
            </div>
          ) : (
            filteredEvents.map((event) => {
              const badgeLabel = eventBadgeLabel(event);
              const dateLabel = formatDateLabel(event);

              return (
                <div
                  key={event.id}
                  className="min-w-[240px] max-w-xs h-full bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 px-4 py-3 flex flex-col gap-2 transition-colors"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="flex items-center justify-between text-[15px] uppercase tracking-wide text-viking-red/80">
                    <span className="font-semibold">{badgeLabel}</span>
                    {event.category && (
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                        {event.category}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                    {dateLabel}
                  </div>

                  {event.isGame ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <span className="text-viking-red">
                          {event.homeTeam ?? "Oslo Vikings"}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500">
                          vs
                        </span>
                        <span className="text-gray-700 dark:text-gray-200">
                          {event.awayTeam ?? "Opponent"}
                        </span>
                      </div>
                      {event.sport && (
                        <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                          {event.sport}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {event.title}
                      </div>
                      {event.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {event.description}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-auto text-xs text-gray-600 dark:text-gray-300">
                    {event.location ? (
                      event.locationHref ? (
                        <Link
                          href={event.locationHref}
                          className="font-semibold text-viking-red hover:underline dark:text-viking-gold"
                        >
                          {event.location}
                        </Link>
                      ) : (
                        event.location
                      )
                    ) : (
                      "Venue TBA"
                    )}
                  </div>

                  {event.link && (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-viking-red hover:underline inline-flex items-center gap-1"
                    >
                      Details <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              );
            })
          )}
        </div>
        <button
          className="hidden md:inline-flex p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-viking-red ml-2 transition-colors"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
