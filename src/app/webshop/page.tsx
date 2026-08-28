// src/app/webshop/page.tsx
// Bandcamp merch stays on this site inside an iframe.

import type { Metadata } from "next";

import { BandcampFrame } from "@/components/bandcamp-frame";
import { BANDCAMP_MERCH_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Merch",
  description: "Galaxisok merch a Bandcampen.",
};

export default function WebshopPage() {
  return <BandcampFrame src={BANDCAMP_MERCH_URL} title="Galaxisok — Merch" />;
}
