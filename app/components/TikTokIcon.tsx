// Source - https://stackoverflow.com/a
// Posted by BK52
// Retrieved 2025-11-13, License - CC BY-SA 4.0

import type { SVGProps } from "react";

export type TikTokIconProps = SVGProps<SVGSVGElement>;

export const TikTokIcon = ({
  width = 31,
  height = 31,
  className,
  ...props
}: TikTokIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      {...props}
    >
      <g transform="translate(25 25) scale(1.18) translate(-25 -25)">
        <path d="M31.63 17.92c1.14 1.6 3.03 2.65 5.17 2.65c.2 0 .4-.01.6-.03v4.91c-2.58.05-4.99-.76-6.91-2.22v10.93c0 5.57-4.52 10.1-10.1 10.1s-10.1-4.53-10.1-10.1c0-5.58 4.52-10.1 10.1-10.1c.19 0 .38.01.57.02v4.97c-.19-.02-.38-.05-.57-.05c-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9s5-2.13 5-4.77c0-.09.04-21.16.04-21.16h4.6c.44 3.87 3.53 6.93 7.1 7.36v-4.61c-1.35-.02-2.47-.44-3.3-1.12z" />
      </g>
    </svg>
  );
};
