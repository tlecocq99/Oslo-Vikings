"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";

interface PageProps {
  blok: {
    component: string;
    body?: any[];
    [key: string]: any;
  };
}

export default function Page({ blok }: PageProps) {
  return (
    <main {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok: any) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  );
}
