// src/components/site-header.tsx
// Top-of-page bar. Scrolls away with the document.

"use client";

import { useState } from "react";

import { NAV_LINKS, type NavLink } from "@/lib/site";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { SiteNav } from "./site-nav";
import { SocialLinks } from "./social-links";

type SiteHeaderProps = {
  tone?: "light" | "dark";
  links?: NavLink[];
};

export function SiteHeader({
  tone = "light",
  links = NAV_LINKS,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "site-header pointer-events-none flex items-center justify-between gap-3 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-5 sm:gap-4 sm:px-8 sm:pt-[max(1.75rem,env(safe-area-inset-top))] sm:pb-7",
        menuOpen && "is-menu-open",
      )}
    >
      <Logo
        tone={tone}
        className={cn(
          "pointer-events-auto relative z-20 inline-flex h-10 shrink-0 items-center leading-none",
          menuOpen && "invisible pointer-events-none",
        )}
      />
      <div className="pointer-events-auto relative z-20 flex h-10 min-w-0 items-center justify-end gap-3 sm:gap-5">
        <MobileMenu links={links} open={menuOpen} onOpenChange={setMenuOpen} />
        <SiteNav tone={tone} links={links} className="hidden lg:flex" />
        <SocialLinks tone={tone} className="hidden xl:flex" />
      </div>
    </header>
  );
}
