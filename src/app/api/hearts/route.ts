// src/app/api/hearts/route.ts
// Reads and writes post hearts through WordPress. Limits by visitor IP.

import { NextResponse } from "next/server";

import { clampPercent, isHexColor } from "@/lib/hearts";

const DEFAULT_WORDPRESS_URL = "https://admin.galaxisok.hu";

function wordpressUrl(): string {
  return (process.env.WORDPRESS_URL ?? DEFAULT_WORDPRESS_URL).replace(/\/$/, "");
}

function visitorIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip") || "0.0.0.0";
}

export async function GET(request: Request) {
  const postId = Number(new URL(request.url).searchParams.get("postId"));
  if (!Number.isInteger(postId) || postId < 1) {
    return NextResponse.json({ hearts: [], canAdd: false }, { status: 400 });
  }

  const response = await fetch(
    `${wordpressUrl()}/wp-json/galaxisok/v1/hearts/${postId}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "X-Client-IP": visitorIp(request),
        "User-Agent": "Galaxisok/1.0",
      },
    },
  );

  if (!response.ok) {
    return NextResponse.json({ hearts: [], canAdd: false }, { status: 502 });
  }

  return NextResponse.json(await response.json());
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    postId?: number;
    x?: number;
    y?: number;
    color?: string;
  };

  const postId = Number(body.postId);
  const color = String(body.color ?? "");
  if (!Number.isInteger(postId) || postId < 1 || !isHexColor(color)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const response = await fetch(
    `${wordpressUrl()}/wp-json/galaxisok/v1/hearts/${postId}`,
    {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Client-IP": visitorIp(request),
        "User-Agent": "Galaxisok/1.0",
      },
      body: JSON.stringify({
        x: clampPercent(Number(body.x)),
        y: clampPercent(Number(body.y)),
        color,
      }),
    },
  );

  const payload = await response.json().catch(() => ({ ok: false }));
  return NextResponse.json(payload, { status: response.status });
}
