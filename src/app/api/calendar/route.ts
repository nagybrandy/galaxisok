// src/app/api/calendar/route.ts
// Live ICS of upcoming concerts so Google Calendar can subscribe.

import { NextResponse } from "next/server";

import { concertsToIcs } from "@/lib/calendar";
import { getConcerts } from "@/lib/wordpress";

export async function GET() {
  const concerts = await getConcerts();
  const body = concertsToIcs(concerts);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="galaxisok-koncertek.ics"',
      "Cache-Control": "public, max-age=60",
    },
  });
}
