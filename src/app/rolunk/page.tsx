// src/app/rolunk/page.tsx
// Band copy only. The shrinking photo lives in the layout.

import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { ABOUT_BODY, ABOUT_LEAD } from "@/lib/about";

export const metadata: Metadata = {
  title: "Rólunk",
  description: ABOUT_LEAD,
};

export default function RolunkPage() {
  return (
    <PageShell flush>
      <main className="rolunk-copy mx-auto w-full max-w-3xl flex-1 px-5 pb-16 pt-8 text-center sm:px-8 sm:pb-20 sm:pt-10">
        <h1 className="font-[family-name:var(--font-display)] text-5xl tracking-[0.22em] text-glow uppercase sm:text-7xl lg:text-8xl">
          Rólunk
        </h1>
        <p className="mt-10 font-[family-name:var(--font-display)] text-2xl leading-snug tracking-wide text-white/90 sm:text-4xl sm:leading-tight">
          {ABOUT_LEAD}
        </p>
        <div className="mt-8 space-y-5 text-base leading-8 text-white/68">
          {ABOUT_BODY.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
