import { NewsCardContent, type NewsCardProps } from "./NewsCardContent";

export type { NewsCardProps };

export default function NewsCard(props: NewsCardProps) {
  return <NewsCardContent {...props} />;
}
