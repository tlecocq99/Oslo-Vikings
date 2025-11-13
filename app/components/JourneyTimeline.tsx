"use client";

import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./JourneyTimeline.module.css";

type Milestone = {
  year: string;
  event: string;
  description: string;
};

const DISPLAY_DURATION = 3000;
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
    options: { offset?: boolean; connector?: "top" | "bottom" } = {}
  ) => {
    const { offset = false, connector = "bottom" } = options;
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
        className={clsx(
          styles.cardWrapper,
          isActive && styles.cardWrapperActive,
          activeIndex !== null && !isActive && styles.cardWrapperDimmed,
          offset && styles.cardOffset
        )}
        style={{
          transform: transformForCard
            ? `translate3d(${transformForCard.translateX}px, ${transformForCard.translateY}px, 0) scale(1.15)`
            : "translate3d(0,0,0) scale(1)",
          transitionDuration: `${TRANSITION_DURATION}ms`,
        }}
      >
        <div className={clsx(styles.card, isActive && styles.cardActive)}>
          <div className={styles.badge}>
            <span className={styles.badgeText}>{milestone.year}</span>
          </div>
          <h3 className={styles.cardTitle}>{milestone.event}</h3>
          <p className={styles.cardDescription}>{milestone.description}</p>
        </div>
        <span
          className={clsx(
            styles.connector,
            connector === "top" ? styles.connectorTop : styles.connectorBottom
          )}
          style={{
            opacity: isActive ? 0 : 1,
            transitionDuration: `${TRANSITION_DURATION}ms`,
          }}
        />
      </div>
    );
  };

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <div className={clsx(styles.row, styles.rowTop)}>
        <div className={clsx(styles.timelineLine, styles.timelineLineBottom)} />
        {firstRow.map((milestone, index) =>
          renderMilestoneCard(milestone, index, { connector: "bottom" })
        )}
      </div>

      <div className={clsx(styles.row, styles.rowBottom)}>
        <div className={clsx(styles.timelineLine, styles.timelineLineTop)} />
        {secondRow.map((milestone, index) =>
          renderMilestoneCard(milestone, index + firstRow.length, {
            offset: true,
            connector: "top",
          })
        )}
      </div>
    </div>
  );
}
