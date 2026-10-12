// src/app/api/comments/route.ts
// Same-origin comment proxy with validation, honeypot, timing, and basic rate limiting.

import { NextResponse } from "next/server";

import {
  getApprovedComments,
  isReservedCommentName,
  submitComment,
  type NewBlogComment,
} from "@/lib/comments";

const MAX_COMMENTS_PER_WINDOW = 4;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MIN_FORM_TIME_MS = 2_500;
const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1000;

type Attempt = {
  count: number;
  resetAt: number;
};

type CommentRequest = {
  postId?: unknown;
  parentId?: unknown;
  authorName?: unknown;
  authorEmail?: unknown;
  content?: unknown;
  company?: unknown;
  startedAt?: unknown;
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
  return attempt.count > MAX_COMMENTS_PER_WINDOW;
}

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(value);
}

function parsePositiveInteger(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseParentId(value: unknown): number | null {
  if (value === undefined || value === null || value === "") {
    return 0;
  }
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
}

export async function GET(request: Request) {
  const postId = parsePositiveInteger(
    new URL(request.url).searchParams.get("postId"),
  );

  if (!postId) {
    return NextResponse.json(
      { ok: false, message: "Érvénytelen bejegyzés." },
      { status: 400 },
    );
  }

  const comments = await getApprovedComments(postId);
  return NextResponse.json(
    { ok: true, comments },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, message: "Érvénytelen kérés." },
      { status: 403 },
    );
  }

  const payload = (await request.json().catch(() => null)) as
    | CommentRequest
    | null;
  if (!payload) {
    return NextResponse.json(
      { ok: false, message: "Hiányos kérés." },
      { status: 400 },
    );
  }

  const postId = parsePositiveInteger(payload.postId);
  const parentId = parseParentId(payload.parentId);
  const authorName =
    typeof payload.authorName === "string" ? payload.authorName.trim() : "";
  const authorEmail =
    typeof payload.authorEmail === "string"
      ? payload.authorEmail.trim().toLowerCase()
      : "";
  const content =
    typeof payload.content === "string" ? payload.content.trim() : "";
  const company =
    typeof payload.company === "string" ? payload.company.trim() : "";
  const startedAt =
    typeof payload.startedAt === "number" ? payload.startedAt : 0;
  const formAge = Date.now() - startedAt;

  if (company) {
    return NextResponse.json({ ok: true, pending: true });
  }

  if (
    formAge < MIN_FORM_TIME_MS ||
    formAge > MAX_FORM_AGE_MS ||
    !postId ||
    parentId === null ||
    authorName.length < 2 ||
    authorName.length > 80 ||
    !validEmail(authorEmail) ||
    content.length < 3 ||
    content.length > 2_000
  ) {
    return NextResponse.json(
      { ok: false, message: "Ellenőrizd a megadott adatokat." },
      { status: 400 },
    );
  }

  if (isRateLimited(requestKey(request))) {
    return NextResponse.json(
      {
        ok: false,
        message: "Túl sok hozzászólás érkezett. Próbáld újra később.",
      },
      { status: 429 },
    );
  }

  if (await isReservedCommentName(authorName, postId)) {
    return NextResponse.json(
      {
        ok: false,
        message: "Ez a név foglalt. Kérlek, válassz másik nevet.",
      },
      { status: 400 },
    );
  }

  const comment: NewBlogComment = {
    postId,
    parentId,
    authorName,
    authorEmail,
    content,
  };
  const result = await submitComment(comment);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: result.message },
      { status: result.status },
    );
  }

  return NextResponse.json({
    ok: true,
    pending: true,
    message: "Köszönjük! A hozzászólás adminisztrátori jóváhagyásra vár.",
  });
}
