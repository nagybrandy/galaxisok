// src/components/cookie-settings-button.tsx
// Opens the consent panel from server-rendered legal copy.

"use client";

import { openCookieSettings } from "@/lib/consent";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="cookie-action cookie-action-primary"
      onClick={openCookieSettings}
    >
      Süti-beállítások módosítása
    </button>
  );
}
