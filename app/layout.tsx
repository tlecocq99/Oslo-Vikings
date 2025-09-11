import "./globals.css";
import type { Metadata } from "next";
import { Inter, Teko } from "next/font/google";
import ErrorBoundary from "./components/ErrorBoundary";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Teko Semibold for navigation / headings
const teko = Teko({
  weight: ["600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-teko",
});

export const metadata: Metadata = {
  title: "Oslo Vikings - Norwegian American Football",
  description:
    "Official website of the Oslo Vikings American Football team. Follow our games, meet the team, and stay updated with the latest news.",
  keywords: ["Oslo Vikings", "American Football", "Norway", "Sports Team"],
  authors: [{ name: "Oslo Vikings" }],
  openGraph: {
    title: "Oslo Vikings - Norwegian American Football",
    description: "Official website of the Oslo Vikings American Football team.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://oslovikings.no",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${teko.variable}`}>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/images/logo.png" />
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
