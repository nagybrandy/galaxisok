// src/app/aszf/page.tsx
// Terms for the public Galaxisok site and the Bandcamp shop.

import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { BANDCAMP_MERCH_URL, SITE_NAME } from "@/lib/site";
import { BAND_EMAIL } from "@/lib/socials";

export const metadata: Metadata = {
  title: "ÁSZF",
  description: "A Galaxisok weboldalának általános szerződési feltételei.",
};

export default function AszfPage() {
  return (
    <LegalPage title="ÁSZF">
      <p>
        Ezek a feltételek a {SITE_NAME} hivatalos weboldalára vonatkoznak. A
        oldal használatával elfogadod őket.
      </p>
      <h2>Szolgáltató</h2>
      <p>
        A weboldalt a {SITE_NAME} zenekar üzemelteti. Kapcsolat:{" "}
        <a href={`mailto:${BAND_EMAIL}`}>{BAND_EMAIL}</a>.
      </p>
      <h2>A weboldal</h2>
      <p>
        Az oldal híreket, koncertlistát, galériát és hírlevél-feliratkozást
        mutat. A zene és a merch a Bandcamp felületéről érkezik, beágyazva.
      </p>
      <h2>Vásárlás</h2>
      <p>
        A jegyek és a merch nem tőlünk, hanem a jegyszolgáltatótól vagy a
        Bandcamptől kerülnek elszámolásra. A fizetés, szállítás és reklamáció
        az ő feltételeik szerint megy. Merch:{" "}
        <a href={BANDCAMP_MERCH_URL}>{BANDCAMP_MERCH_URL}</a>.
      </p>
      <h2>Tartalom</h2>
      <p>
        A szövegek, fotók és a logó a zenekar vagy a megjelölt szerző
        tulajdonában vannak. Másolni, terjeszteni csak engedéllyel lehet.
      </p>
      <h2>Felelősség</h2>
      <p>
        Az oldalt jóhiszeműen tartjuk karban, de nem vállalunk jótállást a
        folyamatos elérhetőségért, és a külső oldalak (Bandcamp, közösségi
        média, jegyeladás) működéséért.
      </p>
      <h2>Módosítás</h2>
      <p>A feltételeket indokolt esetben frissítjük. A hatályos szöveg mindig itt olvasható.</p>
    </LegalPage>
  );
}
