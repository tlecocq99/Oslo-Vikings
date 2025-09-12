"use client";

import { useState, useMemo } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import NewsCard from "../components/NewsCard";
import SearchAndFilter from "../components/SearchAndFilter";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const newsArticles = [
    {
      component: "news_card",
      title: "Vikings Dominate Season Opener",
      excerpt:
        "Oslo Vikings secured a commanding 28-14 victory in their season opener against Bergen Bears with stellar performances from both offense and defense.",
      author: "Sports Desk",
      date: "2025-01-15",
      category: "Game Recap",
      slug: "vikings-dominate-season-opener",
    },
    {
      component: "news_card",
      title: "New Head Coach Brings Championship Experience",
      excerpt:
        "Former NFL assistant coach Stein Eriksen joins Oslo Vikings with plans to elevate the program to new heights with his proven championship methodology.",
      author: "Team Management",
      date: "2025-01-10",
      category: "Team News",
      slug: "new-head-coach",
    },
    {
      component: "news_card",
      title: "Training Camp Highlights: Team Looks Sharp",
      excerpt:
        "Pre-season training camp showcased improved chemistry and new offensive strategies that promise an exciting 2025 season ahead.",
      author: "Coach Staff",
      date: "2025-01-05",
      category: "Training",
      slug: "training-camp-highlights",
    },
    {
      component: "news_card",
      title: "Community Outreach: Vikings Visit Local Schools",
      excerpt:
        "Team members visited Oslo elementary schools to promote sports participation and healthy lifestyles among Norwegian youth.",
      author: "Community Relations",
      date: "2025-01-03",
      category: "Community",
      slug: "community-outreach",
    },
    {
      component: "news_card",
      title: "Draft Day Success: Three New Rookies Join Squad",
      excerpt:
        "Oslo Vikings added three promising rookies to the roster, strengthening both offensive and defensive units for the upcoming season.",
      author: "Draft Analyst",
      date: "2024-12-20",
      category: "Draft",
      slug: "draft-day-success",
    },
    {
      component: "news_card",
      title: "Stadium Renovation Complete: New Fan Experience",
      excerpt:
        "Viking Stadium unveils enhanced facilities including improved seating, concessions, and state-of-the-art sound system for better game day experience.",
      author: "Facilities Team",
      date: "2024-12-15",
      category: "Stadium",
      slug: "stadium-renovation",
    },
  ];

  const categories = [
    "All",
    "Game Recap",
    "Team News",
    "Training",
    "Community",
    "Draft",
    "Stadium",
  ];

  // Filter and search logic
  const filteredArticles = useMemo(() => {
    let filtered = newsArticles;

    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter(
        (article) => article.category === activeCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.author.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, activeCategory]);

  return (
    <>
      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="oslo-gradient py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-viking-charcoal dark:text-gray-200 mb-6 leading-tight relative after:content-[''] after:block after:h-1 after:w-24 after:bg-viking-red after:rounded-full after:mx-auto after:mt-4">
              Vikings News
            </h1>
            <p className="text-lg sm:text-xl text-viking-charcoal/80 dark:text-gray-300 max-w-3xl mx-auto">
              Stay updated with the latest Oslo Vikings news, game recaps, and
              team announcements
            </p>
          </div>
        </section>

        {/* News Content */}
        <section className="py-16 bg-white dark:bg-viking-charcoal/80 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 dark:text-gray-200">
            {/* Search and Filter */}
            <SearchAndFilter
              categories={categories}
              onSearch={setSearchQuery}
              onFilter={setActiveCategory}
              activeCategory={activeCategory}
            />

            {/* Featured Article */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-viking-charcoal dark:text-gray-200 mb-8">
                Featured Story
              </h2>
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-block bg-viking-red text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                      Game Recap
                    </div>
                    <h3 className="text-3xl font-bold text-viking-charcoal mb-4">
                      Vikings Dominate Season Opener
                    </h3>
                    <p className="text-viking-charcoal text-lg mb-6 leading-relaxed">
                      Oslo Vikings showcased their championship potential with a
                      commanding 28-14 victory over Bergen Bears. Quarterback
                      Erik Nordahl threw for 3 touchdowns while the defense held
                      strong throughout the match.
                    </p>
                    <Button className="bg-viking-red hover:bg-viking-red-dark">
                      Read Full Story
                    </Button>
                  </div>
                  <div className="h-64 bg-gradient-to-br from-viking-red to-viking-red-dark rounded-lg flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      Featured Image
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* News Grid */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-viking-charcoal dark:text-gray-200">
                  {activeCategory === "All" ? "All Articles" : activeCategory}
                  <span className="text-viking-red text-lg ml-2">
                    ({filteredArticles.length})
                  </span>
                </h2>
              </div>

              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                  {filteredArticles.map((article, index) => (
                    <NewsCard key={index} {...article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-viking-red/50 mb-4">
                    <Search className="w-16 h-16 mx-auto mb-4" />
                  </div>
                  <h3 className="text-xl font-semibold text-viking-charcoal dark:text-gray-200 mb-2">
                    No articles found
                  </h3>
                  <p className="text-viking-charcoal/70 dark:text-gray-300">
                    {searchQuery
                      ? `No articles match "${searchQuery}"`
                      : `No articles in "${activeCategory}" category`}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-viking-red text-viking-red hover:bg-viking-red hover:text-white"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("All");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Load More - only show if there are articles */}
            {filteredArticles.length > 0 && (
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  className="border-viking-red text-viking-red hover:bg-viking-red hover:text-white"
                >
                  Load More Articles
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
