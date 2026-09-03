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

  const onHome = pathname === "/";
  const tone = onHome ? "light" : "dark";

  return <SiteHeader tone={tone} className={onHome ? "is-hero-chrome" : undefined} />;
}

export function PersistentFooter() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/kapu") {
    return null;
  }

  return <InnerFooter />;
}
