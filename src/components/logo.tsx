// src/components/logo.tsx
// Top-left wordmark with a dotted hover accent links back to the homepage.

"use client";

import Link from "next/link";

import { HoverSparkAccent } from "@/components/hover-spark-accent";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  tone?: "light" | "dark";
};

export function Logo({ className }: LogoProps) {
  return (
    <TooltipProvider delayDuration={280}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/"
            prefetch
            aria-label="Galaxisok — vissza a főoldalra"
            className={cn(
              "site-logo relative isolate inline-flex items-center overflow-visible font-[family-name:var(--font-display)] text-base font-semibold leading-none tracking-[0.22em] text-white uppercase min-[380px]:text-lg min-[380px]:tracking-[0.32em] sm:text-xl",
              className,
            )}
          >
            <span className="relative inline-block">
              <HoverSparkAccent variant="logo" />
              Galaxisok
            </span>
          </Link>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          sideOffset={10}
          className="border-0 bg-white/92 px-3 py-1.5 font-[family-name:var(--font-display)] text-[11px] tracking-[0.08em] text-[#050b1c] shadow-none"
        >
          vissza a főoldalra
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
