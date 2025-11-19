import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { cn } from "@/lib/utils";

const boosterHeroDesktop = "/images/backgrounds/boosterBanner.png";
const boosterHeroMobile = "/images/backgrounds/boosterBanner.png";

const PLATINUM_LEVEL = "Platinum Booster";
const CARD_BOX_SHADOW = "0px 1px 12px 4px rgba(0, 0, 0, 0.25)";
const PLATINUM_GLOW_SHADOW =
  "0 0 20px 14px rgba(235, 20, 22, 0.1), 0 0 20px 6px rgba(235, 20, 22, 0.1)";

const boosterPackages = [
  {
    level: "Platinum Booster",
    contribution: "5000 kr",
    headlinePerk: "30% off all kiosk and merch",
    includesPrevious: true,
    color: "rgb(172, 20, 22, 0.80)",
  },
  {
    level: "Gold Booster",
    contribution: "3500 kr",
    headlinePerk: "Free pølse + brus per game",
    includesPrevious: true,
    color: "rgb(252, 211, 77)",
  },
  {
    level: "Silver Booster",
    contribution: "2500 kr",
    headlinePerk: "Free hoodie",
    includesPrevious: true,
    color: "rgb(226, 232, 240)",
  },
  {
    level: "Bronze Booster",
    contribution: "1500 kr",
    headlinePerk: "Free cap",
    includesPrevious: true,
    color: "rgb(253, 186, 116)",
  },
  {
    level: "Entry Level",
    contribution: "500 kr",
    headlinePerk: "Free booster t-shirt",
    includesPrevious: false,
    color: "rgb(186, 230, 253)",
  },
];

type BoosterPackage = (typeof boosterPackages)[number];

