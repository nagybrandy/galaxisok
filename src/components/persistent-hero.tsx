// src/components/persistent-hero.tsx
// Home viewport spacer. Solid site background only — no hero photo.

"use client";

import { usePathname } from "next/navigation";

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
      <div className="persistent-hero-frame" />
    </div>
  );
}
