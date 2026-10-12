// src/components/cookie-consent.tsx
// Banner plus a small panel to accept, refuse, or change embed cookies.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import {
  CONSENT_CHANGED_EVENT,
  CONSENT_OPEN_EVENT,
  parseConsent,
  readConsentRaw,
  writeConsent,
  type ConsentInput,
} from "@/lib/consent";

// Server snapshot: nothing is known yet, so nothing renders before hydration.
const NOT_READY = undefined;

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function CookieConsent() {
  const pathname = usePathname();
  const raw = useSyncExternalStore(subscribe, readConsentRaw, () => NOT_READY);
  const stored = useMemo(() => (raw === NOT_READY ? null : parseConsent(raw)), [raw]);
  const [open, setOpen] = useState(false);
  const [embeds, setEmbeds] = useState(false);

  useEffect(() => {
    const onOpen = () => {
      setEmbeds(Boolean(parseConsent(readConsentRaw())?.embeds));
      setOpen(true);
    };

    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
  }, []);

  function openSettings() {
    setEmbeds(Boolean(stored?.embeds));
    setOpen(true);
  }

  function save(choice: ConsentInput) {
    writeConsent(choice);
    setOpen(false);
  }

  if (raw === NOT_READY || pathname === "/kapu") {
    return null;
  }

  const banner = stored === null && !open;

  return (
    <>
      {banner ? (
        <div
          className="cookie-banner"
          role="region"
          aria-label="Sütik és beágyazott tartalmak"
        >
          <div className="cookie-banner-inner">
            <p className="cookie-copy">
              Az oldal csak a működéshez szükséges adatokat tárolja a
              böngésződben, látogatottságot nem mérünk. A blogban beágyazott
              videók és lejátszók (YouTube, Spotify, Bandcamp) külső sütiket
              használnak, ezek csak a hozzájárulásoddal töltődnek be.{" "}
              <Link href="/sutik">Süti tájékoztató</Link>
            </p>
            <div className="cookie-actions">
              <button
                type="button"
                className="cookie-action cookie-action-plain"
                onClick={openSettings}
              >
                Beállítások
              </button>
              <button
                type="button"
                className="cookie-action cookie-action-outline"
                onClick={() => save({ embeds: false, analytics: false })}
              >
                Elutasítom
              </button>
              <button
                type="button"
                className="cookie-action cookie-action-primary"
                onClick={() => save({ embeds: true, analytics: false })}
              >
                Elfogadom
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {open ? (
        <div className="cookie-modal-backdrop">
          <div
            className="cookie-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-settings-title"
          >
            <h2 id="cookie-settings-title" className="cookie-title">
              Sütik és beágyazások
            </h2>
            <ul className="cookie-options">
              <li>
                <p className="cookie-option-title">Szükséges</p>
                <p>
                  A süti-választásod és a világos/sötét mód mentése a saját
                  böngésződben. Ezek nélkül az oldal nem működik, nem lehet
                  kikapcsolni őket.
                </p>
              </li>
              <li className="cookie-option-row">
                <div>
                  <p className="cookie-option-title">Beágyazott tartalmak</p>
                  <p>
                    A blogbejegyzésekbe ágyazott YouTube-videók, Spotify- és
                    Bandcamp-lejátszók. Ezek a szolgáltatók saját sütiket
                    helyezhetnek el. Kikapcsolva csak egy gomb jelenik meg a
                    helyükön.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={embeds}
                  onChange={(event) => setEmbeds(event.target.checked)}
                  className="cookie-checkbox"
                  aria-label="Beágyazott tartalmak engedélyezése"
                />
              </li>
            </ul>
            <p className="cookie-note">
              Látogatottságmérést és hirdetési sütiket nem használunk. A
              választásod bármikor módosíthatod a lábléc Sütik linkjén.{" "}
              <Link href="/sutik">Részletek</Link>
            </p>
            <div className="cookie-modal-actions">
              <button
                type="button"
                className="cookie-action cookie-action-plain"
                onClick={() => setOpen(false)}
              >
                Mégse
              </button>
              <button
                type="button"
                className="cookie-action cookie-action-primary"
                onClick={() => save({ embeds, analytics: false })}
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
