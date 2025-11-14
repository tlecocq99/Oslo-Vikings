"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const merchItems = [
  { src: "/images/merch/Merch1.png", alt: "Oslo Vikings merchandise 1" },
  { src: "/images/merch/Merch2.png", alt: "Oslo Vikings merchandise 2" },
  { src: "/images/merch/Merch3.png", alt: "Oslo Vikings merchandise 3" },
  { src: "/images/merch/Merch4.png", alt: "Oslo Vikings merchandise 4" },
  { src: "/images/merch/Merch5.png", alt: "Oslo Vikings merchandise 5" },
  { src: "/images/merch/Merch6.png", alt: "Oslo Vikings merchandise 6" },
  { src: "/images/merch/Merch7.png", alt: "Oslo Vikings merchandise 7" },
  { src: "/images/merch/Merch8.png", alt: "Oslo Vikings merchandise 8" },
];

export default function ShopPage() {
  const items = useMemo(() => merchItems, []);
  const [activeItem, setActiveItem] = useState<
    (typeof merchItems)[number] | null
  >(null);

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-white dark:bg-background transition-colors">
        <section className="py-20 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-viking-charcoal dark:text-gray-100">
              You&apos;re here early!
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              This part of the site is still under construction. We&apos;re
              working hard to get it launched as soon as possible. In the
              meantime, feel free to check out what&apos;s currently available
              for purchase at our merchandise stands on game day.
            </p>
            <div className="inline-flex flex-col items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-viking-surface px-6 py-8 shadow-sm">
              <p className="text-base text-gray-600 dark:text-gray-300">
                Want to stay in the loop? Follow us on social for restock alerts
                and online shop updates.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="https://www.instagram.com/oslovikings/"
                  className="rounded-full border border-viking-red px-5 py-2 text-sm font-semibold uppercase tracking-wide text-viking-red transition-colors hover:bg-viking-red hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </Link>
                <Link
                  href="https://www.facebook.com/OsloVikings/"
                  className="rounded-full border border-viking-red px-5 py-2 text-sm font-semibold uppercase tracking-wide text-viking-red transition-colors hover:bg-viking-red hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-viking-charcoal dark:text-gray-100 text-center mb-10">
              Merch you can find at the stands today
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item, index) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className="group h-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-viking-red focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#1a1a1a]"
                >
                  <figure className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-viking-surface shadow-sm transition-transform group-hover:-translate-y-1">
                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority={index < 2}
                      />
                    </div>
                    <figcaption className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">
                      Game day exclusive
                    </figcaption>
                  </figure>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Dialog
        open={Boolean(activeItem)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveItem(null);
          }
        }}
      >
        <DialogContent className="w-full max-w-[90vw] md:max-w-4xl border-none bg-transparent p-0 shadow-none">
          {activeItem && (
            <figure className="overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-viking-surface">
              <DialogTitle className="sr-only">{activeItem.alt}</DialogTitle>
              <DialogDescription className="sr-only">
                Expanded view of our current game day merchandise.
              </DialogDescription>
              <div className="relative flex h-[70vh] min-h-[360px] w-full items-center justify-center bg-viking-red dark:bg-black/60">
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 90vw, 70vw"
                  priority
                />
              </div>
              <figcaption className="px-6 py-4 text-center text-base font-medium text-viking-charcoal dark:text-gray-200">
                {activeItem.alt}
              </figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
