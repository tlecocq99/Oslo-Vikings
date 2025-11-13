"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Facebook, Instagram, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { TikTokIcon } from "./TikTokIcon";
import styles from "./Navigation.module.css";
import TikTokHover from "./TikTokHoverLink";

type NavItem = {
  name: string;
  href: string;
};
const navigation: NavItem[] = [
  { name: "HOME", href: "/" },
  { name: "TEAMS", href: "/team" },
  { name: "NEWS", href: "/news" },
  { name: "JOIN OV", href: "/recruitment" },
  { name: "SHOP", href: "/shop" },
  { name: "ABOUT", href: "/about" },
  { name: "CONTACT", href: "/contact" },
];

const teamLinks = [
  { name: "Senior Elite", href: "/team/senior-elite" },
  { name: "Senior D2", href: "/team/senior-d2" },
  { name: "U17", href: "/team/u17" },
  { name: "U14", href: "/team/u14" },
  { name: "Flag Football", href: "/team/flag-football" },
];

const socialLinks = [
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@oslovikings",
    Icon: TikTokIcon,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/OsloVikings",
    Icon: Facebook,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/oslovikings/",
    Icon: Instagram,
  },
] as const;

const DEFAULT_NAV_HEIGHT = 96;

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTeamsMobileOpen, setIsTeamsMobileOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);
  const [navHeight, setNavHeight] = useState(DEFAULT_NAV_HEIGHT);

  const navItems = useMemo(() => navigation, []);
  const mobileTeamsMenuId = "mobile-team-links";

  const toggleMobileMenu = () => {
    setIsTeamsMobileOpen(false);
    setIsOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
    setIsTeamsMobileOpen(false);
  };

  useEffect(() => {
    const navElement = navRef.current;
    if (!navElement || typeof window === "undefined") {
      return;
    }

    const updateHeight = () => {
      setNavHeight(navElement.offsetHeight || DEFAULT_NAV_HEIGHT);
    };

    updateHeight();

    let resizeObserver: ResizeObserver | undefined;
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => updateHeight());
      resizeObserver.observe(navElement);
    }

    window.addEventListener("resize", updateHeight, { passive: true });

    return () => {
      window.removeEventListener("resize", updateHeight);
      resizeObserver?.disconnect();
    };
  }, [isOpen, isTeamsMobileOpen]);

  return (
    <>
      <div
        aria-hidden="true"
        className={styles.navPlaceholder}
        style={{ height: `${navHeight}px` }}
      />
      <nav ref={navRef} className={styles.nav}>
        <div className={styles.navInner}>
          {/* Logo on the far left */}
          <Link href="/" className={styles.brandLink}>
            <Image
              src="/images/logo.png"
              alt="Oslo Vikings logo"
              width={120}
              height={120}
              priority
              className={styles.brandImage}
              draggable={false}
            />
            <span className="sr-only">Home</span>
          </Link>
          <div className={styles.desktopSocial}>
            {socialLinks.map(({ name, href, Icon }) =>
              name === "TikTok" ? (
                <TikTokHover
                  key={name}
                  profileUrl={href} // "https://www.tiktok.com/@oslovikings"
                  uniqueId="oslovikings" // without the @
                  placement="bottom"
                  width={360}
                  className={styles.desktopSocialLink}
                  linkTarget="_blank"
                  linkRel="noreferrer"
                >
                  <span aria-label={`Oslo Vikings on ${name}`} role="img">
                    <Icon className={styles.desktopSocialIcon} />
                  </span>
                </TikTokHover>
              ) : (
                <Link
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Oslo Vikings on ${name}`}
                  className={styles.desktopSocialLink}
                >
                  <Icon className={styles.desktopSocialIcon} />
                </Link>
              )
            )}
          </div>
          {/* Desktop Navigation (pipe-separated) */}
          <div className={styles.desktopNav}>
            {navItems.map((item, idx) => {
              const isTeam = item.name === "TEAMS";
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const desktopLinkClasses = clsx(
                styles.desktopLink,
                active && styles.desktopLinkActive
              );
              return (
                <div key={item.name} className={styles.desktopNavItem}>
                  {idx > 0 && (
                    <span aria-hidden="true" className={styles.desktopDivider}>
                      |
                    </span>
                  )}
                  <div className={styles.desktopLinkGroup}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      aria-haspopup={isTeam ? "menu" : undefined}
                      className={desktopLinkClasses}
                      style={{ pointerEvents: "auto" }}
                    >
                      {item.name}
                      {isTeam && (
                        <ChevronDown className={styles.desktopLinkIcon} />
                      )}
                    </Link>

                    {isTeam && (
                      <div className={styles.desktopDropdownWrapper}>
                        <div className={styles.desktopDropdown}>
                          {teamLinks.map((team) => (
                            <Link
                              key={team.name}
                              href={team.href}
                              className={styles.desktopDropdownLink}
                            >
                              <span>{team.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Right side actions (desktop) */}
          <div className={styles.desktopActions}>
            <ThemeToggle />
          </div>
          {/* Mobile actions */}
          <div className={styles.mobileActions}>
            <div className={styles.mobileSocial}>
              {socialLinks.map(({ name, href, Icon }) => (
                <Link
                  key={`mobile-${name}`}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Oslo Vikings on ${name}`}
                  className={styles.mobileSocialLink}
                >
                  <Icon className={styles.mobileSocialIcon} />
                </Link>
              ))}
            </div>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              className={styles.mobileMenuButton}
            >
              {isOpen ? (
                <X className={styles.mobileMenuButtonIcon} />
              ) : (
                <Menu className={styles.mobileMenuButtonIcon} />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={styles.mobileMenu}>
            <div
              className={styles.mobileMenuInner}
              style={{
                paddingBottom:
                  "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)",
              }}
            >
              {navItems.map((item, index) => {
                const isTeam = item.name === "TEAMS";
                const isActive = pathname.startsWith(item.href);
                const mobileLinkClasses = clsx(
                  styles.mobileLink,
                  isActive && styles.mobileLinkActive
                );
                return (
                  <div key={item.name}>
                    {isTeam ? (
                      <>
                        <button
                          type="button"
                          className={mobileLinkClasses}
                          onClick={() => setIsTeamsMobileOpen((prev) => !prev)}
                          aria-expanded={isTeamsMobileOpen}
                          aria-controls={mobileTeamsMenuId}
                          style={{ pointerEvents: "auto" }}
                        >
                          <span className={styles.mobileTeamsToggle}>
                            {item.name}
                            <ChevronDown
                              className={clsx(
                                styles.mobileTeamsIcon,
                                isTeamsMobileOpen && styles.mobileTeamsIconOpen
                              )}
                            />
                          </span>
                        </button>
                        <div
                          id={mobileTeamsMenuId}
                          className={clsx(
                            styles.mobileTeamsGrid,
                            isTeamsMobileOpen
                              ? styles.mobileTeamsGridOpen
                              : styles.mobileTeamsGridClosed
                          )}
                        >
                          {teamLinks.map((team) => (
                            <Link
                              key={`mobile-${team.name}`}
                              href={team.href}
                              onClick={closeMobileMenu}
                              className={styles.mobileTeamLink}
                            >
                              {team.name}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={mobileLinkClasses}
                        onClick={closeMobileMenu}
                        style={{ pointerEvents: "auto" }}
                      >
                        <span className={styles.mobileTeamsToggle}>
                          {item.name}
                        </span>
                      </Link>
                    )}
                    {index < navigation.length - 1 && (
                      <div className={styles.mobileDivider}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
