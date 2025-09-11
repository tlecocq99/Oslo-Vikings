import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-viking-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-14 h-14 rounded-lg flex items-center justify-center">
                <img
                  src="/images/logo.png"
                  alt="Oslo Vikings Logo"
                  className="w-12 h-12 text-white"
                />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Oslo</span>
                <span className="text-xl font-bold text-viking-red ml-1">
                  Vikings
                </span>
              </div>
            </div>
            <p className="text-gray-300 max-w-md">
              Representing Norwegian American Football with pride and
              determination. Join us as we conquer the field with Viking spirit.
            </p>
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
                  info@oslovikings.no
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-viking-red" />
                <span className="text-gray-300 text-sm">+47 XXX XX XXX</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Oslo Vikings. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
