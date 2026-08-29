// src/app/hirlevel/page.tsx
// Newsletter page. The form requires ÁSZF before subscribe.

import type { Metadata } from "next";

import { NewsletterForm } from "@/components/newsletter-form";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Hírlevél",
  description: "Iratkozz fel a Galaxisok híreire.",
};

export default function HirlevelPage() {
  const embedUrl = process.env.NEXT_PUBLIC_MAILCHIMP_EMBED_URL;

  return (
    <PageShell>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-5 py-12 text-center sm:px-8">
        <h1 className="page-title page-title-lg text-glow">Hírlevél</h1>
        <p className="mt-5 text-white/60">
          Koncertek, lemezek, hírek — csak akkor írunk, ha van mit.
        </p>
        <NewsletterForm embedUrl={embedUrl} />
      </main>
    </PageShell>
  );
}
