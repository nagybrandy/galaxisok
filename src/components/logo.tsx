// src/components/logo.tsx
// Wordmark in the top-left. Hover brings up the same spark dots as the menu.

import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  tone?: "light" | "dark";
};

export function Logo({ className, tone = "light" }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Galaxisok — kezdőlap"
      className={cn(
        "site-logo relative isolate overflow-visible font-[family-name:var(--font-display)] text-lg font-semibold tracking-[0.32em] uppercase sm:text-xl",
        tone === "light"
          ? "text-white text-glow"
          : "text-foreground",
        className,
      )}
    >
      <span className="hover-spark-dots" aria-hidden />
      <span className="relative">Galaxisok</span>
    </Link>
  );
}
