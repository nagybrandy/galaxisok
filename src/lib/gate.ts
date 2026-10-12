// src/lib/gate.ts
// Password gate for local and preview hosts, excluding the public comparison site.

import { createHash } from "node:crypto";

export const GATE_COOKIE = "galaxisok_gate";

export function gatePassword(): string {
  return process.env.SITE_PASSWORD ?? "galamb";
}

export function gateToken(): string {
  return createHash("sha256").update(`galaxisok:${gatePassword()}`).digest("hex");
}

export function isLiveHuHost(host: string): boolean {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  return hostname === "galaxisok.hu" || hostname === "www.galaxisok.hu";
}

export function shouldProtectHost(host: string): boolean {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";

  if (isLiveHuHost(host) || hostname === "galaxisok-new.vercel.app") {
    return false;
  }

  return (
    hostname.endsWith(".vercel.app") ||
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  );
}

export function isPublicGatePath(pathname: string): boolean {
  return (
    pathname === "/kapu" ||
    pathname.startsWith("/kapu/") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/api/gate") ||
    pathname.startsWith("/api/revalidate") ||
    pathname.startsWith("/api/fohir") ||
    pathname.startsWith("/api/calendar") ||
    pathname === "/galaxisok-koncertek.ics"
  );
}
