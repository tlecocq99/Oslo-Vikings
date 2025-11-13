"use client";
import React from "react";
import Image from "next/image";
import styles from "./SplashScreen.module.css";

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
      className={styles.container}
      style={{ opacity: visible ? 1 : 0 }}
      aria-label="Oslo Vikings splash screen"
    >
      <Image
        src={LOGO_SRC}
        alt="Oslo Vikings logo"
        width={224}
        height={224}
        priority
        className={styles.logo}
        draggable={false}
      />
    </div>
  );
}
