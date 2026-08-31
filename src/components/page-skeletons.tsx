// src/components/page-skeletons.tsx
// Route placeholders shown while WordPress data is still in flight.

import {
  INNER_PAGE_BLOG,
  INNER_PAGE_CENTER,
  INNER_PAGE_PROSE,
  INNER_PAGE_TOUR,
} from "@/components/page-heading";
import { PageShell } from "@/components/page-shell";

function Bone({ className }: { className: string }) {
  return <div className={`page-skel ${className}`} />;
}

export function BlogPageSkeleton() {
  return (
    <PageShell>
      <main className={INNER_PAGE_BLOG}>
        <section className="min-w-0">
          <ul className="blog-list">
            {Array.from({ length: 4 }, (_, index) => (
              <li key={index} className="blog-list-item py-8 first:pt-0 sm:py-10">
                <div className="flex flex-row items-stretch gap-3 sm:gap-5">
                  <Bone className="w-28 shrink-0 self-stretch rounded-xl sm:w-44" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center gap-3">
                      <Bone className="size-8 rounded-full sm:size-9" />
                      <div className="min-w-0 flex-1">
                        <Bone className="h-3 w-28" />
                        <Bone className="mt-2 h-2.5 w-20" />
                      </div>
                    </div>
                    <Bone className="mt-2 h-5 w-4/5" />
                    <div className="blog-teaser-excerpt">
                      <Bone className="h-3 w-full" />
                      <Bone className="mt-2 h-3 w-2/3" />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </PageShell>
  );
}

export function PostPageSkeleton() {
  return (
    <PageShell>
      <article className="relative z-[1] mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8">
        <Bone className="h-3 w-40" />
        <Bone className="mt-6 h-6 w-3/4" />
        <div className="mt-6 flex items-center gap-3">
          <Bone className="size-10 rounded-full" />
          <div>
            <Bone className="h-3 w-28" />
            <Bone className="mt-2 h-2.5 w-20" />
          </div>
        </div>
        <Bone className="mt-8 aspect-[16/10] w-full rounded-xl" />
        <Bone className="mt-8 h-3 w-full" />
        <Bone className="mt-3 h-3 w-full" />
        <Bone className="mt-3 h-3 w-5/6" />
        <Bone className="mt-3 h-3 w-2/3" />
      </article>
    </PageShell>
  );
}

export function ConcertsPageSkeleton() {
  return (
    <PageShell>
      <main className={INNER_PAGE_TOUR}>
        <div className="concerts-head">
          <Bone className="h-8 w-40 sm:h-12" />
          <Bone className="size-9 shrink-0" />
        </div>
        <ul className="concert-list">
          {Array.from({ length: 4 }, (_, index) => (
            <li key={index} className="concert-row">
              <div className="concert-row-copy w-full">
                <Bone className="h-3 w-28" />
                <Bone className="mt-2 h-4 w-2/3" />
                <Bone className="mt-2 h-3 w-1/2" />
              </div>
              <Bone className="hidden h-4 w-20 sm:block" />
              <Bone className="h-9 w-16 shrink-0" />
            </li>
          ))}
        </ul>
      </main>
    </PageShell>
  );
}

export function AboutPageSkeleton() {
  return (
    <PageShell>
      <main className={INNER_PAGE_PROSE}>
        <Bone className="rolunk-photo aspect-[4/5] w-full max-w-xs" />
        <Bone className="h-3 w-full max-w-xl" />
        <Bone className="mt-3 h-3 w-full max-w-xl" />
        <Bone className="mt-3 h-3 w-4/5 max-w-lg" />
        <Bone className="mt-8 h-3 w-full max-w-xl" />
        <Bone className="mt-3 h-3 w-2/3 max-w-md" />
      </main>
    </PageShell>
  );
}

export function ContactPageSkeleton() {
  return (
    <PageShell>
      <main className={INNER_PAGE_CENTER}>
        <div className="flex w-full max-w-xl flex-col items-center">
          <Bone className="h-8 w-40 sm:h-10" />
          <Bone className="mt-12 h-3 w-24" />
          <Bone className="mt-3 h-3 w-48" />
          <Bone className="mt-10 h-3 w-24" />
          <Bone className="mt-3 h-3 w-48" />
          <Bone className="mt-10 h-3 w-24" />
          <Bone className="mt-3 h-3 w-40" />
        </div>
      </main>
    </PageShell>
  );
}

export function NewsletterPageSkeleton() {
  return (
    <PageShell>
      <main className={INNER_PAGE_CENTER}>
        <div className="flex w-full max-w-xl flex-col items-center">
          <Bone className="h-8 w-48 sm:h-12" />
          <Bone className="mt-6 h-3 w-72" />
          <Bone className="mt-8 h-12 w-full" />
          <Bone className="mt-3 h-12 w-40" />
        </div>
      </main>
    </PageShell>
  );
}

export function LegalPageSkeleton() {
  return (
    <PageShell>
      <article className="legal-copy mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8">
        <Bone className="h-5 w-40" />
        <Bone className="mt-10 h-3 w-full" />
        <Bone className="mt-3 h-3 w-full" />
        <Bone className="mt-3 h-3 w-5/6" />
        <Bone className="mt-3 h-3 w-2/3" />
      </article>
    </PageShell>
  );
}
