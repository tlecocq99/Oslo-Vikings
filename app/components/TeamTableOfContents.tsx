"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

export interface TeamTableOfContentsItem {
  id: string;
  label: string;
}

interface TeamTableOfContentsProps {
  items: TeamTableOfContentsItem[];
  /** Pixels to offset when determining the active section */
  offset?: number;
}

const DEFAULT_OFFSET = 128;

export default function TeamTableOfContents({
  items,
  offset = DEFAULT_OFFSET,
}: TeamTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (!items.length) {
      setActiveId("");
      return;
    }
    if (!items.some((item) => item.id === activeId)) {
      setActiveId(items[0]?.id ?? "");
    }
  }, [items, activeId]);

  useEffect(() => {
    if (!items.length) {
      return;
    }

    const handleScroll = () => {
      let currentId = items[0]?.id ?? "";
      for (const item of items) {
        const element = document.getElementById(item.id);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        if (rect.top - offset <= 0) {
          currentId = item.id;
        }
      }
      setActiveId((prev) => (prev !== currentId ? currentId : prev));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items, offset]);

  if (!items.length) {
    return null;
  }

  return (
    <>
      <nav
        aria-label="Page contents"
        className="lg:hidden border-y border-gray-200/70 dark:border-gray-700/60 bg-white/95 dark:bg-viking-charcoal/85 backdrop-blur py-3"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-3 overflow-x-auto text-sm font-medium">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={activeId === item.id ? "location" : undefined}
                  onClick={() => setActiveId(item.id)}
                  className={clsx(
                    "inline-flex items-center rounded-full px-3 py-1.5 transition-colors whitespace-nowrap",
                    activeId === item.id
                      ? "bg-viking-red text-white shadow"
                      : "bg-gray-100 text-viking-charcoal dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <nav
        aria-label="Page contents"
        className="hidden lg:block fixed left-0 top-1/2 z-30 -translate-y-1/2"
      >
        <div className="w-56 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/95 dark:bg-viking-charcoal/90 shadow-lg backdrop-blur">
          <div className="px-5 pt-5 pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-viking-red/80">
              Page Contents
            </p>
          </div>
          <ul className="py-4 space-y-1">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={activeId === item.id ? "location" : undefined}
                  onClick={() => setActiveId(item.id)}
                  className={clsx(
                    "block px-5 py-3 text-sm font-semibold transition-all border-l-2",
                    activeId === item.id
                      ? "border-viking-red text-viking-red"
                      : "border-transparent text-gray-600 dark:text-gray-300 hover:border-viking-red/40 hover:text-viking-red"
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
