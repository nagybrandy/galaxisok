// src/lib/embeds.ts
// Swaps third-party iframes in post HTML for a consent placeholder.

const IFRAME_RE = /<iframe\b[^>]*>[\s\S]*?<\/iframe>|<iframe\b[^>]*\/?>/gi;

function iframeSrc(tag: string): string {
  const match = tag.match(/\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
  return (match?.[1] ?? match?.[2] ?? match?.[3] ?? "").trim();
}

function providerLabel(src: string): string {
  let host = "";
  try {
    host = new URL(src, "https://galaxisok.hu").hostname.replace(/^www\./, "");
  } catch {
    return "külső beágyazás";
  }

  if (host.includes("youtube") || host === "youtu.be") {
    return "YouTube-videó";
  }
  if (host.includes("spotify")) {
    return "Spotify-lejátszó";
  }
  if (host.includes("bandcamp")) {
    return "Bandcamp-lejátszó";
  }
  return `${host} beágyazás`;
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Replaces each iframe with a placeholder that keeps the original markup in a data attribute. */
export function gateEmbeds(html: string): string {
  return html.replace(IFRAME_RE, (tag) => {
    const src = iframeSrc(tag);
    if (!src || src.startsWith("about:")) {
      return tag;
    }

    const label = providerLabel(src);
    return (
      `<div class="embed-gate" data-embed-html="${escapeAttribute(tag)}">` +
      `<p>Ez a beágyazott tartalom (${label}) külső sütiket használ. ` +
      `Ha engedélyezed a beágyazott tartalmakat, itt jelenik meg.</p>` +
      `<button type="button" data-embed-settings>Beágyazások engedélyezése</button>` +
      `</div>`
    );
  });
}
