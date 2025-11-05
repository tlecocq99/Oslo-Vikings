"use client";

import { NewsCardContent, type NewsCardProps } from "./NewsCardContent";

export default function NewsCardClient(props: NewsCardProps) {
  return <NewsCardContent {...props} />;
}
