// src/lib/releases.ts
// Bandcamp catalogue shown on /zene. Links stay on the official Bandcamp host.

export type Release = {
  title: string;
  year: string;
  href: string;
};

export const RELEASES: Release[] = [
  {
    title: "Létezem",
    year: "2026",
    href: "https://galaxisok.bandcamp.com/album/l-tezem",
  },
  {
    title: "Ellenszélben",
    year: "2024",
    href: "https://galaxisok.bandcamp.com/album/ellensz-lben",
  },
  {
    title: "Minket ne szeress!",
    year: "2023",
    href: "https://galaxisok.bandcamp.com/album/minket-ne-szeress",
  },
  {
    title: "Történetek mások életéből",
    year: "2020",
    href: "https://galaxisok.bandcamp.com/album/t-rt-netek-m-sok-let-b-l",
  },
  {
    title: "Cím nélküli ötödik lemez",
    year: "2020",
    href: "https://galaxisok.bandcamp.com/album/c-m-n-lk-li-t-dik-lemez",
  },
  {
    title: "Lehet, hogy rólad álmodtam",
    year: "2018",
    href: "https://galaxisok.bandcamp.com/album/lehet-hogy-r-lad-lmodtam",
  },
  {
    title: "Focipályákon sétálsz át éjszaka",
    year: "2017",
    href: "https://galaxisok.bandcamp.com/album/focip-ly-kon-s-t-lsz-t-jszaka",
  },
  {
    title: "A legszebb éveink",
    year: "2015",
    href: "https://galaxisok.bandcamp.com/album/a-legszebb-veink",
  },
  {
    title: "Kapuzárási Piknik",
    year: "2013",
    href: "https://galaxisok.bandcamp.com/album/kapuz-r-si-piknik",
  },
];
