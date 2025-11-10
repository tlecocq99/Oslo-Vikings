"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

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
        className="w-full"
        style={{ height: `${navHeight}px` }}
      />
      <nav
        ref={navRef}
        className="shadow-lg fixed top-0 left-0 right-0 z-[150] w-full overflow-visible bg-white dark:bg-viking-charcoal/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-viking-charcoal/70 transition-colors"
      >
        <div className="flex w-full relative h-24 items-center px-4 sm:px-6 lg:px-14">
          {/* Logo on the far left */}
          <Link href="/" className="flex items-center h-full group mr-4">
            <Image
              src="/images/logo.png"
              alt="Oslo Vikings logo"
              width={120}
              height={120}
              priority
              className="h-24 w-auto drop-shadow-lg transition-transform group-hover:scale-110"
              style={{ maxHeight: 96 }}
              draggable={false}
            />
            <span className="sr-only">Home</span>
          </Link>

          {/* Desktop Navigation (pipe-separated) */}
          <div className="hidden md:flex flex-1 items-center justify-center h-full select-none">
            {navItems.map((item, idx) => {
              const isTeam = item.name === "TEAMS";
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const desktopLinkClasses = [
                "font-teko font-semibold text-4xl tracking-wide uppercase focus:outline-none focus:ring-2 focus:ring-viking-red focus:ring-offset-2 focus:ring-offset-white",
                "transition-transform duration-200 ease-out transform-gpu flex items-center justify-center gap-1 text-center whitespace-nowrap",
                active
                  ? "text-viking-red"
                  : "text-viking-red hover:scale-[1.20]",
              ].join(" ");
              return (
                <div key={item.name} className="flex items-center">
                  {idx > 0 && (
                    <span
                      aria-hidden="true"
                      className="px-3 text-viking-red font-light text-4xl"
                    >
                      |
                    </span>
                  )}
                  <div className="relative group">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      aria-haspopup={isTeam ? "menu" : undefined}
                      className={desktopLinkClasses}
                      style={{ pointerEvents: "auto" }}
                    >
                      {item.name}
                      {isTeam && (
                        <ChevronDown className="h-6 w-6 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
                      )}
                    </Link>

                    {isTeam && (
                      <div className="pointer-events-none absolute left-1/2 top-full z-[70] -translate-x-1/2 translate-y-1 opacity-0 invisible group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto transition-all duration-200 ease-out">
                        <div className="mt-1 w-56 rounded-xl bg-white dark:bg-viking-charcoal shadow-2xl ring-1 ring-black/5 border border-viking-red/20 dark:border-viking-red-dark/20 p-2 space-y-1">
                          {teamLinks.map((team) => (
                            <Link
                              key={team.name}
                              href={team.href}
                              className="flex items-center justify-between px-3 py-2 rounded-lg text-lg font-teko uppercase tracking-wide transition-colors text-viking-charcoal dark:text-gray-100 hover:bg-viking-red hover:text-white dark:hover:bg-viking-red-dark dark:hover:text-white"
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
          <div className="hidden md:flex items-center ml-auto">
            <ThemeToggle />
          </div>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center ml-auto space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              className="text-viking-red dark:text-viking-red-dark border border-viking-red/50 dark:border-viking-red-dark/50 bg-white dark:bg-viking-charcoal hover:bg-viking-red hover:text-white dark:hover:bg-viking-red-dark dark:hover:text-viking-charcoal focus:ring-2 focus:ring-viking-red dark:focus:ring-viking-red-dark focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-viking-charcoal rounded-md shadow-sm transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-red-700 dark:bg-viking-charcoal relative z-10 transition-colors">
            <div
              className="px-2 pt-2 pb-8 sm:pb-10 space-y-2 sm:px-3 border-t border-red-600 dark:border-viking-gold/30"
              style={{
                paddingBottom:
                  "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)",
              }}
            >
              {navItems.map((item, index) => {
                const isTeam = item.name === "TEAMS";
                const isActive = pathname.startsWith(item.href);
                const mobileLinkClasses = [
                  "w-full text-center block rounded-md font-teko font-semibold text-3xl uppercase transition-all duration-200 border-2",
                  "h-20 flex items-center justify-center",
                  isActive
                    ? "bg-white dark:bg-viking-gold text-viking-red dark:text-viking-charcoal border-white dark:border-viking-gold"
                    : "text-white dark:text-viking-gold border-white dark:border-viking-gold bg-red-700 dark:bg-viking-charcoal hover:bg-white hover:text-viking-red hover:border-white dark:hover:bg-viking-gold dark:hover:text-viking-charcoal dark:hover:border-viking-gold",
                ].join(" ");
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
                          <span className="flex items-center gap-2">
                            {item.name}
                            <ChevronDown
                              className={`h-6 w-6 transition-transform duration-200 ${
                                isTeamsMobileOpen ? "rotate-180" : ""
                              }`}
                            />
                          </span>
                        </button>
                        <div
                          id={mobileTeamsMenuId}
                          className={`grid gap-2 overflow-hidden transition-[max-height,opacity,margin] duration-300 ${
                            isTeamsMobileOpen
                              ? "max-h-[600px] opacity-100 mt-2 pointer-events-auto"
                              : "max-h-0 opacity-0 mt-0 pointer-events-none"
                          }`}
                        >
                          {teamLinks.map((team) => (
                            <Link
                              key={`mobile-${team.name}`}
                              href={team.href}
                              onClick={closeMobileMenu}
                              className="block rounded-md border px-4 py-3 text-xl font-teko uppercase tracking-wide transition-colors text-white dark:text-viking-gold border-white dark:border-viking-gold bg-red-700 dark:bg-viking-charcoal hover:bg-white hover:text-viking-red hover:border-white dark:hover:bg-viking-gold dark:hover:text-viking-charcoal dark:hover:border-viking-gold"
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
                        <span className="flex items-center gap-2">
                          {item.name}
                        </span>
                      </Link>
                    )}
                    {index < navigation.length - 1 && (
                      <div className="border-b border-red-600/50 dark:border-viking-gold/30 my-1"></div>
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
