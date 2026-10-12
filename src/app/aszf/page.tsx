// src/app/aszf/page.tsx
// Terms of use for the site, newsletter and comments; purchases happen elsewhere.

import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/legal-page";
import {
  CONTROLLER,
  PROCESSORS,
  SHOP_PRIVACY_URL,
  SHOP_TERMS_URL,
} from "@/lib/legal";
import { BANDCAMP_MUSIC_URL, MERCH_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Általános szerződési feltételek",
  description:
    "A Galaxisok weboldalának, hírlevelének és hozzászólásainak használati feltételei, impresszum.",
};

const hosts = PROCESSORS.filter(
  (processor) =>
    processor.name.startsWith("Vercel") || processor.name.startsWith("Websupport"),
);

export default function AszfPage() {
  return (
    <LegalPage title="Általános szerződési feltételek">
      <p>
        Ez a dokumentum a {SITE_NAME} hivatalos weboldalának (galaxisok.hu, a
        továbbiakban: weboldal) használati feltételeit tartalmazza, az
        elektronikus kereskedelmi szolgáltatások, valamint az információs
        társadalommal összefüggő szolgáltatások egyes kérdéseiről szóló 2001. évi
        CVIII. törvény (Ekertv.) és a Polgári Törvénykönyvről szóló 2013. évi V.
        törvény (Ptk.) alapján. A weboldal használatával, a hírlevélre
        feliratkozással vagy hozzászólás beküldésével elfogadod ezeket a
        feltételeket. Ha nem értesz egyet velük, kérjük, ne használd a weboldalt.
      </p>

      <h2>1. Szolgáltató (impresszum)</h2>
      <dl>
        <dt>Név</dt>
        <dd>{CONTROLLER.name}</dd>
        <dt>Képviselő</dt>
        <dd>{CONTROLLER.representative}</dd>
        <dt>Székhely</dt>
        <dd>{CONTROLLER.address}</dd>
        <dt>Nyilvántartás</dt>
        <dd>{CONTROLLER.registration}</dd>
        <dt>E-mail</dt>
        <dd>
          <a href={`mailto:${CONTROLLER.email}`}>{CONTROLLER.email}</a>
        </dd>
      </dl>

      <h2>2. Tárhelyszolgáltatók</h2>
      <ul>
        {hosts.map((host) => (
          <li key={host.name}>
            <strong>{host.name}</strong> – {host.address}, {host.country}.{" "}
            {host.role}{" "}
            <a href={host.policyUrl} rel="noreferrer" target="_blank">
              Elérhetőség és szabályzat
            </a>
          </li>
        ))}
      </ul>

      <h2>3. A szolgáltatás</h2>
      <p>
        A weboldal a zenekar híreit, blogbejegyzéseit, koncertlistáját és
        elérhetőségeit mutatja, hírlevél-feliratkozást és a bejegyzésekhez
        hozzászólást tesz lehetővé. A weboldal használata ingyenes, regisztráció
        nem szükséges. Ezen a weboldalon nem történik értékesítés. A merch a
        Szolgáltató saját webshopjában, a BSIDE shopban (
        <a href={MERCH_URL}>{MERCH_URL}</a>) vásárolható meg; az ottani
        vásárlásra a webshop saját{" "}
        <a href={SHOP_TERMS_URL} rel="noreferrer" target="_blank">
          általános szerződési feltételei
        </a>{" "}
        és{" "}
        <a href={SHOP_PRIVACY_URL} rel="noreferrer" target="_blank">
          adatvédelmi tájékoztatója
        </a>{" "}
        vonatkoznak, az elállási, szállítási és panaszkezelési szabályokkal
        együtt. A zene a Bandcampen (
        <a href={BANDCAMP_MUSIC_URL}>{BANDCAMP_MUSIC_URL}</a>), a koncertjegy a
        koncertlistából nyíló jegyértékesítő partnereknél vásárolható meg; ezekre
        az adott szolgáltató saját feltételei érvényesek, és fogyasztói jogaidat
        velük szemben gyakorolhatod.
      </p>

      <h2>4. Hírlevél</h2>
      <p>
        A hírlevélre a <Link href="/hirlevel">Hírlevél</Link> oldalon, az
        e-mail-címed megadásával és a hozzájárulás bejelölésével iratkozhatsz
        fel. A feliratkozás csak a megerősítő e-mailben lévő linkre kattintás
        után válik érvényessé (kettős megerősítés). A hírlevél ingyenes, csak
        akkor küldjük, ha van hírünk: koncert, megjelenés, zenekari hír. Bármikor
        leiratkozhatsz a levelek alján lévő linkkel vagy e-mailben; a
        leiratkozást legkésőbb 5 munkanapon belül átvezetjük. A hírlevéllel
        kapcsolatos adatkezelést az{" "}
        <Link href="/adatkezeles">adatkezelési tájékoztató</Link> 3.2 pontja
        írja le.
      </p>

      <h2>5. Hozzászólások</h2>
      <p>
        A blogbejegyzésekhez név (vagy becenév) és e-mail-cím megadásával
        szólhatsz hozzá. A hozzászólás csak moderálás után jelenik meg. A
        beküldéssel szavatolod, hogy a hozzászólás a saját műved, és engedélyt
        adsz a weboldalon való közzétételére. Nem engedélyezett:
      </p>
      <ul>
        <li>jogellenes, gyűlöletkeltő, rágalmazó, zaklató vagy fenyegető tartalom;</li>
        <li>más személyes adatának engedély nélküli közlése;</li>
        <li>szerzői jogot sértő tartalom;</li>
        <li>reklám, spam, kéretlen linkek;</li>
        <li>más személy vagy a zenekar tagjainak nevében való megszólalás.</li>
      </ul>
      <p>
        A moderálás során a fenti szabályokba ütköző hozzászólást nem
        hagyjuk jóvá, a már közzétett hozzászólást pedig eltávolíthatjuk. A
        zenekar tagjainak és a weboldal üzemeltetőjének hozzászólásait „(admin)”
        jelölés különbözteti meg; ezek a nevek más beküldő számára nem
        használhatók. Döntésünkről kérésedre e-mailben indokolást adunk, és
        kifogásodat ugyanott jelezheted.
      </p>

      <h2>6. Jogellenes tartalom bejelentése</h2>
      <p>
        Ha a weboldalon közzétett hozzászólásban jogellenes vagy e feltételekbe
        ütköző tartalmat találsz, kérjük, jelezd a{" "}
        <a href={`mailto:${CONTROLLER.email}`}>{CONTROLLER.email}</a> címen (a
        digitális szolgáltatásokról szóló 2022/2065 EU rendelet 12. és 16. cikke
        szerinti kapcsolattartási pont). A bejelentésben add meg a hozzászólás
        linkjét vagy sorszámát, és írd le, miért tartod jogsértőnek. A bejelentést
        indokolatlan késedelem nélkül megvizsgáljuk, és döntésünkről értesítünk.
      </p>

      <h2>7. Szellemi tulajdon</h2>
      <p>
        A weboldalon megjelenő szövegek, fotók, videók, zenék, a logó és a
        grafikai elemek a zenekar, a megjelölt szerző vagy a jogosult tulajdona,
        és a szerzői jogról szóló 1999. évi LXXVI. törvény védelme alatt állnak.
        A tartalmat a saját, nem kereskedelmi célú felhasználáson, idézésen és a
        linkeléssel történő megosztáson túl csak előzetes írásbeli engedéllyel
        lehet másolni, átdolgozni vagy terjeszteni. Sajtómegkereséssel a kontakt
        oldalon megadott címen fordulj hozzánk.
      </p>

      <h2>8. Felelősség</h2>
      <p>
        A weboldalt gondosan tartjuk karban, de nem vállalunk felelősséget a
        folyamatos, hibátlan elérhetőségért, a koncertadatok esetleges
        változásáért (a hivatalos információ mindig a szervezőnél és a
        jegyértékesítőnél van), valamint a külső oldalak tartalmáért és
        működéséért. A felhasználói hozzászólások a beküldő véleményét tükrözik;
        az Ekertv. 2. § lc) pontja szerinti tárhelyszolgáltatóként a tudomásunkra
        jutott jogsértő tartalmat a 6. pont szerint eltávolítjuk. Nem korlátozzuk
        a felelősségünket a szándékosan vagy az emberi életet, testi épséget,
        egészséget károsító magatartással okozott kárért.
      </p>

      <h2>9. Panaszkezelés</h2>
      <p>
        A weboldallal, a hírlevéllel vagy a hozzászólásokkal kapcsolatos
        észrevételt, panaszt a{" "}
        <a href={`mailto:${CONTROLLER.email}`}>{CONTROLLER.email}</a> címre
        küldheted. A panaszra legkésőbb 30 napon belül érdemben válaszolunk.
        Fogyasztói jogvita esetén a lakóhelyed szerint illetékes békéltető
        testülethez fordulhatsz (a testületek listája:{" "}
        <a href="https://bekeltetes.hu" rel="noreferrer" target="_blank">
          bekeltetes.hu
        </a>
        ), illetve a fogyasztóvédelmi hatósághoz (a kormányhivatalok
        fogyasztóvédelmi osztályai). A BSIDE shopban történt vásárlás miatti
        panaszra a webshop ÁSZF-je, a Bandcampen és a jegyértékesítőknél történt
        vásárlásra az adott szolgáltató panaszkezelése vonatkozik.
      </p>

      <h2>10. Irányadó jog</h2>
      <p>
        E feltételekre a magyar jog az irányadó. A feltételek magyar nyelven
        készültek; nem minősülnek írásbeli szerződésnek, iktatásra nem
        kerülnek, magatartási kódexnek nem vetjük alá magunkat.
      </p>

      <h2>11. Módosítás</h2>
      <p>
        A feltételeket indokolt esetben (új funkció, jogszabályváltozás)
        módosíthatjuk. A hatályos szöveg mindig ezen az oldalon olvasható, a
        hatálybalépés napját és a verziót a lap tetején jelezzük. A hírlevél
        feltételeinek lényeges változásáról a feliratkozókat e-mailben is
        értesítjük; a módosítás a már feliratkozottakra a közléstől számított 15
        nap elteltével alkalmazandó, ez idő alatt bármikor leiratkozhatsz.
      </p>
    </LegalPage>
  );
}
