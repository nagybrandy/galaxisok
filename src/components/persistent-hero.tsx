// src/components/persistent-hero.tsx
// Same home photo stays mounted. Every visit to `/` plays the appear animation.

"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

import { GrainOverlay } from "@/components/grain-overlay";
import { HERO_IMAGE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function PersistentHero() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const wasHome = useRef(onHome);
  const [cycle, setCycle] = useState(0);

  useLayoutEffect(() => {
    if (onHome && !wasHome.current) {
      setCycle((n) => n + 1);
    }
    wasHome.current = onHome;
  }, [onHome]);

  if (pathname === "/kapu") {
    return null;
  }

  return (
    <div
      aria-hidden
      className={cn("persistent-hero", onHome ? "is-home" : "is-hidden")}
    >
      <div
        key={onHome ? `home-${cycle}` : "away"}
        className={cn("persistent-hero-frame", onHome && "is-appearing")}
      >
        <img
          src={HERO_IMAGE}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="persistent-hero-img"
        />
        <GrainOverlay />
      </div>
    </div>
  );
}
