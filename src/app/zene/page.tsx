// src/app/zene/page.tsx
// Bandcamp catalogue stays on this site inside an iframe.

import type { Metadata } from "next";

import { BandcampFrame } from "@/components/bandcamp-frame";
import { BANDCAMP_MUSIC_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Zene",
  description: "A Galaxisok lemezei Bandcampen.",
};

export default function ZenePage() {
  return <BandcampFrame src={BANDCAMP_MUSIC_URL} title="Galaxisok — Zene" />;
}
