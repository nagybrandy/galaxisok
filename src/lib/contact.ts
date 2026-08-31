// src/lib/contact.ts
// Fallback Kontakt copy until the WordPress `kontakt` page is published.

import { BAND_EMAIL, BAND_PHONE, BAND_PHONE_HREF } from "@/lib/socials";

export const CONTACT_HTML = `
<h2>Levél</h2>
<p><a href="mailto:${BAND_EMAIL}">${BAND_EMAIL}</a></p>
<h2>Booking</h2>
<p><a href="mailto:${BAND_EMAIL}">${BAND_EMAIL}</a></p>
<h2>Telefon</h2>
<p><a href="${BAND_PHONE_HREF}">${BAND_PHONE}</a></p>
`.trim();
