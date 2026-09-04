// src/app/layout.tsx
// Root chrome: Oswald for display, EB Garamond for literary body copy.

import type { Metadata, Viewport } from "next";
import { EB_Garamond, Oswald } from "next/font/google";
import { headers } from "next/headers";
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
import { isLiveHuHost } from "@/lib/gate";
import {
  HERO_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  siteUrl,
} from "@/lib/site";

import "./globals.css";

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const garamond = EB_Garamond({
  variable: "--font-fuse",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const host = (await headers()).get("host") ?? "";
  const comingSoon = isLiveHuHost(host);

  if (comingSoon) {
    return (
      <html
        lang="hu"
        className={`${oswald.variable} ${garamond.variable} h-full antialiased`}
      >
        <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground">
          {children}
        </body>
      </html>
    );
  }

  return (
    <html
      lang="hu"
      className={`${oswald.variable} ${garamond.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" href={HERO_IMAGE} as="image" type="image/jpeg" />
      </head>
      <body className="site-body relative flex min-h-dvh flex-col font-sans">
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
