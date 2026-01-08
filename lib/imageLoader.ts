import type { ImageProps } from "next/image";

const REMOTE_URL_PATTERN = /^https?:\/\/\S+/i;
const UNOPTIMIZED_FILE_PATTERN = /\.(?:avif|gif|svg)$/i;

function shouldBypassDefaultLoader(src: string): boolean {
  return REMOTE_URL_PATTERN.test(src) || UNOPTIMIZED_FILE_PATTERN.test(src);
}

type LoaderAugmentation = Partial<Pick<ImageProps, "unoptimized">>;

export function getImageLoaderProps(
  src: string | null | undefined
): LoaderAugmentation {
  if (!src || !shouldBypassDefaultLoader(src)) {
    return {};
  }

  return {
    unoptimized: true,
  };
}

export function needsDirectLoad(src: string | null | undefined): boolean {
  return !!src && shouldBypassDefaultLoader(src);
}
