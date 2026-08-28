// src/app/not-found.tsx
// Minimal 404. The layout header already links home.

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative z-[1] flex min-h-dvh flex-col items-center justify-center gap-6 px-6 pt-20 text-center">
      <p className="text-white/55">Ez az oldal nem található.</p>
      <Link href="/" className="text-sm tracking-[0.2em] uppercase underline underline-offset-4">
        Vissza
      </Link>
    </main>
  );
}
