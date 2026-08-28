// src/components/hero-photo.tsx
// Tall crop so the band sits near the middle of the viewport, not the top.

import { SkeletonImage } from "@/components/skeleton-image";
import { HERO_IMAGE } from "@/lib/site";

export function HeroPhoto() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div className="absolute inset-x-0 top-0 h-[175dvh]">
        <SkeletonImage
          src={HERO_IMAGE}
          alt="Galaxisok"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-[center_16%]"
        />
      </div>
    </div>
  );
}
