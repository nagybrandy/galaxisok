// src/components/legal-page.tsx
// Shared frame for ÁSZF, privacy and cookie copy, with the effective date.

import type { ReactNode } from "react";

import {
  LEGAL_UPDATED_ISO,
  LEGAL_UPDATED_LABEL,
  LEGAL_VERSION,
} from "@/lib/legal";

import { PageShell } from "./page-shell";

type LegalPageProps = {
  title: string;
  children: ReactNode;
};

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <PageShell>
      <article className="legal-copy mx-auto w-full max-w-5xl flex-1 px-5 py-12 sm:px-8">
        <h1 className="page-title page-title-lg text-glow">{title}</h1>
        <p className="legal-meta mt-4 text-xs tracking-[0.18em] text-white/45 uppercase">
          Hatályos: <time dateTime={LEGAL_UPDATED_ISO}>{LEGAL_UPDATED_LABEL}</time>
          {" · "}
          {LEGAL_VERSION}. verzió
        </p>
        <div className="legal-copy-body mt-10 space-y-5 text-sm leading-7 text-white/70 [&_h2]:mt-10 [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-xs [&_h2]:tracking-[0.22em] [&_h2]:text-white [&_h2]:uppercase [&_h3]:mt-6 [&_h3]:font-[family-name:var(--font-display)] [&_h3]:text-[11px] [&_h3]:tracking-[0.18em] [&_h3]:text-white/85 [&_h3]:uppercase [&_a]:underline [&_a]:underline-offset-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1">
          {children}
        </div>
      </article>
    </PageShell>
  );
}
