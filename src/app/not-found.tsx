// src/app/not-found.tsx
// Minimal 404 that keeps the band wordmark and a way back home.

import Link from "next/link";

import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo tone="dark" />
      <p className="text-muted-foreground">Ez az oldal nem található.</p>
      <Link href="/" className="text-sm tracking-[0.2em] uppercase underline underline-offset-4">
        Vissza
      </Link>
    </main>
  );
}