export default function BoostersPage() {
  const platinumTier = boosterPackages.find(
    (pkg) => pkg.level === PLATINUM_LEVEL
  );
  const supportingTiers = boosterPackages.filter(
    (pkg) => pkg.level !== PLATINUM_LEVEL
  );

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white dark:bg-viking-charcoal/80 transition-colors">
        <div className="mx-auto max-w-5xl px-4 pt-6 text-center sm:px-6 lg:px-8 mb-10">
          <h1 className="text-3xl font-bold text-viking-charcoal dark:text-white sm:text-4xl py-4">
            The Heart of our Community:
          </h1>
          <h1 className="text-4xl sm:text-5xl font-bold text-viking-charcoal dark:text-gray-200 mb-6 relative after:content-[''] after:block after:h-1 after:w-24 after:bg-viking-red after:rounded-full after:mx-auto after:mt-4">
            The OV Booster Club
          </h1>
        </div>
        <BoosterHero
          desktopImage={boosterHeroDesktop}
          mobileImage={boosterHeroMobile}
          title="Vikings Booster Club"
          description="Join the community backing Oslo Vikings football with vital support."
          tagline="The heart of our community"
        />
        <section className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-6 text-center">
            <div className="space-y-4 text-base text-gray-700 dark:text-gray-200 sm:text-lg">
              <p>
                Our American football family is built on more than just the game
                — it’s built on people. From the athletes on the field to the
                coaches on the sideline, the parents in the stands to the
                passionate supporters who give their time, energy, and resources
                — our community is what makes this club special.
              </p>
              <p>
                Our Booster Club members are the heartbeat of this organization.
                You don’t just cheer for us — you stand with us. You create an
                atmosphere of belonging and pride that extends far beyond game
                day. Your support helps us equip athletes, develop future
                leaders, and provide a place where young people can grow,
                challenge themselves, and be part of something bigger.
              </p>
              <p>
                To our Booster Club: Thank you. Thank you for believing in this
                team, for investing in our vision, and for making this program
                not only possible — but exceptional. Our success isn’t just
                measured in touchdowns and trophies, but in the strength of the
                family behind us. And we are proud and grateful to have you as
                part of it.
              </p>
              <p>
                For the 2026 season, we have put together the below packages of
                perks for our dear Boosters. Choose the one that fits you best!
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            {platinumTier ? (
              <BoosterCard
                key={platinumTier.level}
                pkg={platinumTier}
                isPlatinum
                className="mx-auto w-full max-w-md sm:max-w-lg dark:border-white/70"
              />
            ) : null}
            <div className="grid gap-6 sm:grid-cols-2">
              {supportingTiers.map((pkg) => (
                <BoosterCard key={pkg.level} pkg={pkg} />
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl bg-gray-50 p-6 text-center shadow-sm dark:bg-viking-charcoal/60">
            <p className="text-base font-semibold uppercase tracking-wide text-viking-red dark:text-viking-red">
              All Booster levels receive season tickets to all home games played
              at Frogner stadion! (includes all teams)
            </p>
            <p className="text-base text-gray-700 dark:text-gray-200 sm:text-lg">
              Need an invoice for tax purposes? Any other questions? Email{" "}
              <Link
                href="mailto:booster@oslovikings.com"
                className="font-semibold text-viking-red underline decoration-2 underline-offset-4 transition hover:text-viking-red/80 dark:text-viking-red dark:hover:text-viking-red/80"
              >
                booster@oslovikings.com
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function BoosterCard({
  pkg,
  isPlatinum = false,
  className,
}: {
  pkg: BoosterPackage;
  isPlatinum?: boolean;
  className?: string;
}) {
  const baseShadow = isPlatinum
    ? "0 0 20px 8px rgba(235, 20, 22, 0.38)"
    : CARD_BOX_SHADOW;
  const boxShadow = isPlatinum
    ? `${baseShadow}, ${PLATINUM_GLOW_SHADOW}`
    : baseShadow;

  return (
    <div
      role="listitem"
      className={cn(
        "flex min-h-[220px] w-full flex-col items-center justify-center gap-3 rounded-[9px] px-4 py-8 text-center",
        className
      )}
      style={{
        backgroundColor: pkg.color,
        boxShadow,
        border: "4px solid rgba(255,255,255,0.8)",
      }}
    >
      <span className="text-sm font-semibold uppercase tracking-[0.35em] text-viking-charcoal">
        {pkg.contribution}
      </span>
      <h3 className="text-2xl font-bold text-viking-charcoal">{pkg.level}</h3>
      <div className="flex flex-col gap-2 text-sm font-medium text-viking-charcoal/80">
        <p className="text-base font-semibold text-viking-charcoal">
          {pkg.headlinePerk}
        </p>
        {pkg.includesPrevious ? (
          <p className="uppercase tracking-wide text-xs text-viking-charcoal/70">
            Plus all perks from previous tier!
          </p>
        ) : null}
      </div>
    </div>
  );
}

function BoosterHero({
  desktopImage,
  mobileImage,
  title,
  description,
  tagline,
}: {
  desktopImage?: string;
  mobileImage?: string;
  title: string;
  description: string;
  tagline?: string;
}) {
  const resolvedDesktopImage =
    desktopImage ?? "/images/backgrounds/teamClose.avif";
  const resolvedMobileImage = mobileImage ?? resolvedDesktopImage;
  const subheading = tagline ?? description;

  return (
    <section className="relative w-full overflow-hidden bg-black aspect-[16/9] lg:aspect-auto lg:min-h-[60vh] xl:h-[600px] xl:min-h-0">
      <picture className="pointer-events-none absolute inset-0 block h-full w-full">
        <source media="(min-width: 1024px)" srcSet={resolvedDesktopImage} />
        <img
          src={resolvedMobileImage}
          alt={`${title} background`}
          className="h-full w-full object-cover object-center xl:object-top"
          loading="lazy"
        />
      </picture>
      <div className="absolute inset-0 bg-black/55" aria-hidden />
      <div className="absolute inset-0 z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <h1 className="sr-only">{title}</h1>
        <span className="sr-only" aria-hidden={false}>
          {subheading}
        </span>
        <span className="sr-only" aria-hidden={false}>
          {description}
        </span>
      </div>
    </section>
  );
}
