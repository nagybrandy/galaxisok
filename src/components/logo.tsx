// src/components/logo.tsx
// Wordmark in the top-left. Always returns home.

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
        "font-[family-name:var(--font-display)] text-lg font-semibold tracking-[0.32em] uppercase sm:text-xl",
        tone === "light"
          ? "text-white text-glow"
          : "text-foreground",
        className,
      )}
    >
      Galaxisok
    </Link>
  );
}
