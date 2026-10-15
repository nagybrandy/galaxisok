// src/lib/newsletter.ts
// Relays newsletter signups to the WordPress → Mailchimp bridge.

const DEFAULT_WORDPRESS_URL = "https://admin.galaxisok.hu";

export type NewsletterSubscribeResult =
  | { ok: true; pending: boolean; message: string }
  | { ok: false; message: string; status: number };

function wordpressUrl(): string {
  // An empty value is set in production, and ?? would keep it.
  const raw = process.env.WORDPRESS_URL?.trim();
  return (raw || DEFAULT_WORDPRESS_URL).replace(/\/$/, "");
}

export async function subscribeNewsletter(
  email: string,
  name: string,
): Promise<NewsletterSubscribeResult> {
  try {
    const response = await fetch(
      `${wordpressUrl()}/wp-json/galaxisok/v1/newsletter`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent": "Galaxisok/1.0",
        },
        body: JSON.stringify({ email, name }),
        signal: AbortSignal.timeout(15_000),
      },
    );

    const payload = (await response.json().catch(() => null)) as {
      ok?: boolean;
      pending?: boolean;
      message?: string;
    } | null;

    if (!response.ok || !payload?.ok) {
      return {
        ok: false,
        message:
          payload?.message ||
          "A feliratkozás nem sikerült. Próbáld újra később.",
        status: response.status || 502,
      };
    }

    return {
      ok: true,
      pending: Boolean(payload.pending),
      message:
        payload.message ||
        (payload.pending
          ? "Köszönjük! Nézd meg a postaládádat, és erősítsd meg a feliratkozást."
          : "Köszönjük, feliratkoztál a hírlevélre."),
    };
  } catch {
    return {
      ok: false,
      message: "Nem sikerült elérni a hírlevél szolgáltatást.",
      status: 502,
    };
  }
}
