// src/proxy.ts
// Password-gates preview hosts and marks every non-.hu host noindex. Never intercepts CSS/JS.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  GATE_COOKIE,
  gateToken,
  isLiveHuHost,
  isPublicGatePath,
  shouldProtectHost,
} from "@/lib/gate";

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname === "/favicon.svg" ||
    pathname === "/icon.svg" ||
    pathname === "/apple-icon.png" ||
    pathname === "/atmosphere.jpg" ||
    pathname === "/hero.jpg" ||
    /\.(?:avif|gif|ico|ics|jpe?g|png|svg|webp|woff2?)$/i.test(pathname)
  );
}

const NOINDEX = "noindex, nofollow";

// Only the .hu domain may be indexed; vercel.app and local hosts are duplicates.
function withRobots(response: NextResponse, host: string): NextResponse {
  if (!isLiveHuHost(host)) {
    response.headers.set("X-Robots-Tag", NOINDEX);
  }
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  if (isStaticAsset(pathname) || isPublicGatePath(pathname)) {
    return withRobots(NextResponse.next(), host);
  }

  if (!shouldProtectHost(host)) {
    return withRobots(NextResponse.next(), host);
  }

  if (request.cookies.get(GATE_COOKIE)?.value === gateToken()) {
    return withRobots(NextResponse.next(), host);
  }

  const kapu = request.nextUrl.clone();
  kapu.pathname = "/kapu";
  kapu.search = "";
  const redirect = NextResponse.redirect(kapu);
  redirect.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  redirect.headers.set("x-middleware-cache", "no-cache");
  return withRobots(redirect, host);
}

export const proxyConfig = {
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon.ico|icon.svg|atmosphere\\.jpg|hero\\.jpg).*)",
  ],
};
