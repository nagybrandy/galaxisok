// src/app/rolunk/page.tsx
// Band photo on top, justified bio below. Copy is the WordPress `rolunk` page.

import type { Metadata } from "next";

import { INNER_PAGE_PROSE } from "@/components/page-heading";
import { PageShell } from "@/components/page-shell";
import { WpCopy } from "@/components/wp-copy";
import { ABOUT_HTML, ABOUT_LEAD } from "@/lib/about";
import { getGalleryImages, getPageBySlug } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rólunk",
  description: ABOUT_LEAD,
};

export default async function RolunkPage() {
  const [page, images] = await Promise.all([
    getPageBySlug("rolunk"),
    getGalleryImages(),
  ]);
  const photo = page?.image ?? images[0] ?? null;
  const html = page?.html.trim() ? page.html : ABOUT_HTML;

  return (
    <PageShell>
      <main className={INNER_PAGE_PROSE}>
        <h1 className="sr-only">Galaxisok · Rólunk</h1>
        {photo ? (
          <div className="rolunk-photo">
            <img
              src={photo.src}
              alt={photo.alt || photo.title}
              decoding="async"
            />
          </div>
        ) : null}
        <WpCopy variant="about" html={html} />
      </main>
    </PageShell>
  );
}
