// src/lib/about.ts
// Rólunk fallback: a WordPress `rolunk` page as published on 2026-10-13.
// Shown whenever WordPress is unreachable, so the page never changes face.

export const ABOUT_LEAD =
  "A Galaxisok a legkacskaringósabb pályájú magyar zenekarok egyike.";

export const ABOUT_PHOTO = {
  src: "/rolunk.jpg",
  alt: "Fotó: Komróczi Dia",
  title: "Galaxisok",
  width: 1920,
  height: 1280,
};

export const ABOUT_HTML = `
<p>A Galaxisok a legkacskaringósabb pályájú magyar zenekarok egyike.</p>
<p>Szabó Benedek énekes-dalszerző szólóprojektjeként, Cseh Tamás és a Neutral Milk Hotel ihlette tábortüzes-sikálós polbeattel indult, valódi zenekarrá alakulva csilingelő gitárpoppal folytatódott, hogy aztán a siker kapujában egy huszárvágással hirtelen kísérleti zongorás balladákra váltson, később brazil tropicaliával és afrikai dallamokkal kacérkodjon, megjelentessen egy nyolcvanas évekbeli jugoszláv posztpunk-kazettákat idéző albumot, majd egy kendőzetlenül politikus protestlemezt.</p>
<p>2027 tavaszán jelenik meg a <strong><em>Láthatatlan ember</em></strong> című kilencedik album, ami hangulatában egészen a kezdetekhez, Szabó Benedek első szólólemezéhez, a <em>Kapuzárási Piknik</em>hez kanyarodik vissza. Az egykor Bajáról Budapestre költöző, homályos álmait neonfényes éjszakákon lángoló szenvedéllyel kergető huszonéves fiúból mára negyven körüli férfi lett, aki kénytelen szembenézni az öregedéssel, számot vetni egykori terveit illetően, és megérteni, milyen érzés láthatatlannak lenni.</p>
<h1 style="text-align: center;"><strong>KONTAKT</strong></h1>
<p style="text-align: center;">MENEDZSER &#8211; <strong>Tóth Barbara<br />
</strong>+3630 623 5677<br />
galaxisokmail@gmail.com</p>
`.trim();
