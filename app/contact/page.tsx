"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ContactPerson } from "@/app/types/contact";
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

const formatPhoneHref = (phone: string) => phone.replace(/[^+\d]/g, "");

interface ContactDirectoryProps {
  contacts: ContactPerson[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage: string;
}

const ContactDirectory = ({
  contacts,
  isLoading = false,
  error = null,
  emptyMessage,
}: ContactDirectoryProps) => {
  const sanitizedContacts = contacts.filter((contact) => {
    const position = contact.position?.trim().toLowerCase() ?? "";
    const name = contact.name?.trim().toLowerCase() ?? "";
    const phone = contact.phone?.trim().toLowerCase() ?? "";
    const email = contact.email?.trim().toLowerCase() ?? "";

    const looksLikeHeader =
      ["position", "posisjon", "stilling"].includes(position) &&
      (!name || ["name", "navn"].includes(name)) &&
      (!phone || ["phone", "mobile", "mobil"].includes(phone)) &&
      (!email || ["email", "epost", "e-post"].includes(email));

    return !looksLikeHeader;
  });

  const hasContacts = sanitizedContacts.length > 0;

  return (
    <div className="w-full max-w-none rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-viking-charcoal/60">
      {isLoading ? (
        <div className="p-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Loading directory…
        </div>
      ) : error ? (
        <div className="p-4 text-center text-sm text-red-500 dark:text-red-400">
          {error}
        </div>
      ) : !hasContacts ? (
        <div className="p-2 text-center text-sm text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </div>
      ) : (
        <>
          {/* Stacked cards for small screens to avoid table clipping */}
          <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
            {sanitizedContacts.map((contact, index) => (
              <div
                key={`${contact.position}-${
                  contact.name ?? "unknown"
                }-${index}`}
                className="p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Position
                    </p>
                    <p className="text-sm font-semibold text-viking-charcoal dark:text-gray-100">
                      {contact.position || "—"}
                    </p>
                  </div>
                  {contact.email ? (
                    <a
                      className="text-sm font-medium text-viking-red hover:text-viking-red/80 transition-colors"
                      href={`mailto:${contact.email}`}
                    >
                      Email
                    </a>
                  ) : null}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Name
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {contact.name || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Mobile
                  </p>
                  {contact.phone ? (
                    <a
                      className="text-sm text-gray-800 dark:text-gray-200 underline-offset-2 hover:underline"
                      href={`tel:${formatPhoneHref(contact.phone)}`}
                    >
                      {contact.phone}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-500">
                      —
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  {contact.email ? (
                    <a
                      className="text-sm break-words text-gray-800 dark:text-gray-200 underline-offset-2 hover:underline"
                      href={`mailto:${contact.email}`}
                    >
                      {contact.email}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-500">
                      —
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Original table for md+ screens */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-100 text-left text-sm font-semibold text-viking-charcoal dark:bg-viking-charcoal/50 dark:text-gray-200">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Position
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Mobile
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {sanitizedContacts.map((contact, index) => (
                  <tr
                    key={`${contact.position}-${
                      contact.name ?? "unknown"
                    }-${index}`}
                    className={`${
                      index % 2 === 1
                        ? "bg-gray-50 dark:bg-viking-charcoal/60"
                        : "bg-white dark:bg-viking-charcoal/70"
                    }`}
                  >
                    <td className="border-b border-gray-200 px-4 py-3 text-sm font-medium dark:border-gray-700">
                      {contact.position || "—"}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-3 text-sm text-viking-charcoal dark:border-gray-700 dark:text-gray-100">
                      {contact.name || "—"}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-200 whitespace-nowrap">
                      {contact.phone ? (
                        <a
                          className="transition-colors hover:text-viking-red"
                          href={`tel:${formatPhoneHref(contact.phone)}`}
                        >
                          {contact.phone}
                        </a>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          —
                        </span>
                      )}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-200">
                      {contact.email ? (
                        <a
                          className="break-words transition-colors hover:text-viking-red"
                          href={`mailto:${contact.email}`}
                        >
                          {contact.email}
                        </a>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

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
  const [boardContacts, setBoardContacts] = useState<ContactPerson[]>([]);
  const [centralContacts, setCentralContacts] = useState<ContactPerson[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [contactsError, setContactsError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadContacts() {
      try {
        setContactsLoading(true);
        setContactsError(null);

        const response = await fetch("/api/contacts", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = (await response.json()) as {
          board?: ContactPerson[];
          central?: ContactPerson[];
        };

        if (!isMounted) return;

        setBoardContacts(data.board ?? []);
        setCentralContacts(data.central ?? []);
      } catch (error) {
        if (!isMounted) return;
        console.error("[contacts] Failed to fetch directory", error);
        setContactsError(
          "We're having trouble loading the directory right now. Please try again shortly."
        );
        setBoardContacts([]);
        setCentralContacts([]);
      } finally {
        if (isMounted) {
          setContactsLoading(false);
        }
      }
    }

    loadContacts();

    return () => {
      isMounted = false;
    };
  }, []);

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
        <section className="dark:bg-gray-800 py-12">
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
        <section className="py-6 bg-white dark:bg-viking-charcoal/80 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="w-full bg-white dark:bg-viking-charcoal/70 border border-gray-200 dark:border-gray-700 transition-colors">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 text-left">
                  <CardTitle className="text-2xl font-semibold text-viking-red dark:text-viking-red">
                    Board
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ContactDirectory
                    contacts={boardContacts}
                    isLoading={contactsLoading}
                    error={contactsError}
                    emptyMessage="Board directory will be available soon."
                  />
                </CardContent>
              </Card>

              <Card className="w-full bg-white dark:bg-viking-charcoal/70 border border-gray-200 dark:border-gray-700 transition-colors">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 text-left">
                  <CardTitle className="text-2xl font-semibold text-viking-red dark:text-viking-red">
                    Central Functions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ContactDirectory
                    contacts={centralContacts}
                    isLoading={contactsLoading}
                    error={contactsError}
                    emptyMessage="Central functions will be listed here soon."
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] lg:items-start">
              <div id="contact-form" className="space-y-4">
                <ContactForm />
              </div>

              <Card className="bg-white dark:bg-viking-charcoal/70 border border-gray-200 dark:border-gray-700 transition-colors">
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-xl text-viking-charcoal dark:text-gray-100">
                    Quick Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 px-4 pb-4">
                  <div className="flex items-center justify-between">
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
                  <div className="flex items-center justify-between">
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
                  <div className="flex items-center justify-between">
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
                  <div className="flex items-center justify-between">
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
