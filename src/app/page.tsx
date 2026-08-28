// src/app/page.tsx
// Home is only the photo. The header sits in the layout over it.

import { GrainOverlay } from "@/components/grain-overlay";
import { HeroPhoto } from "@/components/hero-photo";
import { HomeScrollLock } from "@/components/home-scroll-lock";

export default function HomePage() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#050b1c]">
      <HomeScrollLock />
      <HeroPhoto />
      <GrainOverlay />
    </main>
  );
}
