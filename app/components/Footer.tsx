import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, MapPin } from "lucide-react";
import { TikTokIcon } from "./TikTokIcon";

export default function Footer() {
  return (
    <footer className="bg-viking-charcoal text-white">
      <div className="w-full px-4 sm:px-7 lg:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-9">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-start space-x-2.5 mb-3.5">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Oslo Vikings Logo"
                  width={48}
                  height={48}
                  className="w-16 h-16"
                />
              </div>
              <div>
                <div>
                  <span className="text-xl font-bold text-white">Oslo</span>
                  <span className="text-xl font-bold text-viking-red ml-1">
                    Vikings
                  </span>
                </div>
                <div className="mt-2.5 flex items-center space-x-3">
                  <Link
                    href="https://www.tiktok.com/@oslovikings"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Oslo Vikings on TikTok"
                    className="text-gray-300 transition-colors hover:text-viking-red"
                  >
                    <TikTokIcon className="h-6 w-6" />
                  </Link>
                  <Link
                    href="https://www.facebook.com/OsloVikings"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Oslo Vikings on Facebook"
                    className="text-gray-300 transition-colors hover:text-viking-red"
                  >
                    <Facebook className="h-6 w-6" />
                  </Link>
                  <Link
                    href="https://www.instagram.com/oslovikings/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Oslo Vikings on Instagram"
                    className="text-gray-300 transition-colors hover:text-viking-red"
                  >
                    <Instagram className="h-6 w-6" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-1.5">
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
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <div className="space-y-2.5">
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

        <div className="border-t border-gray-700 mt-4 pt-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Oslo Vikings. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
