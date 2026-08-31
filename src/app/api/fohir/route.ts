// src/app/api/fohir/route.ts
// Homepage teaser JSON so the root layout never waits on WordPress.

import { NextResponse } from "next/server";

import { getFeaturedNews } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export async function GET() {
  const news = await getFeaturedNews();
  return NextResponse.json(news);
}
