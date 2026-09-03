// src/components/night-atmosphere.tsx
// Album-cover night photo behind inner pages. Hidden on the gate.

"use client";

import { usePathname } from "next/navigation";

import { ATMOSPHERE_IMAGE } from "@/lib/site";

export function NightAtmosphere() {
  const pathname = usePathname();

  if (!pathname || pathname === "/kapu" || pathname === "/") {
    return null;
  }

  return (
    <div
      aria-hidden
      className="night-atmosphere pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="night-atmosphere-photo">
        <img
          src={ATMOSPHERE_IMAGE}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="night-atmosphere-img"
        />
      </div>
      <div className="night-atmosphere-solid" />
      <div className="night-atmosphere-wash" />
      <div className="night-atmosphere-dither" />
    </div>
  );
}
