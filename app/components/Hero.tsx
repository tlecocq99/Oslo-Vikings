"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroProps {
  title?: string;
  subtitle?: string;
  background_image?: {
    filename: string;
    alt: string;
    };
    cta_text?: string;
    cta_link?: {
      url: string;
    };
  };

export default function Hero({ title, subtitle, background_image, cta_text, cta_link }: HeroProps) {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: background_image?.filename
          ? `url(${background_image.filename})`
          : `url('/images/backgrounds/team.avif')`,
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 hero-text-shadow animate-fade-in-up">
          {title || "Oslo Vikings"}
        </h1>

        <p className="text-xl sm:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
          {subtitle ||
            "Conquering the field with Norwegian strength and American football passion"}
        </p>

        {cta_text && (
          <div className="animate-fade-in-up">
            <Button
              asChild
              size="lg"
              className="bg-viking-gold hover:bg-viking-gold-dark text-viking-charcoal font-semibold px-8 py-3 text-lg transition-all duration-300 hover:scale-105"
            >
              <Link href={cta_link?.url || "/team"}>{cta_text}</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/10 to-transparent"></div>
    </section>
  );
}
