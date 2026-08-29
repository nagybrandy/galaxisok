// src/components/site-header.tsx
// Transparent at the top; a quiet wash appears after the page starts scrolling.

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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

const SCROLLED_AFTER = 12;

export function SiteHeader({
  tone = "light",
  links = NAV_LINKS,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLLED_AFTER);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <header
      className={cn(
        "site-header pointer-events-none fixed inset-x-0 top-0 z-[60] flex items-center justify-between gap-4 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-5 sm:px-8 sm:pt-[max(1.75rem,env(safe-area-inset-top))] sm:pb-7",
        scrolled && "is-scrolled",
      )}
    >
      <Logo tone={tone} className="pointer-events-auto relative z-10 inline-flex h-10 shrink-0 items-center leading-none" />
      <div className="pointer-events-auto relative z-10 flex h-10 min-w-0 items-center justify-end gap-3 sm:h-auto sm:flex-row sm:gap-5">
        <MobileMenu links={links} />
        <SiteNav tone={tone} links={links} className="hidden sm:flex" />
        <SocialLinks tone={tone} className="hidden sm:flex" />
      </div>
    </header>
  );
}
