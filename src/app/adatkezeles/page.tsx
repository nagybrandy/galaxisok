// src/app/adatkezeles/page.tsx
// Privacy notice for the headless site, newsletter, and embeds.

import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { SITE_NAME, WORDPRESS_PUBLIC_URL } from "@/lib/site";
import { BAND_EMAIL } from "@/lib/socials";

export const metadata: Metadata = {
  title: "Adatkezelés",
  description: "Adatkezelési tájékoztató a Galaxisok weboldalához.",
};

export default function AdatkezelesPage() {
  return (
    <LegalPage title="Adatkezelés">
      <p>
        Ez a tájékoztató arról szól, milyen adatot kezelünk, amikor a{" "}
        {SITE_NAME} oldalát használod. Az adatkezelő a zenekar, elérhető:{" "}
        <a href={`mailto:${BAND_EMAIL}`}>{BAND_EMAIL}</a>.
      </p>
      <h2>Milyen adatot kezelünk</h2>
      <p>
        A böngészéshez technikai adat kell (IP, böngésző, a megnyitott oldal).
        Ha feliratkozol a hírlevélre, az e-mail-címed a Mailchimphez kerül.
        A zene és a merch a Bandcamp saját oldalára visz; ott a Bandcamp
        láthat sütiket és technikai adatot.
        A blogot WordPressből olvassuk ({WORDPRESS_PUBLIC_URL}), a nyilvános
        bejegyzésekhez tartozó szerzői adatok ott tárolódnak.
      </p>
      <h2>Jogalap és cél</h2>
      <p>
        Az oldal működtetése jogos érdek. A hírlevélhez a hozzájárulásod kell,
        amit bármikor visszavonhatsz. A sütikhez külön választást adunk.
      </p>
      <h2>Sütik</h2>
      <p>
        Szükséges sütik: a tesztoldal belépése és a süti-választásod.
        Opcionális: hírlevél iframe és későbbi statisztika. A választást a
        láblécben a Sütik linken bármikor átírhatod.
      </p>
      <h2>Továbbítás</h2>
      <p>
        Tárhely: Vercel. Tartalomkezelés: WordPress a fenti címen. Zene és merch:
        Bandcamp. Hírlevél: Mailchimp, ha a feliratkozás él. Ezek saját
        adatkezelési szabályzatot is alkalmazhatnak.
      </p>
      <h2>Megőrzés</h2>
      <p>
        A hírlevél-címedet a leiratkozásig vagy törlési kérésig tartjuk. A
        süti-választás a böngésződben marad, amíg nem törlöd.
      </p>
      <h2>Jogaid</h2>
      <p>
        Kérhetsz tájékoztatást, helyesbítést, törlést, korlátozást, és
        tiltakozhatsz. Panaszt a Nemzeti Adatvédelmi és Információszabadság
        Hatóságnál tehetsz (naih.hu). Írj nekünk:{" "}
        <a href={`mailto:${BAND_EMAIL}`}>{BAND_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}
