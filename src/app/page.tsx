// src/app/page.tsx
// Temporary main-branch homepage: stacked "coming / soon" that opens galaxisok.hu.

import { LIVE_SITE_URL } from "@/lib/site";

export default function ComingSoonPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background text-foreground">
      <p className="text-sm tracking-[0.4em] uppercase">coming</p>
      <a
        href={LIVE_SITE_URL}
        className="mt-2 text-sm tracking-[0.4em] uppercase underline-offset-4 hover:underline"
      >
        soon
      </a>
    </main>
  );
}
