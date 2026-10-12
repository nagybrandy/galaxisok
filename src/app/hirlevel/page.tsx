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
  return (
    <PageShell>
      <main className={INNER_PAGE_CENTER}>
        <div className="newsletter-panel">
          <h1 className="page-title page-title-lg newsletter-title text-glow">
            Hírlevél
          </h1>
          <p className="newsletter-intro">
            Koncertek, lemezek, hírek — csak akkor írunk, ha van mit.
          </p>
          <NewsletterForm />
        </div>
      </main>
    </PageShell>
  );
}
