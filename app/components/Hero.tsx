import Image from "next/image";
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
}

export default function Hero({
  title,
  subtitle,
  background_image,
  cta_text,
  cta_link,
}: HeroProps) {
  const heroImageSrc =
    background_image?.filename ?? "/images/backgrounds/testBG1.png";
  const heroImageAlt = background_image?.alt ?? title ?? "Oslo Vikings";
  const href = cta_link?.url ?? "/recruitment";
  const ariaLabel =
    cta_text || subtitle || "Explore Oslo Vikings recruitment opportunities";

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="group relative isolate block min-h-[50vh] md:min-h-[70vh] xl:min-h-screen overflow-hidden bg-viking-red-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-viking-red/60"
    >
      <span className="sr-only">{ariaLabel}</span>

      <Image
        src={heroImageSrc}
        alt={heroImageAlt}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover object-center 2xl:object-contain transition-transform duration-700 ease-out group-hover:scale-105 group-focus-visible:scale-105"
      />

      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-60 group-focus-visible:opacity-60" />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <p className="text-center text-white font-bold uppercase tracking-widest opacity-0 translate-y-6 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 text-2xl sm:text-3xl md:text-5xl px-6">
          What are you waiting for?
          <span className="block text-4xl sm:text-5xl md:text-7xl">
            Click to join OV Now.
          </span>
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
    </Link>
  );
}
