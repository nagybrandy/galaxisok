// src/components/night-atmosphere.tsx
// Full-viewport night photo behind inner pages. Native img so the first
// load after the tesztoldal gate cannot stick on a transparent placeholder.

"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function NightAtmosphere() {
  const pathname = usePathname();
  const imageRef = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) {
      setReady(true);
    }
  }, [pathname]);

  if (pathname === "/kapu") {
    return null;
  }

  return (
    <div
      aria-hidden
      className="night-atmosphere pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="night-atmosphere-photo">
        <img
          ref={imageRef}
          src="/atmosphere.jpg"
          alt=""
          fetchPriority="high"
          decoding="async"
          onLoad={() => setReady(true)}
          className={cn("night-atmosphere-img", ready && "is-ready")}
        />
      </div>
      <div className="night-atmosphere-wash" />
      <div className="night-atmosphere-dither" />
    </div>
  );
}
