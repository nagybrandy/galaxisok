// src/components/persistent-chrome.tsx
// Header and footer stay mounted so only the page body fades.

"use client";

import { usePathname } from "next/navigation";

import { InnerFooter } from "./inner-footer";
import { SiteHeader } from "./site-header";

export function PersistentHeader() {
  const pathname = usePathname();

  if (pathname === "/kapu") {
    return null;
  }

  const tone = pathname === "/" ? "light" : "dark";

  return <SiteHeader tone={tone} />;
}

export function PersistentFooter() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/kapu") {
    return null;
  }

  return <InnerFooter />;
}
