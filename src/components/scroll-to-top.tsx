// src/components/scroll-to-top.tsx
// Reset viewport on route and query changes so titles never sit under the header.

"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useLayoutEffect } from "react";

export function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, searchParams]);

  return null;
}
