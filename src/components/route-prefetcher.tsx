// src/components/route-prefetcher.tsx
// Warm inner routes after idle so the first menu click is already cached.

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { PREFETCH_ROUTES } from "@/lib/site";

export function RoutePrefetcher() {
  const router = useRouter();

  useEffect(() => {
    const run = () => {
      for (const href of PREFETCH_ROUTES) {
        void router.prefetch(href);
      }
    };

    if (typeof window.requestIdleCallback === "function") {
      const idle = window.requestIdleCallback(run, { timeout: 1800 });
      return () => window.cancelIdleCallback(idle);
    }

    const timeout = window.setTimeout(run, 400);
    return () => window.clearTimeout(timeout);
  }, [router]);

  return null;
}
