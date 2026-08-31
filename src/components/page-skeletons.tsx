// src/components/page-skeletons.tsx
// Route placeholders shown while WordPress data is still in flight.

import { PageShell } from "@/components/page-shell";

function Bone({ className }: { className: string }) {
  return <div className={`page-skel ${className}`} />;
}

export function BlogPageSkeleton() {
  return (
    <PageShell>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[11rem_minmax(0,1fr)] lg:items-start lg:gap-14">
          <header>
            <Bone className="h-5 w-24" />
            <div className="mt-6 flex flex-wrap gap-3 lg:flex-col">
              <Bone className="h-4 w-20" />
              <Bone className="h-4 w-16" />
              <Bone className="h-4 w-24" />
            </div>
          </header>
          <section className="min-w-0">
            <ul className="flex flex-col gap-8 sm:gap-10">
              {Array.from({ length: 4 }, (_, index) => (
                <li key={index}>
                  <div className="flex h-[11.5rem] flex-row items-stretch gap-3 sm:h-[13rem] sm:gap-5">
                    <Bone className="h-full w-28 shrink-0 rounded-xl sm:w-44 lg:w-52" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-center gap-3">
                        <Bone className="size-8 rounded-full sm:size-9" />
                        <div className="min-w-0 flex-1">
                          <Bone className="h-3 w-28" />
                          <Bone className="mt-2 h-2.5 w-20" />
                        </div>
                      </div>
                      <Bone className="mt-4 h-5 w-4/5" />
                      <Bone className="mt-auto h-3 w-full" />
                      <Bone className="mt-2 h-3 w-2/3" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
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
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-12 sm:px-8">
        <Bone className="h-5 w-36" />
        <ul className="mt-12 divide-y divide-white/10">
          {Array.from({ length: 4 }, (_, index) => (
            <li key={index} className="flex items-center justify-between gap-4 py-7">
              <div className="min-w-0 flex-1">
                <Bone className="h-3 w-24" />
                <Bone className="mt-3 h-5 w-2/3" />
                <Bone className="mt-2 h-3 w-40" />
              </div>
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
    <PageShell flush>
      <main className="rolunk-copy mx-auto w-full max-w-6xl flex-1 px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-10">
        <Bone className="h-8 w-40 sm:h-12" />
        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <div>
            <Bone className="h-8 w-full max-w-xl" />
            <Bone className="mt-4 h-8 w-4/5 max-w-lg" />
            <Bone className="mt-8 h-3 w-full max-w-2xl" />
            <Bone className="mt-3 h-3 w-full max-w-2xl" />
            <Bone className="mt-3 h-3 w-2/3 max-w-xl" />
          </div>
          <Bone className="aspect-[4/5] w-full" />
        </div>
        <div className="mt-20 border-t border-white/10 pt-12">
          <Bone className="h-6 w-32" />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Bone className="aspect-[4/5]" />
            <Bone className="aspect-[4/5]" />
            <Bone className="aspect-[4/5]" />
          </div>
        </div>
      </main>
    </PageShell>
  );
}

export function NewsletterPageSkeleton() {
  return (
    <PageShell>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-5 py-12 sm:px-8">
        <Bone className="h-5 w-32" />
        <Bone className="mt-5 h-3 w-64" />
        <Bone className="mt-10 h-12 w-full" />
        <Bone className="mt-3 h-12 w-40" />
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
