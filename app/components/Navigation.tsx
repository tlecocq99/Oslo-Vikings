"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
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
import InstagramHover from "./InstagramHoverLink";

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
const aboutLinks = [
  { name: "Overview", href: "/about" },
  { name: "History", href: "/about/history" },
  { name: "Partners", href: "/about/partners" },
  { name: "Boosters", href: "/about/boosters" },
  { name: "Antidoping", href: "/about/antidoping" },
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
    name: "Instagram",
    href: "https://www.instagram.com/oslovikings/",
    Icon: Instagram,
  },
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
] as const;

const DEFAULT_NAV_HEIGHT = 96;

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<
    null | "teams" | "about"
  >(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);
  const [navHeight, setNavHeight] = useState(DEFAULT_NAV_HEIGHT);
  const [supportsHoverPreview, setSupportsHoverPreview] = useState(false);

  const navItems = useMemo(() => navigation, []);
  const mobileTeamsMenuId = "mobile-team-links";
  const mobileAboutMenuId = "mobile-about-links";

  const mobileMenuStyle = useMemo<CSSProperties>(
    () => ({ "--nav-height": `${navHeight}px` } as CSSProperties),
    [navHeight]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const hoverQuery = window.matchMedia("(hover: hover)");
    const pointerQuery = window.matchMedia("(pointer: fine)");

    const update = () =>
      setSupportsHoverPreview(hoverQuery.matches && pointerQuery.matches);

    update();

    const attach = (mq: MediaQueryList) => {
      if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
      }
      if (typeof mq.addListener === "function") {
        mq.addListener(update);
        return () => mq.removeListener(update);
      }
      return () => undefined;
    };

    const cleanupHover = attach(hoverQuery);
    const cleanupPointer = attach(pointerQuery);

    return () => {
      cleanupHover();
      cleanupPointer();
    };
  }, []);

  const renderSocialLinks = (variant: "desktop" | "mobile") =>
    socialLinks.map(({ name, href, Icon }) => {
      const key = `${variant}-${name}`;
      const ariaLabel = `Oslo Vikings on ${name}`;
      const linkClass =
        variant === "desktop"
          ? styles.desktopSocialLink
          : styles.mobileSocialLink;
      const iconClass =
        variant === "desktop"
          ? styles.desktopSocialIcon
          : styles.mobileSocialIcon;

      if (variant === "desktop" && name === "TikTok") {
        return (
          <TikTokHover
            key={key}
            profileUrl={href}
            uniqueId="oslovikings"
            placement="left"
            width={360}
            className={linkClass}
            disabled={!supportsHoverPreview}
            linkTarget="_blank"
            linkRel="noreferrer"
          >
            <span aria-label={ariaLabel} role="img">
              <Icon className={iconClass} />
            </span>
          </TikTokHover>
        );
      }

      if (variant === "desktop" && name === "Instagram") {
        return (
          <InstagramHover
            key={key}
            profileUrl={href}
            embedPermalink="https://www.instagram.com/oslovikings/?utm_source=ig_embed&utm_campaign=loading"
            placement="left"
            width={360}
            className={linkClass}
            disabled={!supportsHoverPreview}
            linkTarget="_blank"
            linkRel="noreferrer"
          >
            <span aria-label={ariaLabel} role="img">
              <Icon className={iconClass} />
            </span>
          </InstagramHover>
        );
      }

      return (
        <Link
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={ariaLabel}
          className={linkClass}
        >
          <Icon className={iconClass} />
        </Link>
      );
    });

  const toggleMobileMenu = () => {
    setOpenMobileSection(null);
    setIsOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
    setOpenMobileSection(null);
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
  }, [isOpen, openMobileSection]);

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
              width={100}
              height={100}
              priority
              className={styles.brandImage}
              draggable={false}
            />
            <span className="sr-only">Home</span>
          </Link>
          {/* Desktop Navigation (pipe-separated) */}
          <div className={styles.desktopNav}>
            {navItems.map((item, idx) => {
              const isTeam = item.name === "TEAMS";
              const isAbout = item.name === "ABOUT";
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
                      aria-haspopup={isTeam || isAbout ? "menu" : undefined}
                      className={desktopLinkClasses}
                      style={{ pointerEvents: "auto" }}
                    >
                      {item.name}
                      {(isTeam || isAbout) && (
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
                    {isAbout && (
                      <div className={styles.desktopDropdownWrapper}>
                        <div className={styles.desktopDropdown}>
                          {aboutLinks.map((about) => (
                            <Link
                              key={about.name}
                              href={about.href}
                              className={styles.desktopDropdownLink}
                            >
                              <span>{about.name}</span>
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
            <div className={styles.desktopSocial}>
              {renderSocialLinks("desktop")}
            </div>
            <ThemeToggle />
          </div>
          {/* Mobile actions */}
          <div className={styles.mobileActions}>
            <div className={styles.mobileSocial}>
              {renderSocialLinks("mobile")}
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
          <div className={styles.mobileMenu} style={mobileMenuStyle}>
            <div
              className={styles.mobileMenuInner}
              style={{
                paddingBottom:
                  "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)",
              }}
            >
              {navItems.map((item, index) => {
                const isTeam = item.name === "TEAMS";
                const isAbout = item.name === "ABOUT";
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
                          onClick={() =>
                            setOpenMobileSection((prev) =>
                              prev === "teams" ? null : "teams"
                            )
                          }
                          aria-expanded={openMobileSection === "teams"}
                          aria-controls={mobileTeamsMenuId}
                          style={{ pointerEvents: "auto" }}
                        >
                          <span className={styles.mobileTeamsToggle}>
                            {item.name}
                            <ChevronDown
                              className={clsx(
                                styles.mobileTeamsIcon,
                                openMobileSection === "teams" &&
                                  styles.mobileTeamsIconOpen
                              )}
                            />
                          </span>
                        </button>
                        <div
                          id={mobileTeamsMenuId}
                          className={clsx(
                            styles.mobileTeamsGrid,
                            openMobileSection === "teams"
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
                    ) : isAbout ? (
                      <>
                        <button
                          type="button"
                          className={mobileLinkClasses}
                          onClick={() =>
                            setOpenMobileSection((prev) =>
                              prev === "about" ? null : "about"
                            )
                          }
                          aria-expanded={openMobileSection === "about"}
                          aria-controls={mobileAboutMenuId}
                          style={{ pointerEvents: "auto" }}
                        >
                          <span className={styles.mobileTeamsToggle}>
                            {item.name}
                            <ChevronDown
                              className={clsx(
                                styles.mobileTeamsIcon,
                                openMobileSection === "about" &&
                                  styles.mobileTeamsIconOpen
                              )}
                            />
                          </span>
                        </button>
                        <div
                          id={mobileAboutMenuId}
                          className={clsx(
                            styles.mobileTeamsGrid,
                            openMobileSection === "about"
                              ? styles.mobileTeamsGridOpen
                              : styles.mobileTeamsGridClosed
                          )}
                        >
                          {aboutLinks.map((about) => (
                            <Link
                              key={`mobile-about-${about.name}`}
                              href={about.href}
                              onClick={closeMobileMenu}
                              className={styles.mobileTeamLink}
                            >
                              {about.name}
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
