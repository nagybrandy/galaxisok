// src/components/cookie-consent.tsx
// Banner plus a small panel to accept, refuse, or change embed cookies.

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  CONSENT_OPEN_EVENT,
  DEFAULT_CONSENT,
  readConsent,
  writeConsent,
  type ConsentChoice,
} from "@/lib/consent";

export function CookieConsent() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [banner, setBanner] = useState(false);
  const [embeds, setEmbeds] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      setEmbeds(stored.embeds);
      setAnalytics(stored.analytics);
      setBanner(false);
    } else {
      setBanner(true);
    }
    setReady(true);

    const onOpen = () => {
      const current = readConsent() ?? DEFAULT_CONSENT;
      setEmbeds(current.embeds);
      setAnalytics(current.analytics);
      setOpen(true);
      setBanner(false);
    };

    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
  }, []);

  function save(choice: ConsentChoice) {
    writeConsent(choice);
    setEmbeds(choice.embeds);
    setAnalytics(choice.analytics);
    setOpen(false);
    setBanner(false);
  }

  if (!ready || pathname === "/kapu") {
    return null;
  }

  return (
    <>
      {banner ? (
        <div className="cookie-banner fixed inset-x-0 bottom-0 z-50 border-t border-white/15 bg-[#050b1c]/95 px-5 py-4 backdrop-blur-md sm:px-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
            <p className="min-w-0 font-[family-name:var(--font-fuse)] text-sm leading-6 font-normal text-white/70 md:max-w-xl">
              Sütiket használunk a belépéshez. A hírlevél beágyazásához külön
              engedély kell.{" "}
              <a href="/adatkezeles" className="underline underline-offset-4">
                Részletek
              </a>
            </p>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-nowrap sm:items-center">
              <button
                type="button"
                className="h-10 shrink-0 px-3 text-[11px] tracking-[0.16em] whitespace-nowrap text-white/70 uppercase hover:text-white"
                onClick={() => setOpen(true)}
              >
                Beállítások
              </button>
              <button
                type="button"
                className="h-10 shrink-0 border border-white/20 px-3 text-[11px] tracking-[0.16em] whitespace-nowrap uppercase hover:border-white"
                onClick={() => save({ necessary: true, embeds: false, analytics: false })}
              >
                Csak szükséges
              </button>
              <button
                type="button"
                className="h-10 shrink-0 bg-white px-4 text-[11px] tracking-[0.16em] whitespace-nowrap text-[#050b1c] uppercase hover:bg-white/90"
                onClick={() => save({ necessary: true, embeds: true, analytics: true })}
              >
                Elfogadom
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-5 sm:items-center">
          <div className="w-full max-w-lg border border-white/15 bg-[#050b1c] p-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-[0.18em] uppercase">
              Sütik
            </h2>
            <ul className="mt-6 space-y-4 font-[family-name:var(--font-fuse)] text-sm font-normal text-white/70">
              <li>
                <p className="text-white">Szükséges</p>
                <p className="mt-1">Belépés, a választásaid mentése. Ezeket nem lehet kikapcsolni.</p>
              </li>
              <li className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-white">Beágyazások</p>
                  <p className="mt-1">Hírlevél iframe. A zene a Bandcampen, a merch a B Side shopban nyílik.</p>
                </div>
                <input
                  type="checkbox"
                  checked={embeds}
                  onChange={(event) => setEmbeds(event.target.checked)}
                  className="mt-1 size-4 accent-white"
                />
              </li>
              <li className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-white">Statisztika</p>
                  <p className="mt-1">Későbbi, névtelen látogatottsági mérés. Most még nem fut.</p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(event) => setAnalytics(event.target.checked)}
                  className="mt-1 size-4 accent-white"
                />
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="h-10 px-4 text-[11px] tracking-[0.2em] text-white/60 uppercase hover:text-white"
                onClick={() => setOpen(false)}
              >
                Mégse
              </button>
              <button
                type="button"
                className="h-10 bg-white px-4 text-[11px] tracking-[0.2em] text-[#050b1c] uppercase hover:bg-white/90"
                onClick={() => save({ necessary: true, embeds, analytics })}
              >
                Mentés
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
