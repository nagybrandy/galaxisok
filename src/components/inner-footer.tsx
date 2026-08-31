// src/components/inner-footer.tsx
// Legal links and copyright stay on one row, even on a narrow phone.

"use client";

import Link from "next/link";

import { openCookieSettings } from "@/lib/consent";

export function InnerFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[1] mt-auto border-t border-white/10 px-4 py-4 sm:px-8 sm:py-6">
      <div className="flex flex-nowrap items-center justify-between gap-x-2 text-[10px] tracking-normal text-white/45 uppercase sm:gap-x-6 sm:text-[11px] sm:tracking-[0.2em]">
        <nav className="flex min-w-0 items-center gap-x-3 sm:gap-x-1">
          <Link
            href="/aszf"
            prefetch
            className="inline-flex h-8 items-center hover:text-white sm:h-9 sm:px-2"
          >
            ÁSZF
          </Link>
          <Link
            href="/adatkezeles"
            prefetch
            className="inline-flex h-8 items-center hover:text-white sm:h-9 sm:px-2"
          >
            Adatkezelés
          </Link>
          <button
            type="button"
            className="inline-flex h-8 items-center uppercase hover:text-white sm:h-9 sm:px-2"
            onClick={openCookieSettings}
          >
            Sütik
          </button>
        </nav>
        <p className="shrink-0 whitespace-nowrap leading-none">© {year} Galaxisok</p>
      </div>
    </footer>
  );
}
