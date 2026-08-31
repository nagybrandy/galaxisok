// src/app/kontakt/page.tsx
// Centered Kontakt title plus the WordPress (or fallback) contact blocks.

import type { Metadata } from "next";

import { INNER_PAGE_CENTER } from "@/components/page-heading";
import { PageShell } from "@/components/page-shell";
import { WpCopy } from "@/components/wp-copy";
import { CONTACT_HTML } from "@/lib/contact";
import { getPageBySlug } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Galaxisok — booking, levél, sajtó.",
};

export default async function KontaktPage() {
  const page = await getPageBySlug("kontakt");
  const html = page?.html.trim() ? page.html : CONTACT_HTML;

  return (
    <PageShell>
      <main className={INNER_PAGE_CENTER}>
        <div className="flex w-full max-w-xl flex-col items-center">
          <h1 className="contact-page-title text-glow">Kontakt</h1>
          <WpCopy variant="contact" html={html} />
        </div>
      </main>
    </PageShell>
  );
}
