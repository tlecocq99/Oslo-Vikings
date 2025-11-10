import type { SVGProps } from "react";

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M13 4v10.5a3.5 3.5 0 1 1-3.5-3.5h.5" />
      <path d="M13 6a4 4 0 0 0 4 4h2" />
    </svg>
  );
}
