// src/components/persistent-chrome.tsx
// Header and footer stay mounted so only the page body fades.

"use client";

import { usePathname } from "next/navigation";

import { isIframePage } from "@/lib/site";

import { InnerFooter } from "./inner-footer";
import { SiteHeader } from "./site-header";

export function PersistentHeader() {
  const pathname = usePathname();

  if (pathname === "/kapu") {
    return null;
  }

  return <SiteHeader tone="light" />;
}

export function PersistentFooter() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/kapu" || isIframePage(pathname)) {
    return null;
  }

  return <InnerFooter />;
}
