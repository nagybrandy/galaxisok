// src/proxy.ts
// Blocks tesztoldal pages until the gate cookie is set. Never intercepts CSS/JS.

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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticAsset(pathname) || isPublicGatePath(pathname)) {
    return NextResponse.next();
  }

  const host = request.headers.get("host") ?? "";

  if (isLiveHuHost(host) && pathname !== "/coming-soon") {
    const comingSoon = request.nextUrl.clone();
    comingSoon.pathname = "/coming-soon";
    comingSoon.search = "";
    return NextResponse.rewrite(comingSoon);
  }

  if (!shouldProtectHost(host)) {
    return NextResponse.next();
  }

  if (request.cookies.get(GATE_COOKIE)?.value === gateToken()) {
    return NextResponse.next();
  }

  const kapu = request.nextUrl.clone();
  kapu.pathname = "/kapu";
  kapu.search = "";
  const redirect = NextResponse.redirect(kapu);
  redirect.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  redirect.headers.set("x-middleware-cache", "no-cache");
  return redirect;
}

export const proxyConfig = {
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon.ico|icon.svg|atmosphere\\.jpg|hero\\.jpg).*)",
  ],
};
