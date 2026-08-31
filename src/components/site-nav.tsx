// src/components/site-nav.tsx
// Uppercase menu. Hover lifts the item; the current route stays lit.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_LINKS, type NavLink } from "@/lib/site";
import { cn } from "@/lib/utils";

type SiteNavProps = {
  tone?: "light" | "dark";
  links?: NavLink[];
  className?: string;
};

export function SiteNav({ links = NAV_LINKS, className }: SiteNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("pointer-events-auto flex flex-wrap items-center gap-x-4 gap-y-2 xl:gap-x-5", className)}>
      {links.map((link) => {
        const active =
          !link.external &&
          (pathname === link.href ||
            (link.href !== "/" && pathname.startsWith(`${link.href}/`)));

        const itemClass = cn(
          "nav-link font-[family-name:var(--font-display)] text-[13px] font-semibold tracking-[0.14em] uppercase xl:text-[15px] xl:tracking-[0.18em]",
          active ? "is-active text-white" : "text-white",
        );

        const label = (
          <>
            <span className="hover-spark-dots" aria-hidden />
            {link.label}
          </>
        );

        if (link.external) {
          return (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className={itemClass}
            >
              {label}
            </a>
          );
        }

        return (
          <Link key={link.href} href={link.href} prefetch className={itemClass}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
