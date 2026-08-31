// src/app/hirlevel/page.tsx
// Newsletter page. The form requires ÁSZF before subscribe.

import type { Metadata } from "next";

import { NewsletterForm } from "@/components/newsletter-form";
import { INNER_PAGE_CENTER } from "@/components/page-heading";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Hírlevél",
  description: "Iratkozz fel a Galaxisok híreire.",
};

export default function HirlevelPage() {
  const embedUrl = process.env.NEXT_PUBLIC_MAILCHIMP_EMBED_URL;

  return (
    <PageShell>
      <main className={INNER_PAGE_CENTER}>
        <div className="flex w-full max-w-xl flex-col items-center">
          <h1 className="page-title page-title-lg text-glow">Hírlevél</h1>
          <p className="mt-6 font-[family-name:var(--font-fuse)] font-normal text-white/60">
            Koncertek, lemezek, hírek — csak akkor írunk, ha van mit.
          </p>
          <NewsletterForm embedUrl={embedUrl} />
        </div>
      </main>
    </PageShell>
  );
}
