// src/app/bg/page.tsx
// Theme picker — try background and text color combinations site-wide.

import type { Metadata } from "next";

import { BgThemePicker } from "@/components/bg-theme-picker";

export const metadata: Metadata = {
  title: "Háttér témák",
  description: "Háttér- és szövegszín témák kipróbálása a Galaxisok oldalon.",
};

export default function BgPage() {
  return <BgThemePicker />;
}
