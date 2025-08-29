import {
  getStoryblokApi,
  ISbStoryData,
  storyblokInit,
  apiPlugin,
} from "@storyblok/react";

export interface StoryblokConfig {
  accessToken: string;
  apiRegion?: "us" | "eu" | "ap" | "ca";
  apiVersion?: "v1" | "v2";
  https?: boolean;
  cache?: {
    clear?: "auto" | "manual";
    type?: "memory" | "none";
  };
}

export const storyblokConfig: StoryblokConfig = {
  accessToken:
    process.env.STORYBLOK_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN ||
    "VuTHerLCsvoGkSPWQ2k5QAtt",
  apiRegion: "eu", // Oslo is in Europe
};

// Initialize Storyblok (only once)
storyblokInit({
  accessToken: storyblokConfig.accessToken,
  use: [apiPlugin],
});

/**
 * Fetch a single story from Storyblok
 * @param slug - The story slug
 * @returns Promise<ISbStoryData | null>
 */
export async function fetchStory(slug: string): Promise<ISbStoryData | null> {
  try {
    const storyblokApi = getStoryblokApi();
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: process.env.NODE_ENV === "production" ? "published" : "draft",
    });
    return data?.story || null;
  } catch (error) {
    console.error("Error fetching story:", error);
    return null;
  }
}

/**
 * Fetch multiple stories from Storyblok
 * @param options - Query options
 * @returns Promise<StoryData[]>
 */
export async function fetchStories(
  options: {
    starts_with?: string;
    content_type?: string;
    per_page?: number;
    page?: number;
    sort_by?: string;
  } = {}
): Promise<ISbStoryData[]> {
  try {
    const storyblokApi = getStoryblokApi();
    const { data } = await storyblokApi.get("cdn/stories", {
      version: process.env.NODE_ENV === "production" ? "published" : "draft",
      ...options,
    });
    return data?.stories || [];
  } catch (error) {
    console.error("Error fetching stories:", error);
    return [];
  }
}
