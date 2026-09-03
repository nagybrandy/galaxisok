// src/components/persistent-chrome.tsx
// Header and footer stay mounted so only the page body fades.

"use client";

import { usePathname } from "next/navigation";

import { useSiteTheme } from "@/components/theme-provider";
import { isLightColor } from "@/lib/theme";

import { InnerFooter } from "./inner-footer";
import { SiteHeader } from "./site-header";

export function PersistentHeader() {
  const pathname = usePathname();
  const { theme } = useSiteTheme();

  if (pathname === "/kapu") {
    return null;
  }

  const tone =
    theme && isLightColor(theme.bg) ? "dark" : "light";

  return <SiteHeader tone={tone} />;
}

export function PersistentFooter() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/kapu") {
    return null;
  }

  return <InnerFooter />;
}
