// src/app/sutik/page.tsx
// Cookie and local storage notice with the full list of stored items.

import type { Metadata } from "next";
import Link from "next/link";

import { CookieSettingsButton } from "@/components/cookie-settings-button";
import { LegalPage } from "@/components/legal-page";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";
import { GATE_COOKIE } from "@/lib/gate";
import { CONTROLLER, EMBED_PROVIDERS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Süti tájékoztató",
  alternates: { canonical: "/sutik" },
  description:
    "Milyen sütiket és böngészőben tárolt adatokat használ a Galaxisok weboldala, és hogyan állíthatod be.",
};

type StoredItem = {
  name: string;
  kind: string;
  purpose: string;
  category: string;
  lifetime: string;
};

const FIRST_PARTY: StoredItem[] = [
  {
    name: CONSENT_STORAGE_KEY,
    kind: "localStorage",
    purpose:
      "A süti-választásod (beágyazott tartalmak engedélyezve vagy elutasítva), a döntés időpontja és a tájékoztató verziója.",
    category: "Szükséges",
    lifetime: "Amíg a böngésző tárolt adatait nem törlöd.",
  },
  {
    name: "galaxisok-theme",
    kind: "localStorage",
    purpose: "A választott világos vagy sötét megjelenés megjegyzése.",
    category: "Szükséges (általad kért beállítás)",
    lifetime: "Amíg a böngésző tárolt adatait nem törlöd.",
  },
  {
    name: GATE_COOKIE,
    kind: "süti (httpOnly)",
    purpose:
      "A jelszavas belépés megjegyzése. Csak a fejlesztői és előnézeti címeken jön létre, a galaxisok.hu-n nem.",
    category: "Szükséges",
    lifetime: "30 nap",
  },
];

export default function SutikPage() {
  return (
    <LegalPage title="Süti tájékoztató">
      <p>
        Ez a tájékoztató az elektronikus hírközlésről szóló 2003. évi C. törvény
        155. § (3) bekezdése és a GDPR alapján írja le, milyen adatot tárol a
        Galaxisok weboldala a böngésződben, mire használja, és hogyan dönthetsz
        róla. Az adatkezelő: {CONTROLLER.name} (
        <a href={`mailto:${CONTROLLER.privacyEmail}`}>{CONTROLLER.privacyEmail}</a>
        ). A személyes adatok kezeléséről az{" "}
        <Link href="/adatkezeles">adatkezelési tájékoztató</Link> szól.
      </p>
      <p>
        <CookieSettingsButton />
      </p>

      <h2>1. Mi a süti és a helyi tárolás?</h2>
      <p>
        A süti (cookie) egy kis szöveges fájl, amelyet a weboldal a böngésződben
        helyez el, és amelyet a böngésző a későbbi kérésekkel visszaküld. A
        helyi tárolás (localStorage) hasonló célt szolgál, de az adat csak a
        böngésződben marad, a szerverre nem küldődik el. Mindkettőre ugyanazok a
        szabályok vonatkoznak: a működéshez szükséges tárolás hozzájárulás
        nélkül is történhet, minden máshoz az előzetes, tájékozott
        hozzájárulásod kell.
      </p>

      <h2>2. Röviden</h2>
      <ul>
        <li>Látogatottságmérő, elemző és hirdetési sütiket nem használunk.</li>
        <li>
          Saját sütiből és tárolt adatból csak annyi van, amennyi a választásod
          és a megjelenés megjegyzéséhez kell.
        </li>
        <li>
          Külső süti csak akkor kerülhet a böngésződbe, ha engedélyezed a
          blogbejegyzésekbe ágyazott videókat és lejátszókat.
        </li>
        <li>
          A betűtípusokat a saját szerverünkről töltjük be, a Google Fonts
          szervereihez nem megy kérés.
        </li>
        <li>
          A hírlevél-feliratkozás és a hozzászólás a saját szerverünkön keresztül
          megy; a Mailchimp és a WordPress nem tölt be semmit a böngésződbe.
        </li>
      </ul>

      <h2>3. Saját sütik és tárolt adatok</h2>
      <div className="legal-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Név</th>
              <th>Típus</th>
              <th>Cél</th>
              <th>Kategória</th>
              <th>Élettartam</th>
            </tr>
          </thead>
          <tbody>
            {FIRST_PARTY.map((item) => (
              <tr key={item.name}>
                <td>
                  <code>{item.name}</code>
                </td>
                <td>{item.kind}</td>
                <td>{item.purpose}</td>
                <td>{item.category}</td>
                <td>{item.lifetime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Ezek a működéshez szükséges tárolások: a süti-választásod megjegyzése
        nélkül minden oldalon újra meg kellene kérdeznünk, a megjelenés
        megjegyzését pedig te kéred a kapcsolóval. Jogalapjuk a 2003. évi C.
        törvény 155. § (3) bekezdése (a szolgáltatás nyújtásához
        elengedhetetlenül szükséges tárolás).
      </p>

      <h2>4. Külső sütik beágyazott tartalmaknál</h2>
      <p>
        A blogbejegyzésekben a következő szolgáltatók tartalma lehet beágyazva.
        Alapértelmezetten ezek helyén csak egy gomb jelenik meg, és semmi nem
        töltődik be a szolgáltatótól. Ha a süti-beállításokban engedélyezed a
        beágyazott tartalmakat, a böngésződ a szolgáltatóhoz kapcsolódik, amely
        saját sütiket helyezhet el (például a lejátszási beállítások
        megjegyzésére vagy a saját szolgáltatásának méréséhez), és az
        IP-címedet a saját szabályzata szerint kezeli. Ezek a sütik a
        szolgáltató beállításaitól függően akár két évig is a böngésződben
        maradhatnak.
      </p>
      <ul>
        {EMBED_PROVIDERS.map((provider) => (
          <li key={provider.name}>
            <strong>{provider.name}</strong> – {provider.purpose}{" "}
            <a href={provider.policyUrl} rel="noreferrer" target="_blank">
              Sütiszabályzat
            </a>
          </li>
        ))}
      </ul>
      <p>
        Jogalap: a hozzájárulásod (GDPR 6. cikk (1) bekezdés a) pont). A
        hozzájárulást a lábléc Sütik linkjén vagy az alábbi gombbal bármikor
        visszavonhatod; ekkor a továbbiakban nem töltjük be a beágyazásokat. A
        már elhelyezett külső sütiket a böngésződ beállításaiban tudod törölni.
      </p>

      <h2>5. Hogyan dönthetsz?</h2>
      <p>
        Az első látogatáskor megjelenő sávban az „Elfogadom” gombbal
        engedélyezed, az „Elutasítom” gombbal elutasítod a beágyazott
        tartalmakat; a két lehetőség egyformán egy kattintás. A „Beállítások”
        gomb mögött részletesen is dönthetsz. A választásod később itt
        módosíthatod:
      </p>
      <p>
        <CookieSettingsButton />
      </p>
      <p>
        A böngésződben is letilthatod vagy törölheted a sütiket és a tárolt
        adatokat (jellemzően Beállítások → Adatvédelem). Ha a szükséges tárolást
        is letiltod, a süti-választásod és a megjelenés nem marad meg a
        látogatások között, de az oldal egyébként működik.
      </p>

      <h2>6. Változások</h2>
      <p>
        Ha új sütit vagy tárolt adatot vezetünk be, ezt a tájékoztatót
        frissítjük, és ha a változás hozzájárulást igényel, a sáv újra
        megjelenik. A hatálybalépés napját a lap tetején jelezzük.
      </p>
    </LegalPage>
  );
}
