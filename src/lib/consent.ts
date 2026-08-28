// src/lib/consent.ts
// First-party cookie choices. Necessary prefs always stay on.

export const CONSENT_STORAGE_KEY = "galaxisok_cookie_consent";
export const CONSENT_OPEN_EVENT = "galaxisok:open-cookies";

export type ConsentChoice = {
  necessary: true;
  embeds: boolean;
  analytics: boolean;
};

export const DEFAULT_CONSENT: ConsentChoice = {
  necessary: true,
  embeds: false,
  analytics: false,
};

export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<ConsentChoice>;
    return {
      necessary: true,
      embeds: Boolean(parsed.embeds),
      analytics: Boolean(parsed.analytics),
    };
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice): void {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(choice));
  window.dispatchEvent(new Event("galaxisok:consent-changed"));
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
