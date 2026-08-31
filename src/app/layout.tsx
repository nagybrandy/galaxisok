// src/app/layout.tsx
// Root chrome: poster-like display face, hero as default SEO image.

import type { Metadata, Viewport } from "next";
import { Geist, Oswald } from "next/font/google";
import { Suspense } from "react";

import { CookieConsent } from "@/components/cookie-consent";
import { HomeSpotlight } from "@/components/home-spotlight";
import { NavigationFeedback } from "@/components/navigation-feedback";
import { NightAtmosphere } from "@/components/night-atmosphere";
import { PageFade } from "@/components/page-fade";
import { PersistentFooter, PersistentHeader } from "@/components/persistent-chrome";
import { PersistentHero } from "@/components/persistent-hero";
import { RoutePrefetcher } from "@/components/route-prefetcher";
import { ScrollToTop } from "@/components/scroll-to-top";
import { HERO_IMAGE, SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png" }],
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "hu_HU",
    type: "website",
    siteName: SITE_NAME,
    images: [
      {
        url: HERO_IMAGE,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [HERO_IMAGE],
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="hu"
      className={`${geistSans.variable} ${oswald.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" href={HERO_IMAGE} as="image" type="image/jpeg" />
        <link rel="preload" href="/atmosphere.jpg" as="image" type="image/jpeg" />
      </head>
      <body className="relative flex min-h-full flex-col bg-[#050b1c] font-sans text-white">
        <NightAtmosphere />
        <PersistentHeader />
        <PersistentHero />
        <HomeSpotlight />
        <Suspense fallback={null}>
          <ScrollToTop />
          <NavigationFeedback />
        </Suspense>
        <RoutePrefetcher />
        <PageFade>{children}</PageFade>
        <PersistentFooter />
        <CookieConsent />
      </body>
    </html>
  );
}
