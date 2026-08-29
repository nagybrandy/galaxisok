// src/app/koncertek/page.tsx
// Upcoming dates from the WordPress Koncertek CPT. No images, just the facts.

import type { Metadata } from "next";

import {
  AddAllConcertsLink,
  AddToGoogleCalendarLink,
  ConcertCalendarProvider,
} from "@/components/concert-calendar";
import { PageShell } from "@/components/page-shell";
import { formatHuDateTimeParts, getConcerts } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Koncertek",
  description: "A Galaxisok közelgő koncertjei.",
};

function ConcertWhen({ value }: { value: string }) {
  const parts = formatHuDateTimeParts(value);
  if (!parts) {
    return <>{value.replace("T", " ")}</>;
  }

  return (
    <span className="flex flex-col">
      <span className="flex flex-row flex-wrap items-baseline gap-x-1.5 sm:flex-col sm:items-start sm:gap-x-0">
        <span>{parts.year}</span>
        <span>{parts.day}</span>
      </span>
      <span>{parts.time}</span>
    </span>
  );
}

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
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 py-7 sm:grid-cols-[12rem_minmax(0,1fr)_auto] sm:gap-3"
                >
                  <time
                    dateTime={concert.startsAt ?? undefined}
                    className="col-start-1 row-start-1 text-left text-sm leading-6 tracking-[0.08em] text-white/70"
                  >
                    {concert.startsAt ? (
                      <ConcertWhen value={concert.startsAt} />
                    ) : (
                      "Időpont később"
                    )}
                  </time>
                  <div className="col-start-1 row-start-2 min-w-0 sm:col-start-2 sm:row-start-1">
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
                  <div className="col-start-2 row-start-1 row-span-2 flex flex-row items-center justify-end gap-2 sm:col-start-3 sm:row-start-1 sm:row-span-1">
                    {concert.ticketUrl ? (
                      <a
                        href={concert.ticketUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="concert-ticket"
                      >
                        <span>Jegy</span>
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
