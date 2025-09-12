"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
  { name: "HOME", href: "/" },
  { name: "TEAM", href: "/team" },
  { name: "SCHEDULE", href: "/schedule" },
  { name: "JOIN OV", href: "/recruitment" },
  { name: "NEWS", href: "/news" },
  { name: "ABOUT", href: "/about" },
  { name: "CONTACT", href: "/contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="shadow-lg sticky top-0 z-50 bg-white dark:bg-viking-charcoal/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-viking-charcoal/70 transition-colors">
      <div className="container-fluid flex relative h-24 items-center px-4 sm:px-6 lg:px-12">
        {/* Logo on the far left */}
        <Link href="/" className="flex items-center h-full group mr-4">
          <img
            src="/images/logo.png"
            alt="Oslo Vikings logo"
            className="h-24 w-auto drop-shadow-lg transition-transform group-hover:scale-110"
            style={{ maxHeight: 96 }}
            draggable={false}
          />
          <span className="sr-only">Home</span>
        </Link>

        {/* Desktop Navigation (pipe-separated) */}
        <div className="hidden md:flex items-center h-full select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navigation.map((item, idx) => {
            const active = pathname === item.href;
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
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "font-teko font-semibold text-4xl tracking-wide uppercase focus:outline-none focus:ring-2 focus:ring-viking-red focus:ring-offset-2 focus:ring-offset-white",
                    "transition-transform duration-200 ease-out transform-gpu", // smooth growth
                    active
                      ? "text-viking-red"
                      : "text-viking-red hover:scale-[1.20]",
                  ].join(" ")}
                  style={{ pointerEvents: "auto" }}
                >
                  {item.name}
                </Link>
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
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="text-viking-red dark:text-viking-gold border border-viking-red/50 dark:border-viking-gold/50 bg-white dark:bg-viking-charcoal hover:bg-viking-red hover:text-white dark:hover:bg-viking-gold dark:hover:text-viking-charcoal focus:ring-2 focus:ring-viking-red dark:focus:ring-viking-gold focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-viking-charcoal rounded-md shadow-sm transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-red-700 dark:bg-viking-charcoal relative z-10 transition-colors">
          <div className="px-2 pt-2 pb-4 space-y-2 sm:px-3 border-t border-red-600 dark:border-viking-gold/30">
            {navigation.map((item, index) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={[
                    "w-full text-center block rounded-md font-teko font-semibold text-3xl uppercase transition-all duration-200 border-2",
                    // Uniform height
                    "h-20 flex items-center justify-center",
                    pathname === item.href
                      ? "bg-white dark:bg-viking-gold text-viking-red dark:text-viking-charcoal border-white dark:border-viking-gold"
                      : "text-white dark:text-viking-gold border-white/60 dark:border-viking-gold/40 bg-red-700/40 dark:bg-viking-charcoal/40 hover:bg-white hover:text-viking-red hover:border-white dark:hover:bg-viking-gold dark:hover:text-viking-charcoal dark:hover:border-viking-gold",
                  ].join(" ")}
                  onClick={() => setIsOpen(false)}
                  style={{ pointerEvents: "auto" }}
                >
                  {item.name}
                </Link>
                {index < navigation.length - 1 && (
                  <div className="border-b border-red-600/50 dark:border-viking-gold/30 my-1"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
