// src/components/logo.tsx
// Wordmark in the top-left. Hover sparks match the menu, around the whole word.

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
        "site-logo relative isolate inline-flex items-center overflow-visible font-[family-name:var(--font-display)] text-lg font-semibold leading-none tracking-[0.32em] uppercase sm:text-xl",
        tone === "light"
          ? "text-white text-glow"
          : "text-foreground",
        className,
      )}
    >
      <span className="hover-spark-halo" aria-hidden />
      <span className="hover-spark-dots site-logo-spark-start" aria-hidden />
      <span className="hover-spark-dots site-logo-spark-mid" aria-hidden />
      <span className="hover-spark-dots site-logo-spark-end" aria-hidden />
      <span className="relative">Galaxisok</span>
    </Link>
  );
}
