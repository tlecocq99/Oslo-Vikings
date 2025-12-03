"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

type Placement = "bottom" | "top" | "left" | "right";

export type InstagramHoverProps = {
  /** Instagram profile permalink to embed (should include https://). */
  embedPermalink: string;
  /** External profile URL for the trigger link. */
  profileUrl: string;
  /** Optional trigger content (icon/text). */
  children?: React.ReactNode;
  /** Popup positioning and size. */
  placement?: Placement;
  width?: number;
  className?: string;
  wrapperClassName?: string;
  disabled?: boolean;
  linkTarget?: "_blank" | "_self";
  linkRel?: string;
  detectTimeoutMs?: number;
};

export default function InstagramHover({
  embedPermalink,
  profileUrl,
  children = "Instagram",
  placement = "bottom",
  width = 360,
  className,
  wrapperClassName,
  disabled = false,
  linkTarget = "_blank",
  linkRel = "noreferrer",
  detectTimeoutMs = 2000,
}: InstagramHoverProps) {
  const [open, setOpen] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [blockedLikely, setBlockedLikely] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const blockquoteRef = useRef<HTMLElement | null>(null);
  const detectionTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    if (disabled || typeof window === "undefined") return;

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.instagram.com/embed.js"]'
    );
    if (existing) {
      setScriptReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.addEventListener("load", () => setScriptReady(true));
    script.addEventListener("error", () => {
      setScriptReady(false);
      setBlockedLikely(true);
    });
    document.body.appendChild(script);
  }, [disabled]);

  const triggerInstagramProcess = () => {
    const w = window as unknown as {
      instgrm?: { Embeds?: { process?: () => void } };
    };
    w.instgrm?.Embeds?.process?.();
  };

  useEffect(() => {
    if (disabled) return;
    if (scriptReady) triggerInstagramProcess();
  }, [scriptReady, disabled]);

  useEffect(() => {
    if (disabled) return;
    if (open && scriptReady) triggerInstagramProcess();
  }, [open, scriptReady, disabled]);

  useLayoutEffect(() => {
    if (disabled || !open) return;

    const checkHydration = () => {
      const popup = popupRef.current;
      if (!popup) return false;
      const iframe = popup.querySelector("iframe");
      if (iframe) {
        setHydrated(true);
        setBlockedLikely(false);
        return true;
      }
      return false;
    };

    if (checkHydration()) return;

    const observer = new MutationObserver(() => {
      if (checkHydration()) observer.disconnect();
    });
    if (popupRef.current) {
      observer.observe(popupRef.current, { childList: true, subtree: true });
    }

    if (detectionTimer.current) window.clearTimeout(detectionTimer.current);
    detectionTimer.current = window.setTimeout(() => {
      if (!checkHydration()) {
        setBlockedLikely(true);
      }
    }, detectTimeoutMs);

    return () => {
      observer.disconnect();
      if (detectionTimer.current) window.clearTimeout(detectionTimer.current);
    };
  }, [open, detectTimeoutMs, disabled]);

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
        aria-label="Instagram profile preview"
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
            Instagram preview
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
            Open on Instagram ↗
          </a>
        </div>

        {blockedLikely ? (
          <div style={{ padding: 10, fontSize: 14, lineHeight: 1.35 }}>
            <strong>Preview blocked</strong>
            <div style={{ marginTop: 6 }}>
              It looks like an ad or privacy blocker may be stopping the
              Instagram preview.
            </div>
            <div style={{ marginTop: 6 }}>
              To view it here, try whitelisting our site or use the
              <strong> Open on Instagram</strong> link above.
            </div>
          </div>
        ) : (
          <>
            <blockquote
              ref={(el) => (blockquoteRef.current = el)}
              className="instagram-media"
              data-instgrm-permalink={embedPermalink}
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: 0,
                borderRadius: 12,
                boxShadow:
                  "0 0 1px 0 rgba(0,0,0,0.5),0 12px 24px 0 rgba(0,0,0,0.12)",
                margin: "0 auto",
                padding: 0,
                maxWidth: width,
                minWidth: 280,
                width: "100%",
              }}
            >
              <a
                href={profileUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  padding: 12,
                  color: "inherit",
                  textDecoration: "none",
                  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
                }}
              >
                @{profileUrl.replace(/^https?:\/\/[^/]+\//, "")}
              </a>
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
