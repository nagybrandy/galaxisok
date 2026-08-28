// src/app/rolunk/page.tsx
// About page: shorter hero, editorial copy, gallery. Home → here lifts the photo.

import type { Metadata } from "next";
import Link from "next/link";

import { GalleryMasonry } from "@/components/gallery-masonry";
import { GrainOverlay } from "@/components/grain-overlay";
import { PageShell } from "@/components/page-shell";
import { SkeletonImage } from "@/components/skeleton-image";
import { ABOUT_BODY, ABOUT_LEAD } from "@/lib/about";
import { HERO_IMAGE } from "@/lib/site";
import { getGalleryImages } from "@/lib/wordpress";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Rólunk",
  description: ABOUT_LEAD,
};

export default async function RolunkPage() {
  const images = await getGalleryImages();
  const side = images[0];

  return (
    <PageShell flush>
      <section className="rolunk-hero relative overflow-hidden">
        <div className="rolunk-hero-bleed absolute inset-0">
          <SkeletonImage
            src={HERO_IMAGE}
            alt="Galaxisok"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[center_16%]"
          />
          <GrainOverlay />
        </div>
      </section>

      <main className="rolunk-copy mx-auto w-full max-w-6xl flex-1 px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-10">
        <h1 className="font-[family-name:var(--font-display)] text-5xl tracking-[0.22em] text-glow uppercase sm:text-7xl lg:text-8xl">
          Rólunk
        </h1>
        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <div>
            <p className="max-w-3xl font-[family-name:var(--font-display)] text-2xl leading-snug tracking-wide text-white/90 sm:text-4xl sm:leading-tight">
              {ABOUT_LEAD}
            </p>
            <div className="mt-8 max-w-2xl space-y-5 text-base leading-8 text-white/68">
              {ABOUT_BODY.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <Link
                href="/zene"
                className="mt-2 inline-block text-[11px] tracking-[0.28em] text-white/80 uppercase hover:text-white"
              >
                Hallgasd a lemezeket
              </Link>
            </div>
          </div>
          {side ? (
            <div className="rolunk-side-photo relative aspect-[4/5] overflow-hidden">
              <SkeletonImage
                src={side.src}
                alt={side.alt || side.title}
                fill
                sizes="(min-width: 1024px) 20rem, 80vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </div>

        <div className="mt-20 border-t border-white/10 pt-12">
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.2em] uppercase sm:text-5xl">
            Galéria
          </h2>
          <GalleryMasonry images={images} />
        </div>
      </main>
    </PageShell>
  );
}
