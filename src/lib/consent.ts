// src/lib/consent.ts
// First-party cookie choices. Necessary prefs always stay on.

export const CONSENT_STORAGE_KEY = "galaxisok_cookie_consent";
export const CONSENT_OPEN_EVENT = "galaxisok:open-cookies";
export const CONSENT_CHANGED_EVENT = "galaxisok:consent-changed";

// Bump when the categories or their meaning change, so visitors are asked again.
export const CONSENT_VERSION = 2;

export type ConsentChoice = {
  necessary: true;
  embeds: boolean;
  analytics: boolean;
  version: number;
  savedAt: string;
};

export type ConsentInput = Pick<ConsentChoice, "embeds" | "analytics">;

export const DEFAULT_CONSENT: ConsentChoice = {
  necessary: true,
  embeds: false,
  analytics: false,
  version: CONSENT_VERSION,
  savedAt: "",
};

/** The stored JSON string, or null when nothing is saved or storage is blocked. */
export function readConsentRaw(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Parses a stored choice; stale versions count as no choice so the banner returns. */
export function parseConsent(raw: string | null): ConsentChoice | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ConsentChoice>;
    if (parsed.version !== CONSENT_VERSION) {
      return null;
    }

    return {
      necessary: true,
      embeds: Boolean(parsed.embeds),
      analytics: Boolean(parsed.analytics),
      version: CONSENT_VERSION,
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : "",
    };
  } catch {
    return null;
  }
}

export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") {
    return null;
  }

  return parseConsent(readConsentRaw());
}

export function writeConsent(choice: ConsentInput): void {
  const stored: ConsentChoice = {
    necessary: true,
    embeds: choice.embeds,
    analytics: choice.analytics,
    version: CONSENT_VERSION,
    savedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Private mode or blocked storage: the choice lives for this page only.
  }
  window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
