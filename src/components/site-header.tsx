// src/components/site-header.tsx
// Same transparent menu on every page. Stays pinned to the top of the viewport.

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
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex items-start justify-between gap-4 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-5 sm:px-8 sm:pt-[max(1.75rem,env(safe-area-inset-top))] sm:pb-7">
      <Logo tone={tone} className="pointer-events-auto relative z-10 shrink-0" />
      <div className="pointer-events-auto flex min-w-0 flex-col items-end gap-3 sm:flex-row sm:items-center sm:gap-5">
        <MobileMenu links={links} />
        <SiteNav tone={tone} links={links} className="hidden sm:flex" />
        <SocialLinks tone={tone} className="hidden sm:flex" />
      </div>
    </header>
  );
}
