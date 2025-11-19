"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

type Placement = "bottom" | "top" | "left" | "right";

export type TikTokHoverProps = {
  /** Full profile URL, e.g. "https://www.tiktok.com/@oslovikings" */
  profileUrl: string;
  /** Creator username WITHOUT @, e.g. "oslovikings" */
  uniqueId: string;
  /** Trigger content (your icon or text). */
  children?: React.ReactNode;
  /** Profile embed type from TikTok; "creator" for profiles. */
  embedType?: "creator";
  /** Positioning + sizing */
  placement?: Placement;
  width?: number;
  className?: string;
  wrapperClassName?: string;
  disabled?: boolean;
  linkTarget?: "_blank" | "_self";
  linkRel?: string;
  /** How long to wait for hydration before showing fallback */
  detectTimeoutMs?: number;
};

export default function TikTokHover({
  profileUrl,
  uniqueId,
  children = "TikTok",
  embedType = "creator",
  placement = "bottom",
  width = 360,
  className,
  wrapperClassName,
  disabled = false,
  linkTarget = "_blank",
  linkRel = "noreferrer",
  detectTimeoutMs = 1500,
}: TikTokHoverProps) {
  const [open, setOpen] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [blockedLikely, setBlockedLikely] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const blockquoteRef = useRef<HTMLElement | null>(null);
  const detectionTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  // Load TikTok script once; mark as blocked if it fails
  useEffect(() => {
    if (disabled || typeof window === "undefined") return;

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.tiktok.com/embed.js"]'
    );
    if (existing) {
      setScriptReady(true);
      return;
    }

    const s = document.createElement("script");
    s.src = "https://www.tiktok.com/embed.js";
    s.async = true;
    s.addEventListener("load", () => setScriptReady(true));
    s.addEventListener("error", () => {
      setScriptReady(false);
      setBlockedLikely(true);
    });
    document.body.appendChild(s);
  }, [disabled]);

  // Ask TikTok to hydrate when script is ready / popup opens
  const triggerTikTokLoad = () => {
    const w = window as unknown as {
      TikTok?: { load?: () => void };
      tiktok?: { load?: () => void };
    };
    (w.tiktok ?? w.TikTok)?.load?.();
  };

  useEffect(() => {
    if (disabled) return;
    if (scriptReady) triggerTikTokLoad();
  }, [scriptReady, disabled]);

  useEffect(() => {
    if (disabled) return;
    if (open && scriptReady) triggerTikTokLoad();
  }, [open, scriptReady, disabled]);

  // Detect whether an iframe appears (hydrated). If not, assume blocked.
  useLayoutEffect(() => {
    if (disabled || !open) return;

    const checkHydration = () => {
      const popup = popupRef.current;
      if (!popup) return false;
      const ifr = popup.querySelector("iframe");
      if (ifr) {
        setHydrated(true);
        setBlockedLikely(false);
        return true;
      }
      return false;
    };

    // Immediate check
    if (checkHydration()) return;

    // Observe DOM for late iframe injection
    const obs = new MutationObserver(() => {
      if (checkHydration()) obs.disconnect();
    });
    if (popupRef.current) {
      obs.observe(popupRef.current, { childList: true, subtree: true });
    }

    // Timeout fallback
    if (detectionTimer.current) window.clearTimeout(detectionTimer.current);
    detectionTimer.current = window.setTimeout(() => {
      if (!checkHydration()) {
        setBlockedLikely(true);
      }
    }, detectTimeoutMs);

    return () => {
      obs.disconnect();
      if (detectionTimer.current) window.clearTimeout(detectionTimer.current);
    };
  }, [open, detectTimeoutMs, disabled]);

  // Base popup styles (always mounted; just hidden/visible)
  const basePopupStyle: React.CSSProperties = {
    position: "absolute",
    width,
    zIndex: 999,
    background: "#fff",
    border: "1px solid rgba(0,0,0,.08)",
    borderRadius: 12,
    padding: 8,
    boxShadow: "0 10px 30px rgba(0,0,0,.12)",
    transition: "opacity 120ms ease, transform 120ms ease",
    opacity: open ? 1 : 0,
    transform: open ? "scale(1)" : "scale(0.98)",
    pointerEvents: open ? "auto" : "none",
    visibility: open ? "visible" : "hidden",
  };

  const offset = 10;
  const placementStyle: React.CSSProperties =
    placement === "top"
      ? { bottom: `calc(100% + ${offset}px)`, left: 0 }
      : placement === "left"
      ? { right: `calc(100% + ${offset}px)`, top: 0 }
      : placement === "right"
      ? { left: `calc(100% + ${offset}px)`, top: 0 }
      : { top: `calc(100% + ${offset}px)`, left: 0 };

  const cancelCloseTimer = () => {
    if (!closeTimer.current) return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const openPopup = () => {
    if (disabled) return;
    cancelCloseTimer();
    setOpen(true);
  };

  const scheduleClose = () => {
    if (disabled) return;
    cancelCloseTimer();
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => () => cancelCloseTimer(), []);

  const shouldKeepOpen = (target: EventTarget | null) =>
    target instanceof Node &&
    (popupRef.current?.contains(target) ||
      wrapperRef.current?.contains(target));

  return (
    <div
      ref={wrapperRef}
      className={[
        "relative inline-flex align-middle cursor-pointer",
        wrapperClassName,
      ]
        .filter(Boolean)
        .join(" ")}
      onPointerEnter={openPopup}
      onPointerLeave={(event) => {
        if (shouldKeepOpen(event.relatedTarget)) return;
        scheduleClose();
      }}
      onFocus={() => openPopup()}
      onBlur={(event) => {
        if (shouldKeepOpen(event.relatedTarget)) return;
        scheduleClose();
      }}
    >
      {/* Real link as trigger: click behaves like a normal link */}
      <a
        href={profileUrl}
        target={linkTarget}
        rel={linkRel}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={[
          "underline underline-offset-4 hover:no-underline focus:outline-none",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ cursor: "pointer" }}
      >
        {children}
      </a>

      <div
        ref={popupRef}
        role="dialog"
        aria-label="TikTok profile preview"
        aria-hidden={disabled}
        style={{
          ...basePopupStyle,
          ...placementStyle,
          pointerEvents: disabled ? "none" : basePopupStyle.pointerEvents,
        }}
        onPointerEnter={openPopup}
        onPointerLeave={(event) => {
          if (shouldKeepOpen(event.relatedTarget)) return;
          scheduleClose();
        }}
      >
        {/* Header row with "Open on TikTok" top-right */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              color: "#555",
            }}
          >
            TikTok preview
          </span>
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 12,
              color: "#0f6fff",
              textDecoration: "underline",
              textDecorationThickness: "from-font",
              whiteSpace: "nowrap",
            }}
          >
            Open on TikTok ↗
          </a>
        </div>

        {blockedLikely ? (
          <div style={{ padding: 10, fontSize: 14, lineHeight: 1.35 }}>
            <strong>Preview blocked</strong>
            <div style={{ marginTop: 6 }}>
              It looks like an ad or tracker blocker may be stopping the TikTok
              preview.
            </div>
            <div style={{ marginTop: 6 }}>
              If you’d like to see it, please whitelist our site or use the
              &nbsp;<strong>Open on TikTok</strong> link above.
            </div>
          </div>
        ) : (
          <>
            {/* TikTok creator embed based on the code you shared */}
            <blockquote
              ref={(el) => (blockquoteRef.current = el)}
              className="tiktok-embed"
              cite={profileUrl}
              data-unique-id={uniqueId}
              data-embed-type={embedType}
              style={{ maxWidth: width, minWidth: 288 }}
            >
              <section>
                <a
                  target="_blank"
                  href={`${profileUrl}?refer=creator_embed`}
                  rel="noreferrer"
                >
                  @{uniqueId}
                </a>
              </section>
            </blockquote>

            {!scriptReady && !hydrated && !blockedLikely && (
              <div style={{ fontSize: 12, color: "#666", padding: 8 }}>
                Loading preview…
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
