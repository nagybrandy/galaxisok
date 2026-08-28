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
    kind: "bandcamp",
    label: "Bandcamp",
    href: "https://galaxisok.bandcamp.com",
  },
  {
    kind: "deezer",
    label: "Deezer",
    href: "https://www.deezer.com/artist/6206150",
  },
];

export const BAND_EMAIL = "galaxisokmail@gmail.com";
