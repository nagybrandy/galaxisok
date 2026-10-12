// src/app/adatkezeles/page.tsx
// GDPR Art. 13 privacy notice for the site, newsletter, comments and embeds.

import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/legal-page";
import {
  CONTROLLER,
  EMBED_PROVIDERS,
  EXTERNAL_SITES,
  NAIH,
  PROCESSORS,
} from "@/lib/legal";
import { SITE_NAME, WORDPRESS_PUBLIC_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató",
  description:
    "Adatkezelési tájékoztató a Galaxisok weboldalához: hírlevél, hozzászólások, sütik, jogok.",
};

export default function AdatkezelesPage() {
  return (
    <LegalPage title="Adatkezelési tájékoztató">
      <p>
        Ez a tájékoztató az Európai Unió általános adatvédelmi rendelete (2016/679
        EU rendelet, GDPR) 13. cikke és az információs önrendelkezési jogról és az
        információszabadságról szóló 2011. évi CXII. törvény (Infotv.) alapján
        írja le, milyen személyes adatot kezelünk, amikor a {SITE_NAME} weboldalát
        (galaxisok.hu) használod, hírlevelünkre feliratkozol vagy hozzászólást
        írsz. A sütikről és a böngésződben tárolt adatokról külön{" "}
        <Link href="/sutik">süti tájékoztató</Link> szól.
      </p>

      <h2>1. Az adatkezelő</h2>
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
          <a href={`mailto:${CONTROLLER.privacyEmail}`}>{CONTROLLER.privacyEmail}</a>
        </dd>
      </dl>
      <p>
        Adatvédelmi tisztviselő kijelölésére a GDPR 37. cikke alapján nem vagyunk
        kötelesek. Adatvédelmi kérdéssel a fenti e-mail-címen fordulhatsz hozzánk;
        ugyanez a cím szolgál booking- és sajtómegkeresésre is. A BSIDE shop
        (shop.bsidemusic.hu)
        vásárlóinak adatait a webshop saját adatvédelmi tájékoztatója szerint
        kezeljük; ez a tájékoztató csak a galaxisok.hu-ra vonatkozik.
      </p>

      <h2>2. Alapelvek</h2>
      <p>
        Csak annyi adatot kérünk, amennyi az adott célhoz kell, és csak addig
        őrizzük, ameddig a cél indokolja. Nem végzünk profilalkotást és nem
        hozunk kizárólag automatizált döntést rólad. Látogatottságmérő vagy
        hirdetési szolgáltatást nem használunk. Az oldal betűtípusait a saját
        szerverünkről szolgáljuk ki, ezért a böngésződ nem küld kérést külső
        betűtípus-szolgáltatónak.
      </p>

      <h2>3. Milyen adatot, milyen célból és milyen alapon kezelünk</h2>

      <h3>3.1 A weboldal megjelenítése, biztonság</h3>
      <dl>
        <dt>Adatok</dt>
        <dd>
          IP-cím, a böngésző és az eszköz technikai azonosítói (user agent), a
          megnyitott oldal címe, a kérés időpontja, hibaüzenetek. Ezek a
          tárhelyszolgáltató (Vercel) rendszereiben keletkező technikai naplók.
        </dd>
        <dt>Cél</dt>
        <dd>
          Az oldal kiszolgálása, hibák felderítése, a visszaélések (pl. túlterhelés,
          automatizált spam) kiszűrése.
        </dd>
        <dt>Jogalap</dt>
        <dd>
          Jogos érdekünk (GDPR 6. cikk (1) bekezdés f) pont): a weboldal biztonságos
          és működőképes üzemeltetése. Az érdekmérlegelés eredménye: a kezelt adat
          minimális, technikai jellegű, és nem használjuk fel arra, hogy téged
          azonosítsunk.
        </dd>
        <dt>Megőrzés</dt>
        <dd>
          A naplókat a tárhelyszolgáltató rövid, technikai ideig őrzi, mi külön nem
          gyűjtjük és nem elemezzük őket.
        </dd>
      </dl>

      <h3>3.2 Hírlevél</h3>
      <dl>
        <dt>Adatok</dt>
        <dd>
          Név vagy becenév (a megszólításhoz), e-mail-cím, a feliratkozás és a
          megerősítés időpontja, a feliratkozáskor
          használt IP-cím (ezt a hírlevélküldő rögzíti a hozzájárulás
          bizonyítékaként), valamint a kiküldött levelek megnyitására és a bennük
          lévő linkekre kattintásra vonatkozó statisztika.
        </dd>
        <dt>Cél</dt>
        <dd>
          Hírek, koncertek és megjelenések küldése e-mailben. A megnyitási
          statisztikát csak arra használjuk, hogy lássuk, érdekes-e, amit küldünk.
        </dd>
        <dt>Jogalap</dt>
        <dd>
          Az önkéntes hozzájárulásod (GDPR 6. cikk (1) bekezdés a) pont, valamint
          a gazdasági reklámtevékenységről szóló 2008. évi XLVIII. törvény 6. §).
          A feliratkozás kétlépcsős: a hozzájárulás csak a megerősítő e-mailben
          lévő linkre kattintással válik érvényessé. A hozzájárulást bármikor
          visszavonhatod a levelek alján lévő leiratkozó linkkel vagy e-mailben; a
          visszavonás a korábbi adatkezelés jogszerűségét nem érinti.
        </dd>
        <dt>Megőrzés</dt>
        <dd>
          A leiratkozásig vagy a törlési kérésedig. A meg nem erősített
          feliratkozásokat 30 nap után töröljük. Leiratkozás után a hírlevélküldő
          az e-mail-címet csak abból a célból őrzi, hogy ne küldjünk neked újra
          levelet.
        </dd>
        <dt>Címzett</dt>
        <dd>Mailchimp (lásd a 4. pontot).</dd>
      </dl>

      <h3>3.3 Hozzászólások a blogon</h3>
      <dl>
        <dt>Adatok</dt>
        <dd>
          Név (vagy becenév), e-mail-cím, a hozzászólás szövege, a beküldés
          időpontja. Az IP-címedet a beküldéskor legfeljebb 10 percig, kizárólag a
          szerver memóriájában tartjuk a tömeges beküldés megakadályozására, nem
          mentjük el.
        </dd>
        <dt>Cél</dt>
        <dd>
          A hozzászólás moderálása és közzététele a bejegyzés alatt. A neved és a
          hozzászólás szövege nyilvánosan megjelenik, az e-mail-címed nem.
        </dd>
        <dt>Jogalap</dt>
        <dd>
          A közzétételhez az önkéntes hozzájárulásod (GDPR 6. cikk (1) bekezdés a)
          pont), amelyet a beküldő űrlapon adsz meg. A visszaélések (spam, sértő
          tartalom) kiszűrése jogos érdekünk (GDPR 6. cikk (1) bekezdés f) pont).
        </dd>
        <dt>Megőrzés</dt>
        <dd>
          A jóváhagyott hozzászólást a bejegyzés eléréséig vagy a törlési
          kérésedig őrizzük. A jóvá nem hagyott vagy spamnek jelölt
          hozzászólásokat legkésőbb 30 napon belül töröljük.
        </dd>
        <dt>Címzett</dt>
        <dd>
          A hozzászólások a WordPress tartalomkezelőnkben ({WORDPRESS_PUBLIC_URL})
          tárolódnak, amelynek tárhelyét a Websupport Magyarország Kft. (Magyar
          Hosting) biztosítja.
        </dd>
      </dl>

      <h3>3.4 Kapcsolatfelvétel e-mailben vagy telefonon</h3>
      <dl>
        <dt>Adatok</dt>
        <dd>
          Név, e-mail-cím vagy telefonszám, és amit a levélben leírsz
          (booking-kérés, sajtómegkeresés, kérdés).
        </dd>
        <dt>Cél</dt>
        <dd>A megkeresés megválaszolása, az ügy intézése.</dd>
        <dt>Jogalap</dt>
        <dd>
          Szerződés előkészítése, ha fellépésről vagy együttműködésről van szó
          (GDPR 6. cikk (1) bekezdés b) pont); egyéb esetben jogos érdekünk a
          megkeresés megválaszolása (f) pont).
        </dd>
        <dt>Megőrzés</dt>
        <dd>
          Az ügy lezárásáig, legfeljebb 1 évig; ha szerződés jön létre, a
          számviteli és polgári jogi határidőkig.
        </dd>
      </dl>

      <h3>3.5 Beágyazott tartalmak a blogban</h3>
      <p>
        A blogbejegyzésekben YouTube-videók, Spotify- és Bandcamp-lejátszók
        lehetnek. Ezeket csak akkor töltjük be, ha a süti-beállításokban
        engedélyezted a beágyazott tartalmakat. Engedélyezés után a böngésződ
        közvetlenül a szolgáltatóhoz kapcsolódik, amely az IP-címedet és a saját
        sütijeit a saját szabályai szerint kezeli, önálló adatkezelőként:
      </p>
      <ul>
        {EMBED_PROVIDERS.map((provider) => (
          <li key={provider.name}>
            {provider.name} – {provider.purpose}{" "}
            <a href={provider.policyUrl} rel="noreferrer" target="_blank">
              Adatvédelmi tájékoztató
            </a>
          </li>
        ))}
      </ul>

      <h3>3.6 Tesztoldal belépés</h3>
      <p>
        A fejlesztői és előnézeti címeken (nem a galaxisok.hu-n) jelszavas
        belépés védi az oldalt. A belépés tényét egy technikai süti őrzi 30 napig;
        személyes adatot nem tartalmaz.
      </p>

      <h2>4. Adatfeldolgozók és címzettek</h2>
      <p>
        Az alábbi szolgáltatók a mi megbízásunkból, adatfeldolgozási szerződés
        alapján férnek hozzá az adatokhoz:
      </p>
      <div className="legal-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Szolgáltató</th>
              <th>Feladat</th>
              <th>Székhely</th>
              <th>Adattovábbítás garanciája</th>
            </tr>
          </thead>
          <tbody>
            {PROCESSORS.map((processor) => (
              <tr key={processor.name}>
                <td>
                  <a href={processor.policyUrl} rel="noreferrer" target="_blank">
                    {processor.name}
                  </a>
                </td>
                <td>{processor.role}</td>
                <td>
                  {processor.address}, {processor.country}
                </td>
                <td>{processor.transfer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Hatóság, bíróság vagy más szerv részére csak jogszabályi kötelezettség
        alapján adunk ki adatot. Más célra harmadik félnek nem adjuk át és nem
        értékesítjük az adataidat.
      </p>

      <h2>5. Adattovábbítás harmadik országba</h2>
      <p>
        A Vercel és a Mailchimp az Amerikai Egyesült Államokban működik. Mindkét
        szolgáltató szerepel az EU–USA adatvédelmi keretrendszer (Data Privacy
        Framework) tanúsított résztvevői között, amelyet az Európai Bizottság
        2023/1795 megfelelőségi határozata a GDPR 45. cikke szerint megfelelő
        védelmi szintűnek ismert el. Ezen felül a szolgáltatókkal az Európai
        Bizottság által elfogadott általános adatvédelmi kikötések (GDPR 46. cikk
        (2) bekezdés c) pont) is érvényben vannak. A kikötések másolatát kérésre
        megküldjük.
      </p>

      <h2>6. Külső oldalak</h2>
      <p>
        Az oldalról ezekre a külső szolgáltatásokra vezetnek linkek. Ott már az ő
        adatkezelési szabályaik érvényesek, az általuk kezelt adatokért ők
        felelnek:
      </p>
      <ul>
        {EXTERNAL_SITES.map((site) => (
          <li key={site.name}>
            {site.name} – {site.purpose}
            {site.policyUrl ? (
              <>
                {" "}
                <a href={site.policyUrl} rel="noreferrer" target="_blank">
                  Szabályzat
                </a>
              </>
            ) : null}
          </li>
        ))}
      </ul>

      <h2>7. Gyermekek</h2>
      <p>
        A hírlevélre és a hozzászóláshoz adott hozzájárulás 16 éves kortól
        érvényes. 16 év alatti látogató csak szülője vagy gondviselője
        engedélyével iratkozhat fel vagy szólhat hozzá. Ha tudomásunkra jut, hogy
        16 év alatti személy adatát ilyen engedély nélkül kezeljük, azt töröljük.
      </p>

      <h2>8. Adatbiztonság</h2>
      <p>
        Az oldal és a tartalomkezelő kizárólag titkosított (HTTPS) kapcsolaton
        érhető el. A hozzászólásokat és a feliratkozásokat a saját szerverünkön
        keresztül, a tartalomkezelő és a hírlevélküldő jogosultságkezelésével
        védve továbbítjuk, így a böngésződből közvetlenül nem jut el adat ezekhez a
        szolgáltatókhoz. Az adminisztrációs felületekhez csak a zenekar erre
        kijelölt tagjai férnek hozzá, kétlépcsős azonosítással. Adatvédelmi
        incidens esetén a GDPR 33–34. cikke szerint járunk el: ha az incidens
        valószínűsíthetően magas kockázattal jár rád nézve, indokolatlan
        késedelem nélkül értesítünk.
      </p>

      <h2>9. A jogaid</h2>
      <p>A GDPR 15–22. cikke alapján kérheted:</p>
      <ul>
        <li>
          <strong>Hozzáférés</strong> – tájékoztatást arról, kezeljük-e az adatodat,
          és ha igen, másolatot róla.
        </li>
        <li>
          <strong>Helyesbítés</strong> – a pontatlan adat javítását, a hiányos adat
          kiegészítését.
        </li>
        <li>
          <strong>Törlés</strong> – adataid törlését, ha már nincs rá jogalap, vagy
          visszavontad a hozzájárulásod.
        </li>
        <li>
          <strong>Korlátozás</strong> – hogy az adatot a vitás kérdés rendezéséig
          csak tároljuk.
        </li>
        <li>
          <strong>Adathordozhatóság</strong> – a hozzájárulás vagy szerződés alapján
          kezelt adatok géppel olvasható formában történő kiadását.
        </li>
        <li>
          <strong>Tiltakozás</strong> – a jogos érdeken alapuló adatkezelés ellen;
          ilyenkor csak akkor folytatjuk, ha kényszerítő erejű jogos ok indokolja.
        </li>
        <li>
          <strong>Hozzájárulás visszavonása</strong> – bármikor, a korábbi
          adatkezelés jogszerűségének érintése nélkül.
        </li>
      </ul>
      <p>
        Kérésedet a{" "}
        <a href={`mailto:${CONTROLLER.privacyEmail}`}>{CONTROLLER.privacyEmail}</a>{" "}
        címre küldheted. A kérelmekre indokolatlan késedelem nélkül, legkésőbb
        egy hónapon belül válaszolunk; összetett kérés esetén ez a határidő
        további két hónappal meghosszabbítható, erről a kérés beérkezésétől
        számított egy hónapon belül tájékoztatunk. A tájékoztatás és az
        intézkedés díjmentes, kivéve ha a kérés egyértelműen megalapozatlan vagy
        túlzó. Személyazonosságod igazolását kérhetjük, ha kétség merül fel.
      </p>

      <h2>10. Jogorvoslat</h2>
      <p>
        Ha úgy gondolod, hogy az adataid kezelése sérti a GDPR-t, panaszt tehetsz
        a felügyeleti hatóságnál:
      </p>
      <dl>
        <dt>Hatóság</dt>
        <dd>{NAIH.name}</dd>
        <dt>Cím</dt>
        <dd>{NAIH.address}</dd>
        <dt>Postacím</dt>
        <dd>{NAIH.postal}</dd>
        <dt>Telefon</dt>
        <dd>{NAIH.phone}</dd>
        <dt>E-mail</dt>
        <dd>
          <a href={`mailto:${NAIH.email}`}>{NAIH.email}</a>
        </dd>
        <dt>Web</dt>
        <dd>
          <a href={NAIH.url} rel="noreferrer" target="_blank">
            {NAIH.url}
          </a>
        </dd>
      </dl>
      <p>
        Emellett bírósághoz is fordulhatsz (GDPR 79. cikk, Infotv. 23. §). A pert
        választásod szerint a lakóhelyed vagy tartózkodási helyed szerint illetékes
        törvényszék előtt is megindíthatod. Örülünk, ha előbb nekünk írsz: a
        legtöbb kérdést gyorsan tudjuk rendezni.
      </p>

      <h2>11. A tájékoztató módosítása</h2>
      <p>
        Ha változik az adatkezelés (új szolgáltató, új funkció), ezt a tájékoztatót
        frissítjük, és a lap tetején jelezzük a hatálybalépés napját és a verziót.
        Lényeges változásról a hírlevél-feliratkozókat e-mailben is értesítjük.
      </p>
    </LegalPage>
  );
}
