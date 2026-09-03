// src/components/night-atmosphere.tsx
// Fixed background layer for inner pages. Solid color only.

"use client";

import { usePathname } from "next/navigation";

export function NightAtmosphere() {
  const pathname = usePathname();

  if (!pathname || pathname === "/kapu" || pathname === "/") {
    return null;
  }

  return (
    <div
      aria-hidden
      className="night-atmosphere pointer-events-none fixed inset-0 z-0"
    />
  );
}
