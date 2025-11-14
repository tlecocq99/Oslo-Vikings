import type { UpcomingEvent } from "@/app/types/event";
import Navigation from "./components/Navigation";
import SplashScreen from "./components/SplashScreen";
import UpcomingEventsBar from "./components/UpcomingEventsBar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import NewsCard from "./components/NewsCard";
import GameCard, { type GameCardProps } from "./components/GameCard";
import PartnersCarousel from "./components/PartnersCarousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Trophy, Users, Calendar } from "lucide-react";
import { Teko } from "next/font/google";
import { fetchUpcomingEvents } from "./services/fetchUpcomingEvents";
import { fetchNewsArticles } from "./services/fetchNews";
import type { Partner } from "./types/partner";
import type { NewsCardProps } from "./components/NewsCardContent";
import type { NewsArticle } from "./types/news";

const teko = Teko({ subsets: ["latin"] });

// Type guard to ensure valid status
function normalizeGameStatus(
  status: string
): "upcoming" | "live" | "completed" {
  if (status === "upcoming" || status === "live" || status === "completed") {
    return status;
  }
  return "upcoming"; // Default fallback
}

function buildFallbackEvents(): UpcomingEvent[] {
  return [
    {
      id: "fallback-game-1",
      title: "Oslo Vikings vs Bergen Bears",
      category: "Game",
      team: "Main",
      date: "2025-09-07",
      time: "15:00",
      startsAt: "2025-09-07T15:00:00Z",
      location: "Viking Stadium, Oslo",
      description: "Season opener at home for the Senior Elite squad.",
      isGame: true,
      homeTeam: "Oslo Vikings",
      awayTeam: "Bergen Bears",
      sport: "Football",
    },
    {
      id: "fallback-game-2",
      title: "Trondheim Thunder vs Oslo Vikings",
      category: "Game",
      team: "Main",
      date: "2025-09-14",
      time: "14:00",
      startsAt: "2025-09-14T14:00:00Z",
      location: "Thunder Field, Trondheim",
      description: "First away trip of the season.",
      isGame: true,
      homeTeam: "Trondheim Thunder",
      awayTeam: "Oslo Vikings",
      sport: "Football",
    },
    {
      id: "fallback-game-3",
      title: "Oslo Vikings D2 vs Stavanger Stallions D2",
      category: "Game",
      team: "D2",
      date: "2025-09-21",
      time: "16:00",
      startsAt: "2025-09-21T16:00:00Z",
      location: "Viking Stadium, Oslo",
      description: "Division 2 showdown at home.",
      isGame: true,
      homeTeam: "Oslo Vikings D2",
      awayTeam: "Stavanger Stallions D2",
      sport: "Football",
    },
    {
      id: "fallback-event-1",
      title: "Club Community Day",
      category: "Community",
      team: "All",
      date: "2025-09-28",
      time: "11:00",
      startsAt: "2025-09-28T11:00:00Z",
      location: "Viking Stadium, Oslo",
      description:
        "Family-friendly events, player meet & greet, and merchandise fair.",
      isGame: false,
    },
    {
      id: "fallback-game-4",
      title: "Oslo Vikings U17 vs Kristiansand Knights U17",
      category: "Game",
      team: "U17",
      date: "2025-10-05",
      time: "13:00",
      startsAt: "2025-10-05T13:00:00Z",
      location: "Knights Arena, Kristiansand",
      description: "Big matchup for the U17 squad.",
      isGame: true,
      homeTeam: "Kristiansand Knights U17",
      awayTeam: "Oslo Vikings U17",
      sport: "Football",
    },
  ];
}

