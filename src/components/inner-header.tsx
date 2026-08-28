// src/components/inner-header.tsx
// Solid header for blog routes so the wordmark stays readable off the hero.

import Link from "next/link";

import { Logo } from "./logo";

export function InnerHeader() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/70 bg-background/90 px-5 py-4 backdrop-blur-sm sm:px-8">
      <Logo tone="dark" />
      <nav>
        <Link
          href="/blog"
          className="text-[11px] font-medium tracking-[0.28em] uppercase text-foreground/80"
        >
          Blog
        </Link>
      </nav>
    </header>
  );
}
