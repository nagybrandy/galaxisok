// src/components/site-nav.tsx
// Uppercase menu. Hover lifts the item; the current route stays lit.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_LINKS, shouldPrefetchRoute, type NavLink } from "@/lib/site";
import { cn } from "@/lib/utils";

type SiteNavProps = {
  tone?: "light" | "dark";
  links?: NavLink[];
  className?: string;
};

export function SiteNav({ links = NAV_LINKS, className }: SiteNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("pointer-events-auto flex flex-nowrap items-center gap-x-3 xl:gap-x-5", className)}>
      {links.map((link) => {
        const active =
          !link.external &&
          (pathname === link.href ||
            (link.href !== "/" && pathname.startsWith(`${link.href}/`)));

        const itemClass = cn(
          "nav-link font-[family-name:var(--font-fuse)] text-[13px] font-normal tracking-[0.12em] uppercase xl:text-[15px] xl:tracking-[0.16em]",
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
          <Link
            key={link.href}
            href={link.href}
            prefetch={shouldPrefetchRoute(link.href)}
            aria-current={active ? "page" : undefined}
            className={itemClass}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
