// src/components/persistent-hero.tsx
// Same optimized home photo stays mounted to avoid flashes between routes.

"use client";

import { usePathname } from "next/navigation";

import { GrainOverlay } from "@/components/grain-overlay";
import { SkeletonImage } from "@/components/skeleton-image";
import { HERO_IMAGE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function PersistentHero() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  if (pathname === "/kapu") {
    return null;
  }

  return (
    <div
      aria-hidden
      className={cn("persistent-hero", onHome ? "is-home" : "is-hidden")}
    >
      <div className="persistent-hero-frame">
        <SkeletonImage
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="persistent-hero-img"
        />
        <GrainOverlay />
      </div>
    </div>
  );
}
