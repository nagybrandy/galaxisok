// src/app/page.tsx
// Fruit Bats-style landing: full-bleed centered photo, logo top-left, no extra copy.

import Image from "next/image";

import { SiteHeader } from "@/components/site-header";
import { SocialLinks } from "@/components/social-links";

export default function HomePage() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black">
      <Image
        src="/hero.png"
        alt="Szabó Benedek és a Galaxisok"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/35 via-transparent to-black/20" />
      <SiteHeader showBlog />
      <div className="absolute right-5 bottom-5 z-20 sm:right-8 sm:bottom-8">
        <SocialLinks />
      </div>
    </main>
  );
}
