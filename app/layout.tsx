import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoryblokProvider from "./StoryblokProvider";
import ErrorBoundary from "./components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <StoryblokProvider>{children}</StoryblokProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
