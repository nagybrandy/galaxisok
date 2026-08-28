// src/components/inner-footer.tsx
// Legal links, cookie settings, and copyright. Socials stay in the header.

"use client";

import Link from "next/link";

import { openCookieSettings } from "@/lib/consent";

export function InnerFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[1] mt-auto border-t border-white/10 px-5 py-6 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-[11px] tracking-[0.2em] text-white/45 uppercase">
        <nav className="flex flex-wrap items-center gap-2">
          <Link href="/aszf" className="inline-flex min-h-9 items-center px-2 hover:text-white">
            ÁSZF
          </Link>
          <Link href="/adatkezeles" className="inline-flex min-h-9 items-center px-2 hover:text-white">
            Adatkezelés
          </Link>
          <button
            type="button"
            className="inline-flex min-h-9 items-center px-2 uppercase hover:text-white"
            onClick={openCookieSettings}
          >
            Sütik
          </button>
        </nav>
        <p>© {year} Galaxisok</p>
      </div>
    </footer>
  );
}
