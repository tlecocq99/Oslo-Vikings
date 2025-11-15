"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  PointerEvent as ReactPointerEvent,
  MouseEvent as ReactMouseEvent,
  KeyboardEvent as ReactKeyboardEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Partner } from "@/app/types/partner";

interface PartnersCarouselProps {
  partners: Partner[];
}

export default function PartnersCarousel({ partners }: PartnersCarouselProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0);
  const [isMobileDragging, setIsMobileDragging] = useState(false);
  const [mobileDragOffset, setMobileDragOffset] = useState(0);
  const [mobileLoopIndex, setMobileLoopIndex] = useState(0);
  const [suppressMobileTransition, setSuppressMobileTransition] =
    useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const mobileSlidesContainerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const lastTimestampRef = useRef<number | null>(null);
  const scrollRemainderRef = useRef(0);
  const mobileDragStateRef = useRef<{
    startX: number;
    viewportWidth: number;
    pointerId: number | null;
  }>({ startX: 0, viewportWidth: 1, pointerId: null });
  const mobileTouchStateRef = useRef<{
    startX: number;
    startY: number;
    viewportWidth: number;
    isTracking: boolean;
    isSwiping: boolean;
  }>({
    startX: 0,
    startY: 0,
    viewportWidth: 1,
    isTracking: false,
    isSwiping: false,
  });
  const pendingLoopIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const baseItems = useMemo(
    () =>
      partners.map((partner, originalIndex) => ({
        partner,
        originalIndex,
      })),
    [partners]
  );

  const extendedPartners = useMemo(
    () => baseItems.concat(baseItems),
    [baseItems]
  );

  const mobileSlides = useMemo(() => {
    if (baseItems.length === 0) return [] as Array<typeof baseItems>;

    const slides: Array<typeof baseItems> = [];
    for (let i = 0; i < baseItems.length; i += 2) {
      const first = baseItems[i];
      const second = baseItems[(i + 1) % baseItems.length];
      slides.push([first, second]);
    }
    return slides;
  }, [baseItems]);

  const baseLength = partners.length || 1;
  const shouldPause = isDragging || activeKey !== null;
  const autoScrollSpeed = isMobile ? 28 : 40; // pixels per second
  const mobileSlidesLength = mobileSlides.length;
  const hasMultipleMobileSlides = mobileSlidesLength > 1;

  const advanceMobileSlide = useCallback(
    (delta: number) => {
      if (!mobileSlidesLength) return;
      if (delta === 0) return;

      setCurrentMobileSlide((prev) => {
        const base = mobileSlidesLength;
        return (prev + delta + base) % base;
      });

      if (hasMultipleMobileSlides) {
        setMobileLoopIndex((prev) => prev + delta);
      }
    },
    [hasMultipleMobileSlides, mobileSlidesLength]
  );

  const goToMobileSlide = useCallback(
    (index: number) => {
      if (!mobileSlidesLength) return;

      const normalized =
        ((index % mobileSlidesLength) + mobileSlidesLength) %
        mobileSlidesLength;
      setCurrentMobileSlide(normalized);

      if (hasMultipleMobileSlides) {
        setMobileLoopIndex(mobileSlidesLength + normalized);
      }
    },
    [hasMultipleMobileSlides, mobileSlidesLength]
  );

  useEffect(() => {
    if (isMobile) {
      return;
    }

    const viewport = viewportRef.current;
    if (!viewport || !partners.length) {
      return;
    }

    let animationFrame: number;
    scrollRemainderRef.current = 0;
    lastTimestampRef.current = null;

    const step = (timestamp: number) => {
      const node = viewportRef.current;
      if (!node) {
        return;
      }

      const halfWidth = node.scrollWidth / 2;
      if (!shouldPause && halfWidth > 0) {
        const lastTimestamp = lastTimestampRef.current ?? timestamp;
        const delta = timestamp - lastTimestamp;
        lastTimestampRef.current = timestamp;
        const distance = (autoScrollSpeed * delta) / 1000;
        const total = distance + scrollRemainderRef.current;
        const wholePixels = Math.floor(total);
        scrollRemainderRef.current = total - wholePixels;
        if (wholePixels !== 0) {
          node.scrollLeft += wholePixels;
          while (node.scrollLeft >= halfWidth) {
            node.scrollLeft -= halfWidth;
          }
        }
      } else {
        lastTimestampRef.current = timestamp;
      }

      animationFrame = window.requestAnimationFrame(step);
    };

    animationFrame = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [autoScrollSpeed, isMobile, partners.length, shouldPause]);

  useEffect(() => {
    if (!isMobile || !hasMultipleMobileSlides) {
      return;
    }

    if (activeKey || isMobileDragging) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveKey(null);
      advanceMobileSlide(1);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [
    activeKey,
    advanceMobileSlide,
    currentMobileSlide,
    isMobile,
    isMobileDragging,
    hasMultipleMobileSlides,
  ]);

  useEffect(() => {
    if (mobileSlidesLength === 0) {
      setCurrentMobileSlide(0);
      setMobileLoopIndex(0);
      setActiveKey(null);
      return;
    }

    setCurrentMobileSlide((prev) => prev % mobileSlidesLength);
    if (hasMultipleMobileSlides) {
      setMobileLoopIndex((prev) => {
        const normalized =
          ((prev % mobileSlidesLength) + mobileSlidesLength) %
          mobileSlidesLength;
        return mobileSlidesLength + normalized;
      });
    } else {
      setMobileLoopIndex(0);
    }
  }, [mobileSlidesLength, hasMultipleMobileSlides]);

  useEffect(() => {
    if (isMobile) {
      setCurrentMobileSlide(0);
      setActiveKey(null);
      if (hasMultipleMobileSlides) {
        setMobileLoopIndex(mobileSlidesLength);
      } else {
        setMobileLoopIndex(0);
      }
    }
  }, [isMobile, hasMultipleMobileSlides, mobileSlidesLength]);

  useEffect(() => {
    if (!hasMultipleMobileSlides) {
      pendingLoopIndexRef.current = null;
      return;
    }

    const base = mobileSlidesLength;
    const minIndex = base;
    const maxIndex = base * 2 - 1;

    if (mobileLoopIndex < minIndex) {
      pendingLoopIndexRef.current = mobileLoopIndex + base;
    } else if (mobileLoopIndex > maxIndex) {
      pendingLoopIndexRef.current = mobileLoopIndex - base;
    } else {
      pendingLoopIndexRef.current = null;
    }
  }, [mobileLoopIndex, hasMultipleMobileSlides, mobileSlidesLength]);

  useEffect(() => {
    if (!hasMultipleMobileSlides || !isMobile) {
      return;
    }

    const container = mobileSlidesContainerRef.current;
    if (!container) return;

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName !== "transform") return;
      const targetIndex = pendingLoopIndexRef.current;
      if (targetIndex == null) return;

      setSuppressMobileTransition(true);
      setMobileLoopIndex(targetIndex);
      pendingLoopIndexRef.current = null;
    };

    container.addEventListener("transitionend", handleTransitionEnd);

    return () => {
      container.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [hasMultipleMobileSlides, isMobile, mobileSlidesLength]);

  useEffect(() => {
    if (!suppressMobileTransition) return;
    const handle = window.requestAnimationFrame(() => {
      setSuppressMobileTransition(false);
    });
    return () => window.cancelAnimationFrame(handle);
  }, [suppressMobileTransition]);

  const wrapScrollPosition = (node: HTMLDivElement) => {
    const halfWidth = node.scrollWidth / 2;
    if (halfWidth === 0) return;

    let normalized = node.scrollLeft % halfWidth;
    if (normalized < 0) {
      normalized += halfWidth;
    }
    node.scrollLeft = normalized;
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const node = viewportRef.current;
    if (!node) return;

    const target = event.target as HTMLElement | null;
    if (target?.closest("a, button")) {
      setIsDragging(false);
      return;
    }

    event.preventDefault();
    startXRef.current = event.clientX;
    startScrollLeftRef.current = node.scrollLeft;
    node.setPointerCapture(event.pointerId);
    setIsDragging(true);
    lastTimestampRef.current = null;
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const node = viewportRef.current;
    if (!node) return;

    event.preventDefault();
    const delta = event.clientX - startXRef.current;
    node.scrollLeft = startScrollLeftRef.current - delta;
    wrapScrollPosition(node);
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const node = viewportRef.current;
    if (node && node.hasPointerCapture(event.pointerId)) {
      node.releasePointerCapture(event.pointerId);
      wrapScrollPosition(node);
    }
    setIsDragging(false);
    lastTimestampRef.current = null;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    finishDrag(event);
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    finishDrag(event);
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    finishDrag(event);
  };

  const handleMobileCardClick = (
    event: ReactMouseEvent<HTMLDivElement>,
    cardKey: string
  ) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest("a, button")) {
      return;
    }
    setActiveKey((prev) => (prev === cardKey ? null : cardKey));
  };

  const handleMobileCardKeyDown = (
    event: ReactKeyboardEvent<HTMLDivElement>,
    cardKey: string
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveKey((prev) => (prev === cardKey ? null : cardKey));
    }
  };

  const handleMobilePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (event.pointerType === "touch") {
      return;
    }
    if (!isMobile || mobileSlides.length <= 1) {
      return;
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (target?.closest("a, button")) {
      return;
    }

    const container = mobileSlidesContainerRef.current;
    if (!container) return;

    container.setPointerCapture(event.pointerId);
    const viewportWidth =
      container.parentElement?.getBoundingClientRect().width ??
      container.getBoundingClientRect().width ??
      1;
    mobileDragStateRef.current = {
      startX: event.clientX,
      viewportWidth,
      pointerId: event.pointerId,
    };
    setIsMobileDragging(true);
    setMobileDragOffset(0);
    setActiveKey(null);
  };

  const handleMobilePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (!isMobileDragging) return;
    if (event.pointerType === "touch") {
      return;
    }
    const container = mobileSlidesContainerRef.current;
    if (!container) return;

    event.preventDefault();
    const { startX } = mobileDragStateRef.current;
    const delta = event.clientX - startX;
    setMobileDragOffset(delta);
  };

  const finishMobileDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") {
      return;
    }
    if (!isMobileDragging) return;

    const container = mobileSlidesContainerRef.current;
    const { pointerId } = mobileDragStateRef.current;

    if (
      container &&
      pointerId !== null &&
      container.hasPointerCapture(pointerId)
    ) {
      container.releasePointerCapture(pointerId);
    }
    resolveMobileDrag();
  };

  const handleMobilePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    finishMobileDrag(event);
  };

  const handleMobilePointerLeave = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (!isMobileDragging) return;
    finishMobileDrag(event);
  };

  const handleMobilePointerCancel = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    finishMobileDrag(event);
  };

  const resetTouchState = () => {
    mobileTouchStateRef.current = {
      startX: 0,
      startY: 0,
      viewportWidth: 1,
      isTracking: false,
      isSwiping: false,
    };
  };

  const resolveMobileDrag = (finalOffset?: number) => {
    const { viewportWidth } = mobileDragStateRef.current;
    const effectiveOffset = finalOffset ?? mobileDragOffset;
    let delta = 0;

    if (hasMultipleMobileSlides && viewportWidth > 0) {
      const threshold = viewportWidth * 0.1;
      if (effectiveOffset > threshold) {
        delta = -1;
      } else if (effectiveOffset < -threshold) {
        delta = 1;
      }
    }

    if (delta !== 0) {
      advanceMobileSlide(delta);
    }

    setIsMobileDragging(false);
    setMobileDragOffset(0);
    mobileDragStateRef.current.pointerId = null;
    resetTouchState();
  };

  const handleMobileTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (!isMobile || mobileSlides.length <= 1) {
      return;
    }

    const firstTouch = event.touches[0];
    if (!firstTouch) return;

    const container = mobileSlidesContainerRef.current;
    if (!container) return;

    const viewportWidth =
      container.parentElement?.getBoundingClientRect().width ??
      container.getBoundingClientRect().width ??
      1;

    mobileTouchStateRef.current = {
      startX: firstTouch.clientX,
      startY: firstTouch.clientY,
      viewportWidth,
      isTracking: true,
      isSwiping: false,
    };
    mobileDragStateRef.current.viewportWidth = viewportWidth;
    setActiveKey(null);
    setMobileDragOffset(0);
  };

  const handleMobileTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    const touchState = mobileTouchStateRef.current;
    if (!touchState.isTracking) {
      return;
    }

    const touch = event.touches[0];
    if (!touch) return;

    const deltaX = touch.clientX - touchState.startX;
    const deltaY = Math.abs(touch.clientY - touchState.startY);
    const absDeltaX = Math.abs(deltaX);

    if (!touchState.isSwiping) {
      if (absDeltaX > 6 && absDeltaX > deltaY) {
        touchState.isSwiping = true;
        setIsMobileDragging(true);
      } else if (deltaY > absDeltaX) {
        touchState.isTracking = false;
        resetTouchState();
        return;
      } else {
        return;
      }
    }

    event.preventDefault();
    setMobileDragOffset(deltaX);
  };

  const handleMobileTouchEnd = () => {
    const { isSwiping } = mobileTouchStateRef.current;
    if (isSwiping) {
      resolveMobileDrag();
    } else {
      setIsMobileDragging(false);
      setMobileDragOffset(0);
      resetTouchState();
    }
  };

  const handleMobileTouchCancel = () => {
    if (mobileTouchStateRef.current.isSwiping) {
      resolveMobileDrag();
    } else {
      setIsMobileDragging(false);
      setMobileDragOffset(0);
      resetTouchState();
    }
  };

  const mobileDragPercent = useMemo(() => {
    if (!isMobileDragging) return 0;
    const { viewportWidth } = mobileDragStateRef.current;
    if (!viewportWidth) return 0;
    return (mobileDragOffset / viewportWidth) * 100;
  }, [isMobileDragging, mobileDragOffset]);

  if (isMobile) {
    const baseTranslateIndex = hasMultipleMobileSlides
      ? mobileLoopIndex
      : currentMobileSlide;
    const effectiveTranslate =
      -(baseTranslateIndex * 100) + (isMobileDragging ? mobileDragPercent : 0);

    const mobileRenderSlides = hasMultipleMobileSlides
      ? [...mobileSlides, ...mobileSlides, ...mobileSlides]
      : mobileSlides;
    const loopOffset = hasMultipleMobileSlides ? mobileSlidesLength : 0;

    return (
      <div className="relative">
        <div className="overflow-hidden touch-pan-y select-none">
          <div
            ref={mobileSlidesContainerRef}
            className="flex touch-pan-y select-none"
            style={{
              transform: `translateX(${effectiveTranslate}%)`,
              transition:
                isMobileDragging || suppressMobileTransition
                  ? "none"
                  : "transform 700ms ease-out",
            }}
            onPointerDown={handleMobilePointerDown}
            onPointerMove={handleMobilePointerMove}
            onPointerUp={handleMobilePointerUp}
            onPointerLeave={handleMobilePointerLeave}
            onPointerCancel={handleMobilePointerCancel}
            onTouchStart={handleMobileTouchStart}
            onTouchMove={handleMobileTouchMove}
            onTouchEnd={handleMobileTouchEnd}
            onTouchCancel={handleMobileTouchCancel}
          >
            {mobileRenderSlides.map((slide, slideIndex) => (
              <div
                key={`mobile-slide-${slideIndex}`}
                className="min-w-full px-2"
                aria-hidden={
                  hasMultipleMobileSlides
                    ? (slideIndex - loopOffset + mobileRenderSlides.length) %
                        mobileSlidesLength !==
                      currentMobileSlide
                    : mobileSlidesLength > 1
                    ? slideIndex !== currentMobileSlide
                    : undefined
                }
              >
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 2 }, (_, columnIndex) => {
                    const item = slide[columnIndex];
                    if (!item) {
                      return (
                        <div
                          key={`placeholder-${slideIndex}-${columnIndex}`}
                          aria-hidden="true"
                          className="h-full rounded-2xl opacity-0"
                        />
                      );
                    }

                    const { partner, originalIndex } = item;
                    const cardKey = `${partner.name}-${originalIndex}-mobile`;
                    const isActive = activeKey === cardKey;

return (
                      <div
                        key={cardKey}
                        role="button"
                        tabIndex={0}
                        aria-expanded={isActive}
                        onClick={(event) =>
                          handleMobileCardClick(event, cardKey)
                        }
                        onKeyDown={(event) =>
                          handleMobileCardKeyDown(event, cardKey)
                        }
className={`relative flex h-full min-h-[14.5rem] flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/70 bg-white/95 px-3 pb-0.5 text-center shadow-sm transition-shadow duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-viking-red/80 dark:border-white/10 dark:bg-viking-surface ${
                           isActive ? "shadow-lg" : ""
                         }`}
                      >

<div className="relative z-[1] flex flex-1 flex-col items-center justify-between gap-6">
<div className="relative flex w-full aspect-square items-center justify-center overflow-hidden rounded-xl bg-white dark:bg-viking-surface-alt">
                            {partner.logoSrc ? (
                              <Image
                                src={partner.logoSrc}
                                alt={partner.logoAlt || partner.name}
                                fill
                                sizes="(min-width: 1024px) 200px, (min-width: 640px) 180px, 45vw"
                                style={{
                                  objectFit: "contain",
                                  padding: "0.75rem",
                                }}
                              />
                            ) : (
                              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-base font-semibold text-viking-charcoal dark:bg-gray-600 dark:text-white">
                                {partner.name
                                  .split(" ")
                                  .map((word) => word[0])
                                  .join("")
                                  .slice(0, 2)}
                              </div>
                            )}
                          </div>

                          <h3 className="text-base font-semibold text-viking-charcoal dark:text-gray-100">
                            {partner.name}
                          </h3>
                        </div>

                        <div
                          className={`absolute inset-0 z-[2] flex max-h-full flex-col items-center justify-center gap-4 overflow-y-auto rounded-2xl bg-black/70 px-1 text-center text-white transition-opacity duration-300 ease-out ${
                            isActive
                              ? "opacity-100 pointer-events-auto"
                              : "opacity-0 pointer-events-none"
                          }`}
                          aria-hidden={!isActive}
                        >
                          <p className="text-sm font-medium">
                            {partner.description}
                          </p>
                          {partner.website ? (
                            <Button
                              asChild
                              variant="secondary"
                              className="bg-white/90 text-viking-red hover:bg-white"
                            >
                              <a
                                href={partner.website}
                                rel="noreferrer"
                                target="_blank"
                              >
                                Visit Site
                              </a>
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {mobileSlides.length > 1 ? (
          <div className="mt-4 flex justify-center gap-2">
            {mobileSlides.map((_, index) => (
              <button
                key={`mobile-dot-${index}`}
                type="button"
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  index === currentMobileSlide
                    ? "bg-viking-red"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Go to partner slide ${index + 1}`}
                aria-current={index === currentMobileSlide}
                onClick={() => {
                  setActiveKey(null);
                  goToMobileSlide(index);
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={viewportRef}
        className={`flex items-stretch gap-4 sm:gap-6 overflow-hidden touch-pan-y select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerCancel}
      >
        {extendedPartners.map(({ partner, originalIndex }, index) => {
          const cardKey = `${partner.name}-${originalIndex}-${Math.floor(
            index / baseLength
          )}`;
          const isActive = activeKey === cardKey;
          const isDimmed = activeKey !== null && !isActive;

          return (
            <div
              key={cardKey}
              className={`group relative flex w-40 sm:w-56 lg:w-64 flex-shrink-0 transform flex-col items-center justify-between overflow-hidden rounded-2xl border border-gray-200/70 bg-white/95 px-4 py-6 sm:px-6 sm:py-6 mb-6 text-center transition-all duration-300 ease-out dark:border-white/10 dark:bg-viking-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-viking-red/80 ${
                isActive ? "scale-105 shadow-2xl z-10" : "scale-100"
              } ${isDimmed ? "opacity-30" : "opacity-100"}`}
              onMouseEnter={() => setActiveKey(cardKey)}
              onMouseLeave={() => setActiveKey(null)}
              onFocus={() => setActiveKey(cardKey)}
              onBlur={(event) => {
                const nextTarget = event.relatedTarget as Node | null;
                if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
                  setActiveKey(null);
                }
              }}
              tabIndex={0}
              aria-expanded={isActive}
            >
              <div className="relative mb-3 flex w-full aspect-square items-center justify-center overflow-hidden rounded-xl bg-white dark:bg-viking-surface-alt">
                {partner.logoSrc ? (
                  <Image
                    src={partner.logoSrc}
                    alt={partner.logoAlt || partner.name}
                    fill
                    sizes="(min-width: 1024px) 200px, (min-width: 640px) 180px, 45vw"
                    style={{ objectFit: "contain", padding: "1rem" }}
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold text-viking-charcoal dark:bg-gray-600 dark:text-white">
                    {partner.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-viking-charcoal dark:text-gray-100">
                {partner.name}
              </h3>

              <div
                className={`absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-black/60 px-5 text-center text-white transition-opacity duration-300 ${
                  isActive
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
                aria-hidden={!isActive}
              >
                <p className="text-sm font-bold">
                  {partner.description}
                </p>
                {partner.website ? (
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 text-viking-red hover:bg-white"
                  >
                    <a href={partner.website} rel="noreferrer" target="_blank">
                      Visit Site
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
