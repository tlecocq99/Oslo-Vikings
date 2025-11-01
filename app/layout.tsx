import "./globals.css";
import type { Metadata } from "next";
import { Inter, Teko, Lato } from "next/font/google";
import ErrorBoundary from "./components/ErrorBoundary";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "next-themes";
import Script from "next/script";

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

const lato = Lato({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-Lato",
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
    url: "https://oslo-vikings.vercel.app/",
    siteName: "Oslo Vikings",
    images: [
      {
        url: "https://oslo-vikings.vercel.app/og/logo.png",
        alt: "Oslo Vikings",
      },
      // Square (WhatsApp/Slack sometimes prefer)
      {
        url: "https://oslovikings.no/og/og-1200x1200.png",
        width: 1200,
        height: 1200,
        alt: "Oslo Vikings (Square)",
      },
      // 16:9
      {
        url: "https://oslovikings.no/og/og-1600x900.png",
        width: 1600,
        height: 900,
        alt: "Oslo Vikings (16:9)",
      },
    ],
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${teko.variable} ${lato.variable}`}
    >
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Control preview/UI tint fallback */}
      <meta
        name="theme-color"
        content="#ffffff"
        media="(prefers-color-scheme: light)"
      />
      <meta
        name="theme-color"
        content="#0b0e12"
        media="(prefers-color-scheme: dark)"
      />
      <link rel="icon" href="/images/logo.png" />
      <body
        suppressHydrationWarning
        className={`${inter.className} antialiased transition-colors duration-300 max-w-full overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          storageKey="ov-theme"
          defaultTheme="light" // first visit = light
          enableSystem={false} // ignore OS on first load
          disableTransitionOnChange
        >
          <ErrorBoundary>{children}</ErrorBoundary>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
