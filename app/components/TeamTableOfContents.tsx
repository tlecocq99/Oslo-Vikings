"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";

export interface TeamTableOfContentsItem {
  id: string;
  label: string;
}

interface TeamTableOfContentsProps {
  items: TeamTableOfContentsItem[];
  /** Pixels to offset when determining the active section */
  offset?: number;
  /** Optional element id; TOC becomes sticky once this element leaves the viewport */
  pinAfterId?: string;
  /** Margin in pixels applied when checking pin trigger */
  pinOffset?: number;
}

const DEFAULT_OFFSET = 128;

interface ScrollSpyState {
  activeId: string;
  setActiveId: (id: string) => void;
}

export function useScrollSpy(
  items: TeamTableOfContentsItem[],
  offset = DEFAULT_OFFSET
): ScrollSpyState {
  const [activeId, setActiveIdState] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (!items.length) {
      setActiveIdState("");
      return;
    }
    if (!items.some((item) => item.id === activeId)) {
      setActiveIdState(items[0]?.id ?? "");
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
      setActiveIdState((prev) => (prev !== currentId ? currentId : prev));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items, offset]);

  const setActiveId = useCallback((id: string) => {
    setActiveIdState(id);
  }, []);

  return { activeId, setActiveId };
}

export default function TeamTableOfContents({
  items,
  offset = DEFAULT_OFFSET,
  pinAfterId,
  pinOffset = offset,
}: TeamTableOfContentsProps) {
  const { activeId, setActiveId } = useScrollSpy(items, offset);
  const [isPinned, setIsPinned] = useState<boolean>(!pinAfterId);

  useEffect(() => {
    if (!pinAfterId) {
      setIsPinned(true);
      return;
    }

    const target = document.getElementById(pinAfterId);
    if (!target) {
      setIsPinned(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPinned(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: `-${pinOffset}px 0px 0px 0px`,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [pinAfterId, pinOffset]);

  if (!items.length) {
    return null;
  }

  return (
    <>
      <nav
        aria-label="Page contents"
        className={clsx(
          "hidden lg:block fixed left-0 top-1/2 z-30 -translate-y-1/2 transition-opacity duration-300", 
          isPinned ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!isPinned}
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
