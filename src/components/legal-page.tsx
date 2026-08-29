// src/components/legal-page.tsx
// Shared frame for ÁSZF and privacy copy.

import type { ReactNode } from "react";

import { PageShell } from "./page-shell";

type LegalPageProps = {
  title: string;
  children: ReactNode;
};

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <PageShell>
      <article className="legal-copy mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8">
        <h1 className="page-title page-title-lg text-glow">{title}</h1>
        <div className="mt-10 space-y-5 text-sm leading-7 text-white/70 [&_h2]:mt-10 [&_h2]:text-xs [&_h2]:tracking-[0.22em] [&_h2]:text-white [&_h2]:uppercase [&_a]:underline [&_a]:underline-offset-4">
          {children}
        </div>
      </article>
    </PageShell>
  );
}
