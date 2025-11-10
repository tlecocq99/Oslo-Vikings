import Link from "next/link";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";

const boosterHeroDesktop = "/images/backgrounds/boosterBanner.png";
const boosterHeroMobile = "/images/backgrounds/boosterBanner.png";

export default function BoosterPage() {
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

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-viking-charcoal/70">
            <table className="min-w-full divide-y divide-gray-200 text-left dark:divide-white/10">
              <caption className="sr-only">
                Booster Club membership levels, contributions, and perks
              </caption>
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-200 text-center"
                  >
                    Level
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-200 text-center"
                  >
                    Contribution
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-200 text-center"
                  >
                    Perks
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                <tr>
                  <th
                    scope="row"
                    className="px-6 py-4 text-base font-semibold text-viking-charcoal dark:text-white text-center"
                  >
                    PLATINUM BOOSTER
                  </th>
                  <td className="px-6 py-4 text-base font-medium text-viking-red dark:text-viking-gold text-center">
                    5000 kr
                  </td>
                  <td className="px-6 py-4 text-base text-gray-700 dark:text-gray-200 text-center">
                    30% off all kiosk and merch, plus all perks below!
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-6 py-4 text-base font-semibold text-viking-charcoal dark:text-white text-center"
                  >
                    GOLD BOOSTER
                  </th>
                  <td className="px-6 py-4 text-base font-medium text-viking-red dark:text-viking-gold text-center">
                    3500 kr
                  </td>
                  <td className="px-6 py-4 text-base text-gray-700 dark:text-gray-200 text-center">
                    Free pølse + brus per game, plus all perks below!
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-6 py-4 text-base font-semibold text-viking-charcoal dark:text-white text-center"
                  >
                    SILVER BOOSTER
                  </th>
                  <td className="px-6 py-4 text-base font-medium text-viking-red dark:text-viking-gold text-center">
                    2500 kr
                  </td>
                  <td className="px-6 py-4 text-base text-gray-700 dark:text-gray-200 text-center">
                    Free hoody, plus all perks below!
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-6 py-4 text-base font-semibold text-viking-charcoal dark:text-white text-center"
                  >
                    BRONZE BOOSTER
                  </th>
                  <td className="px-6 py-4 text-base font-medium text-viking-red dark:text-viking-gold text-center">
                    1500 kr
                  </td>
                  <td className="px-6 py-4 text-base text-gray-700 dark:text-gray-200 text-center">
                    Free cap, plus all perks below!
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-6 py-4 text-base font-semibold text-viking-charcoal dark:text-white text-center"
                  >
                    ENTRY LEVEL
                  </th>
                  <td className="px-6 py-4 text-base font-medium text-viking-red dark:text-viking-gold text-center">
                    500 kr
                  </td>
                  <td className="px-6 py-4 text-base text-gray-700 dark:text-gray-200 text-center">
                    Free booster t-shirt
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-4 rounded-2xl bg-gray-50 p-6 text-center shadow-sm dark:bg-viking-charcoal/60">
            <p className="text-base font-semibold uppercase tracking-wide text-viking-red dark:text-viking-gold">
              All Booster levels receive season tickets to all home games played
              at Frogner stadion! (includes all teams)
            </p>
            <p className="text-base text-gray-700 dark:text-gray-200 sm:text-lg">
              Need an invoice for tax purposes? Any other questions? Email{" "}
              <Link
                href="mailto:booster@oslovikings.com"
                className="font-semibold text-viking-red underline decoration-2 underline-offset-4 transition hover:text-viking-red/80 dark:text-viking-gold dark:hover:text-viking-gold/80"
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
