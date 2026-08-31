// src/lib/socials.ts
// Official Galaxisok profiles collected for the landing icon row and footer.

export type SocialKind =
  | "instagram"
  | "facebook"
  | "youtube"
  | "spotify"
  | "apple"
  | "bandcamp"
  | "deezer";

const SOCIAL_KINDS: SocialKind[] = [
  "instagram",
  "facebook",
  "youtube",
  "spotify",
  "apple",
  "bandcamp",
  "deezer",
];

export function isSocialKind(value: string): value is SocialKind {
  return SOCIAL_KINDS.includes(value as SocialKind);
}

export type SocialLink = {
  kind: SocialKind;
  label: string;
  href: string;
};

export const SOCIALS: SocialLink[] = [
  {
    kind: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/galaxisok",
  },
  {
    kind: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/galaxisok",
  },
  {
    kind: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@galaxisok-r4l",
  },
  {
    kind: "spotify",
    label: "Spotify",
    href: "https://open.spotify.com/artist/0oTbG6PYGGhT0vRYqByYEL",
  },
  {
    kind: "apple",
    label: "Apple Music",
    href: "https://music.apple.com/hu/artist/galaxisok/1458523130",
  },
  {
    kind: "deezer",
    label: "Deezer",
    href: "https://www.deezer.com/artist/6206150",
  },
  {
    kind: "bandcamp",
    label: "Bandcamp",
    href: "https://galaxisok.bandcamp.com/music",
  },
];

export const BAND_EMAIL = "galaxisokmail@gmail.com";
export const BAND_PHONE = "+36 30 000 0000";
export const BAND_PHONE_HREF = "tel:+36300000000";
