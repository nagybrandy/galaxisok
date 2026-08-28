// src/components/concert-calendar.tsx
// Per-show Google Calendar link plus one subscribe URL for every concert.

"use client";

import { CalendarDays, CalendarPlus } from "lucide-react";
import type { ReactNode } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  googleCalendarSubscribeUrl,
  googleCalendarUrl,
  hasCalendarEvent,
  type CalendarConcert,
} from "@/lib/calendar";
import { siteUrl } from "@/lib/site";

type ConcertCalendarProviderProps = {
  children: ReactNode;
};

export function ConcertCalendarProvider({
  children,
}: ConcertCalendarProviderProps) {
  return <TooltipProvider delayDuration={200}>{children}</TooltipProvider>;
}

type AddAllConcertsLinkProps = {
  concerts: CalendarConcert[];
};

export function AddAllConcertsLink({ concerts }: AddAllConcertsLinkProps) {
  const dated = concerts.filter(hasCalendarEvent);
  if (dated.length === 0) {
    return null;
  }

  const href = googleCalendarSubscribeUrl(`${siteUrl()}/api/calendar`);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="concerts-all-link"
          aria-label="Összes koncert hozzáadása a Google Naptárhoz"
        >
          <span className="concerts-all-icon" aria-hidden>
            <CalendarDays className="concerts-all-icon-back" strokeWidth={1.6} />
            <CalendarPlus className="concerts-all-icon-front" strokeWidth={1.6} />
          </span>
        </a>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={6}>
        Összes koncert hozzáadása a Google Naptárhoz
      </TooltipContent>
    </Tooltip>
  );
}

type AddToGoogleCalendarLinkProps = {
  concert: CalendarConcert;
};

export function AddToGoogleCalendarLink({
  concert,
}: AddToGoogleCalendarLinkProps) {
  const href = googleCalendarUrl(concert);
  if (!href) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex size-9 items-center justify-center text-white/70 transition-opacity hover:text-white"
          aria-label="Hozzáadás a Google Naptárhoz"
        >
          <CalendarPlus className="size-5" strokeWidth={1.6} aria-hidden />
        </a>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={6}>
        Hozzáadás a Google Naptárhoz
      </TooltipContent>
    </Tooltip>
  );
}
