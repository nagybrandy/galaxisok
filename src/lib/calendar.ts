// src/lib/calendar.ts
// Build Google Calendar template URLs and a multi-event ICS from WP concerts.

export type CalendarConcert = {
  id: number;
  title: string;
  description: string;
  venue: string;
  city?: string;
  startsAt: string | null;
  ticketUrl: string | null;
};

const DEFAULT_DURATION_MS = 3 * 60 * 60 * 1000;
const BUDAPEST_TZ = "Europe/Budapest";
const NAIVE_DATETIME =
  /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function toUtcStamp(date: Date): string {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

function hasExplicitOffset(value: string): boolean {
  return /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value.trim());
}

function budapestOffsetMs(utcMs: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BUDAPEST_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(utcMs));

  const map = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );

  const asUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second),
  );

  return asUtc - utcMs;
}

function naiveBudapestToDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
): Date {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);
  const adjusted = utcGuess - budapestOffsetMs(utcGuess);
  return new Date(utcGuess - budapestOffsetMs(adjusted));
}

export function parseConcertStart(startsAt: string | null): Date | null {
  if (!startsAt) {
    return null;
  }

  const trimmed = startsAt.trim();
  const naive = trimmed.match(NAIVE_DATETIME);
  if (naive && !hasExplicitOffset(trimmed)) {
    const [, year, month, day, hour, minute, second] = naive;
    return naiveBudapestToDate(
      Number(year),
      Number(month),
      Number(day),
      Number(hour),
      Number(minute),
      Number(second ?? "0"),
    );
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function concertWindow(startsAt: string | null): {
  start: Date;
  end: Date;
} | null {
  const start = parseConcertStart(startsAt);
  if (!start) {
    return null;
  }

  return { start, end: new Date(start.getTime() + DEFAULT_DURATION_MS) };
}

export const CALENDAR_EVENT_TITLE = "Galaxisok Koncert";

export function eventTitle(): string {
  return CALENDAR_EVENT_TITLE;
}

export function eventLocation(concert: CalendarConcert): string {
  return [concert.venue, concert.city].filter(Boolean).join(", ").trim() || concert.title.trim();
}

export function eventDetails(concert: CalendarConcert): string {
  const parts: string[] = [];
  const clubName = concert.title.trim();
  if (clubName) {
    parts.push(clubName);
  }
  if (concert.description.trim()) {
    parts.push(concert.description.trim());
  }
  if (concert.ticketUrl) {
    parts.push(concert.ticketUrl);
  }
  return parts.join("\n\n");
}

export function hasCalendarEvent(concert: CalendarConcert): boolean {
  return concertWindow(concert.startsAt) !== null;
}

export function googleCalendarUrl(concert: CalendarConcert): string | null {
  const window = concertWindow(concert.startsAt);
  if (!window) {
    return null;
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle(),
    dates: `${toUtcStamp(window.start)}/${toUtcStamp(window.end)}`,
    details: eventDetails(concert),
    location: eventLocation(concert),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function googleCalendarSubscribeUrl(icsUrl: string): string {
  return `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(icsUrl)}`;
}

function icsEscape(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\n|\r/g, "\\n");
}

function foldIcsLine(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) {
    return line;
  }

  const chunks: string[] = [];
  const decoder = new TextDecoder();
  let start = 0;
  let first = true;

  while (start < bytes.length) {
    const limit = first ? 75 : 74;
    let end = Math.min(start + limit, bytes.length);
    while (end > start && (bytes[end] & 0xc0) === 0x80) {
      end -= 1;
    }
    if (end === start) {
      end = Math.min(start + limit, bytes.length);
    }
    const piece = decoder.decode(bytes.slice(start, end));
    chunks.push(first ? piece : ` ${piece}`);
    first = false;
    start = end;
  }

  return chunks.join("\r\n");
}

function icsLine(key: string, value: string): string {
  return foldIcsLine(`${key}:${icsEscape(value)}`);
}

export function concertsToIcs(concerts: CalendarConcert[]): string {
  const now = toUtcStamp(new Date());
  const events = concerts.flatMap((concert) => {
    const window = concertWindow(concert.startsAt);
    if (!window) {
      return [];
    }

    const lines = [
      "BEGIN:VEVENT",
      `UID:concert-${concert.id}@galaxisok.hu`,
      `DTSTAMP:${now}`,
      `DTSTART:${toUtcStamp(window.start)}`,
      `DTEND:${toUtcStamp(window.end)}`,
      icsLine("SUMMARY", eventTitle()),
      icsLine("DESCRIPTION", eventDetails(concert)),
    ];

    const location = eventLocation(concert);
    if (location) {
      lines.push(icsLine("LOCATION", location));
    }

    if (concert.ticketUrl) {
      lines.push(icsLine("URL", concert.ticketUrl));
    }

    lines.push("END:VEVENT");
    return [lines.join("\r\n")];
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Galaxisok//Koncertek//HU",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Galaxisok Koncertek",
    "X-WR-CALDESC:A Galaxisok közelgő koncertjei",
    "NAME:Galaxisok Koncertek",
    "X-WR-TIMEZONE:Europe/Budapest",
    "X-PUBLISHED-TTL:PT1H",
    "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
    ...events,
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