export default async function Home() {
  const heroData = {
    component: "hero",
    title: "Oslo Vikings",
    subtitle:
      "Conquering the field with Norwegian strength and American football passion",
    cta_text: "Join OV Now!",
    cta_link: { url: "/recruitment" },
  };

  const fallbackFeaturedNews = [
    {
      title: "Vikings Dominate Season Opener",
      excerpt:
        "Oslo Vikings secured a commanding 28-14 victory in their season opener against Bergen Bears.",
      author: "Sports Desk",
      date: "2025-01-15",
      category: "Game Recap",
      slug: "vikings-dominate-season-opener",
    },
    {
      title: "New Head Coach Brings Championship Experience",
      excerpt:
        "Former NFL assistant coach joins Oslo Vikings with plans to elevate the program.",
      author: "Team Management",
      date: "2025-01-10",
      category: "Team News",
      slug: "new-head-coach",
    },
  ];

  function formatNewsDate(raw?: string): string | undefined {
    if (!raw) return undefined;
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) {
      return raw;
    }
    return Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(parsed);
  }

  type FallbackNews = (typeof fallbackFeaturedNews)[number];

  function mapNewsArticleToCard(article: NewsArticle): NewsCardProps {
    return {
      title: article.title,
      excerpt: article.excerpt,
      slug: article.slug,
      author: article.author ?? "Oslo Vikings",
      date: formatNewsDate(article.date ?? article.publishedAt),
      category: article.category,
      image: article.image
        ? {
            src: article.image.src,
            alt: article.image.alt,
            placement: article.image.placement,
            credit: article.image.credit,
          }
        : undefined,
    };
  }

  function mapFallbackArticleToCard(article: FallbackNews): NewsCardProps {
    return {
      title: article.title,
      excerpt: article.excerpt,
      slug: article.slug,
      author: article.author ?? "Oslo Vikings",
      date: formatNewsDate(article.date),
      category: article.category,
    };
  }

  const sheetEvents = await fetchUpcomingEvents();
  const upcomingEvents =
    sheetEvents.length > 0 ? sheetEvents : buildFallbackEvents();

  const fallbackUpcomingGame: GameCardProps = {
    home_team: "Oslo Vikings",
    away_team: "Stavanger Stallions",
    date: "2025-01-22",
    time: "15:00",
    location: "Viking Stadium, Oslo",
    status: normalizeGameStatus("upcoming"),
  };

  const eliteUpcomingGameEvent =
    upcomingEvents.find((event) => {
      if (!event.isGame || !event.team) return false;
      const teamKey = String(event.team).toLowerCase().trim();
      return (
        teamKey === "main" ||
        teamKey === "senior elite" ||
        teamKey === "elite" ||
        teamKey === "senior"
      );
    }) ?? upcomingEvents.find((event) => event.isGame);

  const upcomingGame: GameCardProps = eliteUpcomingGameEvent
    ? {
        home_team: eliteUpcomingGameEvent.homeTeam ?? "Oslo Vikings",
        away_team: eliteUpcomingGameEvent.awayTeam ?? "Opponent",
        date: eliteUpcomingGameEvent.date,
        time: eliteUpcomingGameEvent.time ?? "TBD",
        location: eliteUpcomingGameEvent.location,
        status: normalizeGameStatus("upcoming"),
      }
    : fallbackUpcomingGame;

  const newsArticles = await fetchNewsArticles({ limit: 6 });
  const featuredNews: NewsCardProps[] =
    newsArticles.length > 0
      ? newsArticles.slice(0, 2).map(mapNewsArticleToCard)
      : fallbackFeaturedNews.slice(0, 2).map(mapFallbackArticleToCard);

  const partners: Partner[] = [
    {
      name: "RevisionsBureauet AS",
      description:
        "RevisionsBureauet AS is more than just your accountant. That is their motto, and they have been much more for the Oslo Vikings. They are our biggest, most generous supporter and their services are unmatched.",
      website: "https://revisionsbureauet.no",
      logoSrc: "/images/sponsors/RBlogo.svg",
      logoAlt: "RevisionsBureauet AS logo",
    },
    {
      name: "SpareBank 1 Østlandet",
      description:
        "Sparebank 1 Østlandet is Norway's fourth largest savings bank, but they are much more with their work in the community. We love collaborating at their Verdens Kuleste Dag, and appreciate their generous partnership.",
      website: "https://www.sparebank1.no/nb/ostlandet/privat.html",
      logoSrc: "/images/sponsors/sparebank1Logo.svg",
      logoAlt: "SpareBank 1 Østlandet logo",
    },
    {
      name: "Wang Toppidrett",
      description:
        "Founded in 1907, WANG is a leading sports and academic institution. They have been a crucial service partner of the Oslo Vikings for over a decade, providing access to their best in class gym facility.",
      website: "https://www.wang.no/",
      logoSrc: "/images/sponsors/wangLogo.svg",
      logoAlt: "Wang Toppidrett logo",
    },
    {
      name: "Hopstock Helse",
      description:
        "Hopstock Helse is a Norwegian health clinic network offering physiotherapy, chiropractic care, osteopathy, and naprapathy, with additional services like personal training, massage, ultrasound diagnostics, and shockwave treatment.",
      website: "https://hopstockhelse.no/",
      logoSrc: "/images/sponsors/hopstockhelseLogo.png",
      logoAlt: "Hopstock Helse logo",
    },
    {
      name: "TanTan Barber",
      description:
        "TanTan Barber is a highly rated barber in central Oslo, and is the official barber of the Oslo Vikings.",
      website: "https://www.tantanbarbers.no/",
      logoSrc: "/images/sponsors/tantanLogo.webp",
      logoAlt: "TanTan Barber logo",
    },
    {
      name: "&Partners",
      description:
        "&Partners turns local insight into real value, and the Oslo Vikings are proud to have them as an official partner.",
      website: "https://www.partners.no/",
      logoSrc: "/images/sponsors/schalaPartnersLogo.svg",
      logoAlt: "Schala & Partners logo",
    },
    {
      name: "Al-Asali Rørfix",
      description:
        "Keeping Oslo flowing strong — your hometown plumber and proud sponsor of the Oslo Vikings! Strength, reliability, and service you can trust.",
      website: "",
      logoSrc: "/images/sponsors/al-asaliLogo.png",
      logoAlt: "Al-Asali Rørfix logo",
    },
    {
      name: "ShotbyAnika",
      description:
        "Anika Temple does more than just make us look good on the field. She is an ultra talented photographer experienced in portraits, weddings and a wide range of other events. Book before it's too late!",
      website: "https://www.anikatemple.photography/",
      logoSrc: "/images/sponsors/shotbyAnika.png",
      logoAlt: "ShotbyAnika logo",
    },
  ];

  return (
    <>
      <SplashScreen />
      <Navigation />

      {/* Upcoming Games Bar */}
      <UpcomingEventsBar events={upcomingEvents} />

      {/* Hero Section */}
      <Hero {...heroData} />

      {/* Quick Stats Section */}
  <section className="py-16 bg-gray-50 dark:bg-background transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-viking-red rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-viking-charcoal dark:text-viking-red mb-2">
                15
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Championship Wins
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-viking-red-dark rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-viking-charcoal dark:text-viking-red mb-2">
                Over 100
              </h3>
              <p className="text-gray-600 dark:text-gray-200">Active Players</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-viking-red rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-viking-charcoal dark:text-viking-red mb-2">
                39
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Years Established
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
  <section className="py-10 bg-gray-100 dark:bg-viking-surface-alt transition-colors">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-viking-charcoal dark:text-white mb-4">
              Partners
            </h2>
            <p className="text-gray-600 dark:text-gray-200 max-w-2xl mx-auto">
              Proud to collaborate with organizations that strengthen Oslo
              Vikings football on and off the field.
            </p>
          </div>

          <PartnersCarousel partners={partners} />
        </div>
      </section>

      {/* Booster & Grasrot Support Section */}
  <section className="bg-white dark:bg-viking-surface transition-colors">
        <div className="grid min-h-[220px] sm:min-h-[300px] xl:min-h-[360px] grid-cols-1 gap-y-4 px-4 lg:grid-cols-2 lg:gap-y-0 lg:px-0">
          <Link
            href="/booster"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-full min-h-[220px] items-stretch overflow-hidden rounded-xl bg-white transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-viking-red focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:shadow-lg dark:bg-viking-surface-alt dark:focus-visible:ring-offset-[#1a1a1a] sm:min-h-[220px] lg:min-h-[320px] xl:min-h-[360px]"
            aria-label="Explore the Vikings Booster Club"
          >
            <div className="relative flex-1">
              <picture className="relative block h-full w-full items-center justify-center overflow-hidden bg-white dark:bg-black/60">
                <source
                  media="(max-width: 1023px)"
                  srcSet="/images/sponsors/Booster-Tile(770x200).png"
                />
                <Image
                  src="/images/sponsors/Booster-Tile.png"
                  alt="Vikings Booster Club"
                  fill
                  className="object-contain object-center lg:object-contain"
                  sizes="(min-width: 600px) 50vw, 100vw"
                  priority={false}
                />
              </picture>
              <div className="absolute inset-0 bg-black/45" />
            </div>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-viking-surface-alt/90 p-6 text-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100">
              <p className="text-lg font-semibold uppercase tracking-wide">
                Discover the Vikings Booster Club
              </p>
            </div>
          </Link>

          <Link
            href="https://www.norsk-tipping.no/grasrotandelen/din-mottaker/887798052"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-full min-h-[170px] items-stretch rounded-xl bg-white transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-viking-red focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:shadow-lg dark:bg-viking-surface-alt dark:focus-visible:ring-offset-[#1a1a1a] sm:min-h-[220px] lg:min-h-[320px] xl:min-h-[360px]"
            aria-label="Become a Grasrot supporter"
          >
            <div className="relative flex-1">
              <picture className="relative flex h-full w-full items-center justify-center overflow-hidden bg-white dark:bg-black/60">
                <source
                  media="(max-width: 1023px)"
                  srcSet="/images/sponsors/mobileGrasrots.png"
                />
                <Image
                  src="/images/sponsors/grasrots.png"
                  alt="Vikings Grasrot support"
                  fill
                  className="object-contain object-center lg:object-contain"
                  sizes="(min-width: 600px) 50vw, 100vw"
                  priority={false}
                />
              </picture>
              <div className="absolute inset-0 bg-black/45" />
            </div>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-viking-surface-alt/90 p-6 text-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100">
              <p className="text-lg font-semibold uppercase tracking-wide">
                Click here to become a Grasrot supporter today!
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Latest News Section */}
  <section className="py-16 bg-gray-50 dark:bg-background transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-viking-charcoal dark:text-gray-200 mb-4">
              Latest News
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              Stay updated with the latest Oslo Vikings news, game recaps, and
              team announcements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-8">
            {featuredNews.map((news, index) => (
              <NewsCard key={index} {...news} />
            ))}
          </div>

          <div className="text-center">
            <Button
              asChild
              variant="outline"
              className="border-viking-red text-viking-red hover:bg-viking-red hover:text-white"
            >
              <Link href="/news">
                All News <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
