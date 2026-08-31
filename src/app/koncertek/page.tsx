// src/app/koncertek/page.tsx
// Tour list: date + venue + note, city, tickets.

import type { Metadata } from "next";

import {
  AddAllConcertsLink,
  AddToGoogleCalendarLink,
  ConcertCalendarProvider,
} from "@/components/concert-calendar";
import { INNER_PAGE_TOUR } from "@/components/page-heading";
import { PageShell } from "@/components/page-shell";
import { formatTourDate, getConcerts } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Koncertek",
  description: "A Galaxisok közelgő koncertjei.",
};

export default async function KoncertekPage() {
  const concerts = await getConcerts();

  return (
    <PageShell>
      <main className={INNER_PAGE_TOUR}>
        <ConcertCalendarProvider>
          <div className="concerts-head">
            <h1 className="page-title page-title-lg text-glow">Koncertek</h1>
            {concerts.length > 0 ? (
              <AddAllConcertsLink concerts={concerts} />
            ) : null}
          </div>
          {concerts.length === 0 ? (
            <p className="text-white/55">
              Itt jelennek meg a WordPressben felvitt koncertek.
            </p>
          ) : (
            <ul className="concert-list">
              {concerts.map((concert) => {
                const dateLabel = concert.startsAt
                  ? formatTourDate(concert.startsAt)
                  : null;

                const ticketLabel = ["Jegy", dateLabel, concert.venue, concert.city]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <li
                    key={concert.id}
                    className={
                      concert.ticketUrl ? "concert-row has-ticket" : "concert-row"
                    }
                  >
                    {concert.ticketUrl ? (
                      <a
                        href={concert.ticketUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="concert-row-hit"
                        aria-label={ticketLabel}
                      />
                    ) : null}
                    <div className="concert-row-copy">
                      <time
                        dateTime={concert.startsAt ?? undefined}
                        className="concert-row-date"
                      >
                        {dateLabel ?? "Időpont később"}
                      </time>
                      {concert.venue ? (
                        <p className="concert-row-venue">{concert.venue}</p>
                      ) : null}
                      {concert.description ? (
                        <p className="concert-row-note">{concert.description}</p>
                      ) : null}
                    </div>
                    <p className="concert-row-city">{concert.city}</p>
                    <div className="concert-row-actions">
                      {concert.ticketUrl ? (
                        <span className="concert-ticket">
                          <span>Jegy</span>
                        </span>
                      ) : (
                        <span className="concert-ticket is-soon">
                          <span>Hamarosan</span>
                        </span>
                      )}
                      <AddToGoogleCalendarLink concert={concert} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </ConcertCalendarProvider>
      </main>
    </PageShell>
  );
}
