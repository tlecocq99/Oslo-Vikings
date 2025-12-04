"use client";

import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
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

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, [query]);

  return matches;
}

function MilestoneCardContent({
  milestone,
  isActive,
  variant,
}: {
  milestone: Milestone;
  isActive: boolean;
  variant: "desktop" | "mobile";
}) {
  return (
    <div
      className={clsx(
        styles.card,
        isActive && styles.cardActive,
        variant === "mobile" && styles.cardMobile
      )}
    >
      <div className={styles.badge}>
        <span className={styles.badgeText}>{milestone.year}</span>
      </div>
      <h3 className={styles.cardTitle}>{milestone.event}</h3>
      <p className={styles.cardDescription}>{milestone.description}</p>
    </div>
  );
}

export function JourneyTimeline({ milestones }: JourneyTimelineProps) {
  const isCompactView = useMediaQuery("(max-width: 1249px)");
  const isMobileView = useMediaQuery("(max-width: 640px)");
  const chunkSize = isMobileView ? 1 : 2;

  if (isCompactView) {
    return <TimelineCarousel milestones={milestones} chunkSize={chunkSize} />;
  }

  return <DesktopTimeline milestones={milestones} />;
}

function DesktopTimeline({ milestones }: JourneyTimelineProps) {
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
    const scaleValue = isActive ? 1.15 : 0.92;
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
            ? `translate3d(${transformForCard.translateX}px, ${transformForCard.translateY}px, 0) scale(${scaleValue})`
            : `translate3d(0,0,0) scale(${scaleValue})`,
          transitionDuration: `${TRANSITION_DURATION}ms`,
        }}
      >
        <MilestoneCardContent
          milestone={milestone}
          isActive={isActive}
          variant="desktop"
        />
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
      <div
        className={clsx(styles.row, styles.rowTop)}
        style={{ "--cards-per-row": String(firstRow.length) } as CSSProperties}
      >
        <div className={clsx(styles.timelineLine, styles.timelineLineBottom)} />
        {firstRow.map((milestone, index) =>
          renderMilestoneCard(milestone, index, { connector: "bottom" })
        )}
      </div>

      <div
        className={clsx(styles.row, styles.rowBottom)}
        style={{ "--cards-per-row": String(secondRow.length) } as CSSProperties}
      >
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

interface TimelineCarouselProps {
  milestones: Milestone[];
  chunkSize: number;
}

function TimelineCarousel({ milestones, chunkSize }: TimelineCarouselProps) {
  const slides = useMemo(() => {
    const size = Math.max(1, chunkSize);
    const chunks: Milestone[][] = [];
    for (let i = 0; i < milestones.length; i += size) {
      chunks.push(milestones.slice(i, i + size));
    }
    if (chunks.length === 0 && milestones.length === 0) {
      return [] as Milestone[][];
    }
    return chunks.length > 0 ? chunks : milestones.length ? [milestones] : [];
  }, [chunkSize, milestones]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const [viewportWidth, setViewportWidth] = useState(1);

  const slideCount = slides.length;
  const hasMultipleSlides = slideCount > 1;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateWidth = () => {
      const width = viewportRef.current?.getBoundingClientRect().width ?? 1;
      setViewportWidth(width);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [chunkSize, slideCount]);

  useEffect(() => {
    if (!hasMultipleSlides || isDragging) return;
    const timer = window.setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [currentSlide, hasMultipleSlides, isDragging, slideCount]);

  useEffect(() => {
    if (currentSlide >= slideCount) {
      setCurrentSlide(0);
    }
  }, [currentSlide, slideCount]);

  const finishDrag = () => {
    if (!isDragging) return;

    const threshold = viewportWidth * 0.15;
    let nextSlide = currentSlide;
    if (dragOffset > threshold) {
      nextSlide = (currentSlide - 1 + slideCount) % slideCount;
    } else if (dragOffset < -threshold) {
      nextSlide = (currentSlide + 1) % slideCount;
    }

    setCurrentSlide(nextSlide);
    setIsDragging(false);
    setDragOffset(0);

    const viewport = viewportRef.current;
    if (
      viewport &&
      pointerIdRef.current !== null &&
      viewport.hasPointerCapture(pointerIdRef.current)
    ) {
      viewport.releasePointerCapture(pointerIdRef.current);
    }
    pointerIdRef.current = null;
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    if (slideCount <= 1) {
      return;
    }

    const viewport = viewportRef.current;
    if (!viewport) return;

    pointerIdRef.current = event.pointerId;
    startXRef.current = event.clientX;
    setIsDragging(true);
    setDragOffset(0);
    viewport.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setDragOffset(event.clientX - startXRef.current);
  };

  const handlePointerUp = () => {
    finishDrag();
  };

  const handlePointerLeave = () => {
    finishDrag();
  };

  const handlePointerCancel = () => {
    finishDrag();
  };

  if (slideCount === 0) {
    return null;
  }

  const dragPercent = viewportWidth ? (dragOffset / viewportWidth) * 100 : 0;
  const translatePercent =
    -(currentSlide * 100) + (isDragging ? dragPercent : 0);

  return (
    <div className={styles.mobileContainer}>
      <div
        ref={viewportRef}
        className={styles.mobileViewport}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerCancel}
      >
        <div
          className={styles.mobileSlides}
          style={{
            transform: `translateX(${translatePercent}%)`,
            transition: isDragging ? "none" : "transform 500ms ease",
          }}
        >
          {slides.map((slide, index) => (
            <div key={`timeline-slide-${index}`} className={styles.mobileSlide}>
              {slide.map((milestone, cardIndex) => (
                <MilestoneCardContent
                  key={`${milestone.year}-${milestone.event}-${cardIndex}`}
                  milestone={milestone}
                  isActive={index === currentSlide}
                  variant="mobile"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {hasMultipleSlides ? (
        <div className={styles.mobileDots}>
          {slides.map((_, index) => (
            <button
              key={`timeline-dot-${index}`}
              type="button"
              className={clsx(
                styles.mobileDot,
                index === currentSlide && styles.mobileDotActive
              )}
              aria-label={`Go to timeline slide ${index + 1}`}
              aria-current={index === currentSlide}
              onClick={() => {
                setCurrentSlide(index);
                setDragOffset(0);
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
