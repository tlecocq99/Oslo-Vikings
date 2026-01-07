import type { ImageLoader, ImageProps } from "next/image";

const directImageLoader: ImageLoader = ({ src }) => src;

const REMOTE_URL_PATTERN = /^https?:\/\/\S+/i;

function shouldBypassDefaultLoader(src: string): boolean {
  return REMOTE_URL_PATTERN.test(src);
}

type LoaderAugmentation = Partial<Pick<ImageProps, "loader" | "unoptimized">>;

export function getImageLoaderProps(src: string | null | undefined): LoaderAugmentation {
  if (!src || !shouldBypassDefaultLoader(src)) {
    return {};
  }

  return {
    loader: directImageLoader,
    unoptimized: true,
  };
}

export function needsDirectLoad(src: string | null | undefined): boolean {
  return !!src && shouldBypassDefaultLoader(src);
}
