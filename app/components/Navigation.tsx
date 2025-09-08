"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "HOME", href: "/" },
  { name: "TEAM", href: "/team" },
  { name: "SCHEDULE", href: "/schedule" },
  { name: "NEWS", href: "/news" },
  { name: "ABOUT", href: "/about" },
  { name: "CONTACT", href: "/contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="shadow-lg sticky top-0 z-50 bg-white">
      <div className="relative max-w-7xl px-4 sm:px-6 lg:px-8 h-32 flex items-center justify-start">
        {/* Logo on the far left */}
        <Link href="/" className="flex items-center h-full group mr-4">
          <img
            src="/images/splashImg.png"
            alt="Oslo Vikings logo"
            className="h-24 w-auto drop-shadow-lg transition-transform group-hover:scale-110"
            style={{ maxHeight: 96 }}
            draggable={false}
          />
          <span className="sr-only">Home</span>
        </Link>

        {/* Desktop Navigation (pipe-separated) */}
        <div className="hidden md:flex items-center h-full ml-8 select-none">
          {navigation.map((item, idx) => {
            const active = pathname === item.href;
            return (
              <div key={item.name} className="flex items-center">
                {idx > 0 && (
                  <span
                    aria-hidden="true"
                    className="px-3 text-viking-red/40 font-light text-4xl"
                  >
                    |
                  </span>
                )}
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "font-teko font-semibold text-4xl tracking-wide focus:outline-none focus:ring-2 focus:ring-viking-gold focus:ring-offset-2 focus:ring-offset-white",
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

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="text-viking-red border border-viking-red/50 bg-white hover:bg-viking-red hover:text-white focus:ring-2 focus:ring-viking-red focus:ring-offset-2 focus:ring-offset-white rounded-md shadow-sm transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-red-700 relative z-10">
          <div className="px-2 pt-2 pb-4 space-y-2 sm:px-3 border-t border-red-600">
            {navigation.map((item, index) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={[
                    "w-full text-center block rounded-md font-teko font-semibold text-3xl transition-all duration-200 border-2",
                    // Uniform height
                    "h-20 flex items-center justify-center",
                    pathname === item.href
                      ? "bg-white text-viking-red border-white"
                      : "text-white border-white/60 bg-red-700/40 hover:bg-white hover:text-viking-red hover:border-white",
                  ].join(" ")}
                  onClick={() => setIsOpen(false)}
                  style={{ pointerEvents: "auto" }}
                >
                  {item.name}
                </Link>
                {index < navigation.length - 1 && (
                  <div className="border-b border-red-600/50 my-1"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
