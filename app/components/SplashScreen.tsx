"use client";
import React from "react";

// Adjust the logo path as needed (should be in public/images/)
const LOGO_SRC = "/images/logo.png"; // Replace with your logo file if different

export default function SplashScreen() {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1800); // 1.8s total
    return () => clearTimeout(timer);
  }, []);

  // Optionally skip animation for users with reduced motion
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-700"
      style={{
        background: "#f8fafc",
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1)",
      }}
      aria-label="Oslo Vikings splash screen"
    >
      <img
        src={LOGO_SRC}
        alt="Oslo Vikings logo"
        className="w-56 h-56 object-contain drop-shadow-2xl animate-pulse"
        draggable={false}
      />
    </div>
  );
}
