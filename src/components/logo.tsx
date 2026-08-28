// src/components/logo.tsx
// Wordmark in the top-left. Stays a home link on every route.

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
        "font-[family-name:var(--font-logo)] text-[15px] font-semibold tracking-[0.32em] uppercase sm:text-lg",
        tone === "light" ? "text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]" : "text-foreground",
        className,
      )}
    >
      Galaxisok
    </Link>
  );
}
