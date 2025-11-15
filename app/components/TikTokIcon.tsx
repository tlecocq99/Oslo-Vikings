import Image, { type ImageProps } from "next/image";

type TikTokIconProps = Omit<ImageProps, "src" | "alt" | "width" | "height"> & {
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
};

export const TikTokIcon = ({
  className,
  width = 32,
  height = 32,
  alt = "",
  ...props
}: TikTokIconProps) => {
  return (
    <Image
      src="/images/tiktokIcon.png"
      alt={alt}
      width={width}
      height={height}
      className={className}
      {...props}
    />
  );
};
