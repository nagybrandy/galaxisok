// src/components/persistent-bandcamp.tsx
// Keep Bandcamp iframes mounted so their cookie choice survives in-site navigation.

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BandcampExit } from "@/components/bandcamp-exit";
import { BANDCAMP_MERCH_URL, BANDCAMP_MUSIC_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

type BandcampPane = "music" | "merch";

function paneFor(pathname: string): BandcampPane | null {
  switch (pathname) {
    case "/zene":
      return "music";
    case "/webshop":
      return "merch";
    default:
      return null;
  }
}

export function PersistentBandcamp() {
  const pathname = usePathname();
  const pane = paneFor(pathname);
  const [loaded, setLoaded] = useState({ music: false, merch: false });

  useEffect(() => {
    if (pane === "music") {
      setLoaded((current) => ({ ...current, music: true }));
      return;
    }
    if (pane === "merch") {
      setLoaded((current) => ({ ...current, merch: true }));
    }
  }, [pane]);

  if (!loaded.music && !loaded.merch) {
    return null;
  }

  const exitHref = pane === "merch" ? BANDCAMP_MERCH_URL : BANDCAMP_MUSIC_URL;

  return (
    <div
      className={cn("persistent-bandcamp", pane && "is-on")}
      aria-hidden={pane === null}
    >
      <div className="relative min-h-0 flex-1">
        {loaded.music ? (
          <iframe
            src={BANDCAMP_MUSIC_URL}
            title="Galaxisok — Zene"
            allow="payment; fullscreen; autoplay"
            referrerPolicy="no-referrer-when-downgrade"
            className={cn(
              "persistent-bandcamp-frame",
              pane === "music" && "is-active",
            )}
          />
        ) : null}
        {loaded.merch ? (
          <iframe
            src={BANDCAMP_MERCH_URL}
            title="Galaxisok — Merch"
            allow="payment; fullscreen; autoplay"
            referrerPolicy="no-referrer-when-downgrade"
            className={cn(
              "persistent-bandcamp-frame",
              pane === "merch" && "is-active",
            )}
          />
        ) : null}
        {pane ? <BandcampExit href={exitHref} /> : null}
      </div>
    </div>
  );
}
