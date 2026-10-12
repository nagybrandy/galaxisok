// src/app/api/newsletter/route.ts
// Same-origin newsletter proxy with validation, honeypot, and rate limiting.

import { NextResponse } from "next/server";

import { subscribeNewsletter } from "@/lib/newsletter";

const MAX_PER_WINDOW = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MIN_FORM_TIME_MS = 1_800;
const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1000;

type Attempt = {
  count: number;
  resetAt: number;
};

type NewsletterRequest = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  startedAt?: unknown;
  aszf?: unknown;
};

const attempts = new Map<string, Attempt>();

function requestKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return Boolean(origin && origin === new URL(request.url).origin);
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const attempt = attempts.get(key);

  if (!attempt || attempt.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  attempt.count += 1;
  attempts.set(key, attempt);
  return attempt.count > MAX_PER_WINDOW;
}

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(value);
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Tiltott kérés." }, { status: 403 });
  }

  if (isRateLimited(requestKey(request))) {
    return NextResponse.json(
      { message: "Túl sok próbálkozás. Várj egy kicsit." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as NewsletterRequest | null;
  if (!body) {
    return NextResponse.json({ message: "Érvénytelen kérés." }, { status: 400 });
  }

  const company = typeof body.company === "string" ? body.company.trim() : "";
  if (company) {
    return NextResponse.json({
      ok: true,
      pending: true,
      message: "Köszönjük! Nézd meg a postaládádat, és erősítsd meg a feliratkozást.",
    });
  }

  if (body.aszf !== true) {
    return NextResponse.json(
      { message: "Az ÁSZF elfogadása kötelező." },
      { status: 400 },
    );
  }

  const startedAt =
    typeof body.startedAt === "number"
      ? body.startedAt
      : Number(body.startedAt);
  const age = Date.now() - startedAt;
  if (
    !Number.isFinite(startedAt) ||
    age < MIN_FORM_TIME_MS ||
    age > MAX_FORM_AGE_MS
  ) {
    return NextResponse.json({ message: "Érvénytelen űrlap." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!validEmail(email)) {
    return NextResponse.json(
      { message: "Érvényes e-mail-címet adj meg." },
      { status: 400 },
    );
  }

  const name =
    typeof body.name === "string" ? body.name.replace(/\s+/g, " ").trim() : "";
  if (name.length < 2 || name.length > 60) {
    return NextResponse.json(
      { message: "Adj meg egy nevet vagy becenevet (2–60 karakter)." },
      { status: 400 },
    );
  }

  const result = await subscribeNewsletter(email, name);
  if (!result.ok) {
    return NextResponse.json(
      { message: result.message },
      { status: result.status },
    );
  }

  return NextResponse.json({
    ok: true,
    pending: result.pending,
    message: result.message,
  });
}
