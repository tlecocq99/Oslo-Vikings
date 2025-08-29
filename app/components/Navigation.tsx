"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Team", href: "/team" },
  { name: "Schedule", href: "/schedule" },
  { name: "News", href: "/news" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="shadow-lg sticky top-0 z-50">
      {/* Top banner with background image */}
      <div
        className="bg-cover bg-center bg-no-repeat h-20"
        style={{
          backgroundImage: `url('/images/navImg.avif')`,
        }}
      >
        {/* Background overlay for better readability */}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                className="text-white hover:bg-white/20"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation links bar underneath */}
      <div className="bg-red-700 border-t border-red-600 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-2 py-3">
            {navigation.map((item, index) => (
              <div key={item.name} className="flex items-center">
                <Link
                  href={item.href}
                  className="text-white hover:text-red-200 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-red-600 cursor-pointer relative z-20"
                  style={{ pointerEvents: "auto" }}
                >
                  {item.name}
                </Link>
                {index < navigation.length - 1 && (
                  <span className="text-red-300 mx-2 select-none">|</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-red-700 relative z-10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-red-600">
            {navigation.map((item, index) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 text-white hover:text-red-200 hover:bg-red-600 rounded-md transition-colors duration-200 font-medium cursor-pointer relative z-20"
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
