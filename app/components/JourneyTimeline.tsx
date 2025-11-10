"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Milestone = {
  year: string;
  event: string;
  description: string;
};

const DISPLAY_DURATION = 5000;
const TRANSITION_DURATION = 800;
const CYCLE_DURATION = DISPLAY_DURATION + TRANSITION_DURATION;

interface JourneyTimelineProps {
  milestones: Milestone[];
}

export function JourneyTimeline({ milestones }: JourneyTimelineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeTransform, setActiveTransform] = useState<{
    index: number;
    translateX: number;
    translateY: number;
  } | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { firstRow, secondRow } = useMemo(() => {
    const midpoint = Math.ceil(milestones.length / 2);
    return {
      firstRow: milestones.slice(0, midpoint),
      secondRow: milestones.slice(midpoint),
    };
  }, [milestones]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isInView || milestones.length === 0) {
      setActiveIndex(null);
      setActiveTransform(null);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setActiveIndex(0);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        if (prev === null) return 0;
        const next = prev + 1;
        if (next >= milestones.length) {
          return 0;
        }
        return next;
      });
    }, CYCLE_DURATION);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isInView, milestones.length]);

  useEffect(() => {
    if (activeIndex === null) {
      setActiveTransform(null);
      return;
    }

    const element = cardRefs.current[activeIndex];
    const containerEl = containerRef.current;
    if (!element || !containerEl) return;

    const computeTransform = () => {
      const previousTransform = element.style.transform;
      element.style.transform = "none";
      const rect = element.getBoundingClientRect();
      element.style.transform = previousTransform;

      const containerRect = containerEl.getBoundingClientRect();
      const sectionCenterX = containerRect.left + containerRect.width / 2;
      const sectionCenterY = containerRect.top + containerRect.height / 2;
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      setActiveTransform({
        index: activeIndex,
        translateX: sectionCenterX - cardCenterX,
        translateY: sectionCenterY - cardCenterY,
      });
    };

    computeTransform();

    window.addEventListener("resize", computeTransform);
    return () => {
      window.removeEventListener("resize", computeTransform);
    };
  }, [activeIndex]);

  const renderMilestoneCard = (
    milestone: Milestone,
    globalIndex: number,
    options: { extraClasses?: string; connector?: "top" | "bottom" } = {}
  ) => {
    const { extraClasses = "", connector = "bottom" } = options;
    const isActive = activeIndex === globalIndex;
    const transformForCard =
      isActive && activeTransform?.index === globalIndex
        ? activeTransform
        : null;

    return (
      <div
        key={`${milestone.year}-${milestone.event}`}
        ref={(node) => {
          cardRefs.current[globalIndex] = node;
        }}
        className={`relative flex-none basis-[240px] transition-transform duration-500 ease-in-out ${
          isActive ? "z-30" : "z-10"
        } ${activeIndex !== null && !isActive ? "opacity-60" : "opacity-100"}`}
        style={{
          transform: transformForCard
            ? `translate3d(${transformForCard.translateX}px, ${transformForCard.translateY}px, 0) scale(1.15)`
            : "translate3d(0,0,0) scale(1)",
          transitionDuration: `${TRANSITION_DURATION}ms`,
        }}
      >
        <div
          className={`mx-auto flex h-full w-full max-w-[240px] min-h-[240px] flex-col items-center justify-between rounded-xl border bg-white p-6 text-center shadow-md transition-all duration-500 dark:bg-viking-charcoal/70 ${
            isActive
              ? "border-viking-red shadow-xl brightness-110"
              : "border-gray-200 dark:border-gray-700"
          } ${extraClasses}`.trim()}
        >
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-viking-gold">
            <span className="text-lg font-bold text-viking-charcoal">
              {milestone.year}
            </span>
          </div>
          <h3 className="text-lg font-bold text-viking-charcoal dark:text-gray-100 mb-2">
            {milestone.event}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {milestone.description}
          </p>
        </div>
        <span
          className={`pointer-events-none absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-viking-red transition-transform dark:border-viking-charcoal ${
            connector === "top"
              ? "-translate-y-1/2 top-4"
              : "translate-y-1/2 bottom-4"
          }`}
          style={{
            opacity: isActive ? 0 : 1,
            transitionDuration: `${TRANSITION_DURATION}ms`,
          }}
        />
      </div>
    );
  };

  return (
    <div ref={containerRef} className="hidden lg:flex flex-col gap-14 relative">
      <div className="relative flex w-full items-end justify-center gap-8 pb-12">
        <div className="pointer-events-none absolute bottom-4 left-0 right-0 h-0.5 bg-viking-red/50 dark:bg-viking-red/60" />
        {firstRow.map((milestone, index) =>
          renderMilestoneCard(milestone, index, { connector: "bottom" })
        )}
      </div>

      <div className="relative flex w-full items-start justify-center gap-8 pt-12">
        <div className="pointer-events-none absolute top-4 left-0 right-0 h-0.5 bg-viking-red/50 dark:bg-viking-red/60" />
        {secondRow.map((milestone, index) =>
          renderMilestoneCard(milestone, index + firstRow.length, {
            extraClasses: "mt-6",
            connector: "top",
          })
        )}
      </div>
    </div>
  );
}
