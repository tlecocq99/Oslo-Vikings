"use client";

import { storyblokInit, apiPlugin } from "@storyblok/react";
import Page from "./components/Page";
import Hero from "./components/Hero";
import PlayerCard from "./components/PlayerCard";
import NewsCard from "./components/NewsCard";
import GameCard from "./components/GameCard";

const components = {
  page: Page,
  hero: Hero,
  player_card: PlayerCard,
  news_card: NewsCard,
  game_card: GameCard,
};

// Initialize Storyblok with components
storyblokInit({
  accessToken:
    process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN ||
    "VuTHerLCsvoGkSPWQ2k5QAtt",
  use: [apiPlugin],
  components,
});

export default function StoryblokProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
