// src/components/site-header.tsx
// Overlay header: logo top-left, blog link only on inner pages.

import Link from "next/link";

import { cn } from "@/lib/utils";

import { Logo } from "./logo";

type SiteHeaderProps = {
  tone?: "light" | "dark";
  showBlog?: boolean;
};

export function SiteHeader({ tone = "light", showBlog = false }: SiteHeaderProps) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-5 sm:p-8">
      <Logo tone={tone} className="pointer-events-auto" />
      {showBlog ? (
        <nav className="pointer-events-auto">
          <Link
            href="/blog"
            className={cn(
              "text-[11px] font-medium tracking-[0.28em] uppercase",
              tone === "light" ? "text-white/90" : "text-foreground/80",
            )}
          >
            Blog
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
