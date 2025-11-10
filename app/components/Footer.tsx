import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, MapPin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-viking-charcoal text-white">
      <div className="w-full px-4 sm:px-8 lg:px-14 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-14 h-14 rounded-lg flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Oslo Vikings Logo"
                  width={48}
                  height={48}
                  className="w-18 h-18"
                />
              </div>
              <div>
                <div>
                  <span className="text-xl font-bold text-white">Oslo</span>
                  <span className="text-xl font-bold text-viking-red ml-1">
                    Vikings
                  </span>
                </div>
                <div className="mt-3 flex items-center space-x-4">
                  <Link
                    href="https://x.com/OsloVikings"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Oslo Vikings on X"
                    className="text-gray-300 transition-colors hover:text-viking-red"
                  >
                    <Twitter className="h-7 w-7" />
                  </Link>
                  <Link
                    href="https://www.facebook.com/OsloVikings"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Oslo Vikings on Facebook"
                    className="text-gray-300 transition-colors hover:text-viking-red"
                  >
                    <Facebook className="h-7 w-7" />
                  </Link>
                  <Link
                    href="https://www.instagram.com/oslovikings/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Oslo Vikings on Instagram"
                    className="text-gray-300 transition-colors hover:text-viking-red"
                  >
                    <Instagram className="h-7 w-7" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/team"
                  className="text-gray-300 hover:text-viking-red transition-colors"
                >
                  Team Roster
                </Link>
              </li>
              <li>
                <Link
                  href="/schedule"
                  className="text-gray-300 hover:text-viking-red transition-colors"
                >
                  Game Schedule
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-gray-300 hover:text-viking-red transition-colors"
                >
                  Latest News
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-viking-red transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-viking-red" />
                <span className="text-gray-300 text-sm">Oslo, Norway</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-viking-red" />
                <span className="text-gray-300 text-sm">
                  styret@oslovikings.com
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 pt-6 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Oslo Vikings. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
