"use client";

import { Suspense, useEffect, useRef } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
const GoogleMap = dynamic(() => import("@/app/components/GoogleMap"), {
  ssr: false,
});

const MAP_LOCATIONS = [
  {
    id: "stadium",
    title: "Viking Stadium (Frogner Stadium)",
    address: "Middelthuns gate 26, 0368 Oslo, Norway",
  },
  {
    id: "office",
    title: "Head Office",
    address: "Mølleparken 4, 0459 Oslo, Norway",
  },
  {
    id: "gym",
    title: "Wang Gym",
    address: "Kronprinsens gate 5, 0251 Oslo, Norway",
  },
  {
    id: "nih-field",
    title: "NIH Kunstgressbane",
    address: "Sognsveien 220, 0863 Oslo, Norway",
  },
];

function ContactPageContent() {
  const searchParams = useSearchParams();
  const requestedLocation = searchParams.get("location");
  const initialLocationId = requestedLocation
    ? MAP_LOCATIONS.find(
        (loc) => loc.id.toLowerCase() === requestedLocation.toLowerCase()
      )?.id
    : undefined;
  const mapSectionRef = useRef<HTMLElement | null>(null);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const shouldScrollToMap =
      !hasScrolledRef.current &&
      (Boolean(initialLocationId) || hash.replace("#", "") === "map");

    if (!shouldScrollToMap || !mapSectionRef.current) {
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const timeout = window.setTimeout(() => {
      mapSectionRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
      hasScrolledRef.current = true;
    }, 150);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [initialLocationId, requestedLocation]);

  return (
    <>
      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="dark:bg-gray-800 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-viking-charcoal dark:text-gray-200 mb-6 relative after:content-[''] after:block after:h-1 after:w-24 after:bg-viking-red after:rounded-full after:mx-auto after:mt-4">
              Contact Us
            </h1>
            <p className="text-xl text-viking-charcoal/80 dark:text-gray-300/80 max-w-3xl mx-auto">
              Get in touch with the Oslo Vikings organization
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16 bg-white dark:bg-viking-charcoal/80 transition-colors">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div id="contact-form">
                <ContactForm />
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Contact Details */}
                <Card className="bg-white dark:bg-viking-charcoal/70 border border-gray-200 dark:border-gray-700 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-2xl text-viking-charcoal dark:text-gray-100">
                      Get in Touch
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-viking-red rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-viking-charcoal dark:text-gray-100">
                          Email
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          info@oslovikings.no
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          media@oslovikings.no
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-viking-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-viking-charcoal" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-viking-charcoal dark:text-gray-100">
                          Phone
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          +47 XXX XX XXX
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Emergency: +47 XXX XX XXX
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-viking-red rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-viking-charcoal dark:text-gray-100">
                          Address
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Viking Stadium
                          <br />
                          Middelthuns gate 26
                          <br />
                          0368 Oslo, Norway
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-viking-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-viking-charcoal" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-viking-charcoal dark:text-gray-100">
                          Office Hours
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Monday - Friday: 09:00 - 17:00
                          <br />
                          Saturday & Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card className="bg-white dark:bg-viking-charcoal/70 border border-gray-200 dark:border-gray-700 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-xl text-viking-charcoal dark:text-gray-100">
                      Quick Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">
                        Season Tickets
                      </span>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-viking-red text-viking-red hover:bg-viking-red hover:text-white dark:border-viking-red/70"
                      >
                        <Link href="#contact-form">Buy Now</Link>
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">
                        Group Sales
                      </span>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-viking-red text-viking-red hover:bg-viking-red hover:text-white dark:border-viking-red/70"
                      >
                        <Link href="#contact-form">Inquire</Link>
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">
                        Corporate Partnerships
                      </span>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-viking-red text-viking-red hover:bg-viking-red hover:text-white dark:border-viking-red/70"
                      >
                        <Link href="#contact-form">Contact</Link>
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">
                        Media Requests
                      </span>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-viking-red text-viking-red hover:bg-viking-red hover:text-white dark:border-viking-red/70"
                      >
                        <Link href="#contact-form">Submit</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section
          id="map"
          ref={mapSectionRef}
          className="py-16 bg-gray-100 dark:bg-viking-charcoal/60 transition-colors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-viking-charcoal dark:text-gray-200 mb-4">
                Find Us
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Viking Stadium is located in the heart of Oslo
              </p>
            </div>
            <GoogleMap
              locations={MAP_LOCATIONS}
              height={480}
              initialSelectedId={initialLocationId}
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
      <ContactPageContent />
    </Suspense>
  );
}
