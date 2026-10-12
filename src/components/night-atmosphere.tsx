// src/components/night-atmosphere.tsx
// Document-sized paper layer that scrolls naturally with inner-page content.

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
      className="night-atmosphere pointer-events-none absolute inset-0 z-0"
    />
  );
}
