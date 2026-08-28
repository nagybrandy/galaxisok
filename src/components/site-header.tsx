// src/components/site-header.tsx
// Same transparent menu on every page. It sits at the top and scrolls away.

import { NAV_LINKS, type NavLink } from "@/lib/site";

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
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-[60] flex items-start justify-between gap-4 px-5 py-5 sm:px-8 sm:py-7">
      <Logo tone={tone} className="pointer-events-auto shrink-0" />
      <div className="pointer-events-auto flex min-w-0 flex-col items-end gap-3 sm:flex-row sm:items-center sm:gap-5">
        <MobileMenu links={links} />
        <SiteNav tone={tone} links={links} className="hidden sm:flex" />
        <SocialLinks tone={tone} className="hidden sm:flex" />
      </div>
    </header>
  );
}
