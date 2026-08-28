// src/app/api/revalidate/route.ts
// WordPress webhook target. A matching secret refreshes the cached blog.

import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { WORDPRESS_CACHE_TAG } from "@/lib/wordpress";

function isAuthorized(request: Request): boolean {
  const secret = process.env.WORDPRESS_REVALIDATE_SECRET;

  if (!secret) {
    return false;
  }

  const header = request.headers.get("x-revalidate-secret");
  const url = new URL(request.url);
  const querySecret = url.searchParams.get("secret");

  return header === secret || querySecret === secret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  revalidateTag(WORDPRESS_CACHE_TAG, "max");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/koncertek");
  revalidatePath("/rolunk");

  return NextResponse.json({ ok: true, revalidated: true });
}

export async function GET(request: Request) {
  return POST(request);
}
