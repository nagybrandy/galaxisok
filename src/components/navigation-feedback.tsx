// src/components/navigation-feedback.tsx
// Immediate top bar on internal clicks, until the destination route commits.

"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function isInternalNavigation(anchor: HTMLAnchorElement, pathname: string): boolean {
  if (anchor.target && anchor.target !== "_self") {
    return false;
  }
  if (anchor.hasAttribute("download")) {
    return false;
  }

  const next = new URL(anchor.href, window.location.href);
  if (next.origin !== window.location.origin) {
    return false;
  }
  if (next.pathname.startsWith("/kapu")) {
    return false;
  }

  const current = `${pathname}${window.location.search}`;
  const target = `${next.pathname}${next.search}`;
  return current !== target;
}

export function NavigationFeedback() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement) || !anchor.href) {
        return;
      }
      if (!isInternalNavigation(anchor, pathname)) {
        return;
      }

      setPending(true);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  useEffect(() => {
    if (!pending) {
      return;
    }

    const timeout = window.setTimeout(() => setPending(false), 12000);
    return () => window.clearTimeout(timeout);
  }, [pending]);

  if (!pending) {
    return null;
  }

  return (
    <div
      className="nav-progress"
      role="progressbar"
      aria-label="Oldal betöltése"
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
