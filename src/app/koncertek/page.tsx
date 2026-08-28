// src/app/koncertek/page.tsx
// Upcoming dates from the WordPress Koncertek CPT. No images, just the facts.

import type { Metadata } from "next";

import {
  AddAllConcertsLink,
  AddToGoogleCalendarLink,
  ConcertCalendarProvider,
} from "@/components/concert-calendar";
import { PageShell } from "@/components/page-shell";
import { formatHuDateTime, getConcerts } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Koncertek",
  description: "A Galaxisok közelgő koncertjei.",
};

export default async function KoncertekPage() {
  const concerts = await getConcerts();

  return (
    <PageShell>
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-12 sm:px-8">
        {concerts.length === 0 ? (
          <>
            <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[0.22em] text-glow uppercase sm:text-5xl">
              Koncertek
            </h1>
            <p className="mt-10 text-white/55">
              Itt jelennek meg a WordPressben felvitt koncertek.
            </p>
          </>
        ) : (
          <ConcertCalendarProvider>
            <div className="flex items-center gap-3">
              <h1 className="font-[family-name:var(--font-display)] text-4xl leading-none tracking-[0.22em] text-glow uppercase sm:text-5xl">
                Koncertek
              </h1>
              <AddAllConcertsLink concerts={concerts} />
            </div>
            <ul className="mt-12 divide-y divide-white/10">
              {concerts.map((concert) => (
                <li
                  key={concert.id}
                  className="grid gap-3 py-7 sm:grid-cols-[12rem_minmax(0,1fr)_auto] sm:items-center"
                >
                  <time
                    dateTime={concert.startsAt ?? undefined}
                    className="text-left text-sm tracking-[0.08em] text-white/70"
                  >
                    {concert.startsAt
                      ? formatHuDateTime(concert.startsAt)
                      : "Időpont később"}
                  </time>
                  <div className="min-w-0">
                    <h2 className="text-xl font-medium tracking-tight">
                      {concert.title}
                    </h2>
                    {concert.venue ? (
                      <p className="mt-1 text-sm text-white/55">{concert.venue}</p>
                    ) : null}
                    {concert.description ? (
                      <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
                        {concert.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-row items-center justify-end gap-2">
                    {concert.ticketUrl ? (
                      <a
                        href={concert.ticketUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex h-9 items-center justify-center bg-white px-5 text-[11px] tracking-[0.22em] text-[#050b1c] uppercase hover:bg-white/90"
                      >
                        Jegy
                      </a>
                    ) : (
                      <span className="inline-flex h-9 items-center justify-center text-[11px] tracking-[0.22em] text-white/35 uppercase">
                        Hamarosan
                      </span>
                    )}
                    <AddToGoogleCalendarLink concert={concert} />
                  </div>
                </li>
              ))}
            </ul>
          </ConcertCalendarProvider>
        )}
      </main>
    </PageShell>
  );
}
