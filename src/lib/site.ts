// src/lib/site.ts
// Brand copy, public URLs, and the header menu used across the site.

export const SITE_NAME = "Galaxisok";
export const SITE_DESCRIPTION =
  "A Galaxisok hivatalos oldala. Hírek, dalok és koncertek.";
export const LIVE_SITE_URL = "https://galaxisok.hu";
export const DEV_SITE_URL = "https://galaxisok-dev.vercel.app";
export const WORDPRESS_PUBLIC_URL = "https://admin.galaxisok.hu";
export const BANDCAMP_MUSIC_URL = "https://galaxisok.bandcamp.com/music";
export const BANDCAMP_MERCH_URL = "https://galaxisok.bandcamp.com/merch";
export const HERO_IMAGE = "/hero.jpg";

export type NavLink = {
  href: string;
  label: string;
  external?: boolean;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/rolunk", label: "Rólunk" },
  { href: "/blog", label: "Blog" },
  { href: "/zene", label: "Zene" },
  { href: "/koncertek", label: "Koncertek" },
  { href: "/webshop", label: "Merch" },
  { href: "/hirlevel", label: "Hírlevél" },
];

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? DEV_SITE_URL;
}

export function isIframePage(pathname: string): boolean {
  return pathname === "/zene" || pathname === "/webshop";
}
