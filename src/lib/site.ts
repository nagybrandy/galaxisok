// src/lib/site.ts
// Brand copy, public URLs, and the header menu used across the site.

export const SITE_NAME = "Galaxisok";
export const SITE_DESCRIPTION =
  "A Galaxisok hivatalos oldala. Hírek, dalok és koncertek.";
export const LIVE_SITE_URL = "https://galaxisok.hu";
export const DEV_SITE_URL = "https://galaxisok-dev.vercel.app";
export const WORDPRESS_PUBLIC_URL = "https://admin.galaxisok.hu";
export const BANDCAMP_MUSIC_URL = "https://galaxisok.bandcamp.com/music";
export const MERCH_URL = "https://shop.bsidemusic.hu/kategoria/galaxisok";
export const HERO_IMAGE = "/hero.jpg";
export const ATMOSPHERE_IMAGE = "/atmosphere.jpg";

export type NavLink = {
  href: string;
  label: string;
  external?: boolean;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/rolunk", label: "Rólunk" },
  { href: "/blog", label: "Blog" },
  { href: "/koncertek", label: "Koncertek" },
  { href: BANDCAMP_MUSIC_URL, label: "Zene", external: true },
  { href: MERCH_URL, label: "Merch", external: true },
  { href: "/hirlevel", label: "Hírlevél" },
  { href: "/kontakt", label: "Kontakt" },
];

export const PREFETCH_ROUTES = [
  "/hirlevel",
  "/aszf",
  "/adatkezeles",
] as const;

export function shouldPrefetchRoute(href: string): boolean {
  return (
    href !== "/rolunk" &&
    href !== "/koncertek" &&
    href !== "/kontakt" &&
    href !== "/blog" &&
    !href.startsWith("/blog/")
  );
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? DEV_SITE_URL;
}
