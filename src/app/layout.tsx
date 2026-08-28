// src/app/layout.tsx
// Root chrome: fonts, Hungarian metadata, and a dark cinematic default.

import type { Metadata } from "next";
import { Geist, Syne } from "next/font/google";

import { SITE_DESCRIPTION, SITE_FULL_NAME, SITE_NAME } from "@/lib/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const syne = Syne({
  variable: "--font-logo",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://galaxisok.vercel.app"),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_FULL_NAME,
  openGraph: {
    title: SITE_FULL_NAME,
    description: SITE_DESCRIPTION,
    locale: "hu_HU",
    type: "website",
    images: [{ url: "/hero.png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="hu"
      className={`${geistSans.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
