# WordPress-oldali teendők (admin.galaxisok.hu)

Állapot: 2026-10-12. A Next.js oldal (galaxisok-new.vercel.app, main ág) kész és
kint van; az alábbiak mind a WordPress/tárhely oldalon várnak. Sorrendben haladj.

## 1. Az oldal visszahozása (most minden 403)

Az `admin.galaxisok.hu` minden címe üres, nginx-szintű **403**-at ad (REST API,
wp-login, főoldal is), 2026-10-12 14:47 óta. A PHP nem fut le, tehát nem
WordPress-hiba.

Ellenőrizd a tárhely panelben (we006.tarhely.com):

- [ ] A domain / aldomain nincs kikapcsolva, nincs karbantartás módban.
- [ ] `public_html/admin.galaxisok.hu/.htaccess` – nincs benne `Deny from all`,
      `Require all denied` vagy IP-korlátozás. Ha a WP-alapértelmezett
      `# BEGIN WordPress … # END WordPress` blokkon kívül más van, vedd ki.
- [ ] Nincs tárhelyoldali tiltás a korábbi fatal error miatt (hibanapló,
      „felfüggesztett” státusz).
- [ ] A `wp-content/plugins/` mappában csak **egy** `galaxisok-headless` mappa
      van; ha `galaxisok-headless.off` vagy `galaxisok-headless-2` maradt,
      töröld.

Kész, ha `https://admin.galaxisok.hu/wp-json/wp/v2/posts?per_page=1` JSON-t ad.

## 2. A frissített bővítmény feltöltése

Forrás: `wordpress/galaxisok-headless/` (ebben a repóban). Zip: a mappa
becsomagolva úgy, hogy a zip gyökerében a `galaxisok-headless/` mappa legyen.

Bővítmények → Új hozzáadása → Bővítmény feltöltése → zip → „Csere a
feltöltöttre”. Utána a bővítmény legyen **aktív**.

Mit tartalmaz a jelenlegi szerveren lévőhöz képest:

- `includes/newsletter.php`: a feliratkozó nevét `merge_fields.FNAME`-ként
  küldi a Mailchimpnek (a 14:39-es teszt igazolta, hogy ez már fent van).
- `galaxisok-headless.php`:
  - `add_filter('rest_allow_anonymous_comments', '__return_true')` – e nélkül a
    weboldalról küldött hozzászólás „csak a belépett felhasználók szólhatnak
    hozzá” hibát ad.
  - Kontakt tartalék szöveg: e-mail `bsidemusichu@gmail.com`, telefon
    `+36 30 623 5677`.
  - `comment_count` mező a posztok REST-válaszában (jóváhagyott
    hozzászólások száma) – a weboldal ezt mutatja a bloglistán és a poszt
    címe alatt. Amíg a régi bővítmény fut, a weboldal maga számolja
    (lassabb, de működik).
  - Napi WP-cron (`galaxisok_purge_old_comments`): a 30 napnál régebbi,
    jóvá nem hagyott és spam hozzászólásokat törli – ez a 3. pont
    „30 napon belül törlés” tétele, nem kell külön plugin.
  - Hozzászólás-értesítő: a weboldal REST-en küldi a kommentet, a WordPress
    pedig csak a klasszikus `comment_post` ágon küldene levelet. A bővítmény
    a REST-es létrehozás után meghívja ugyanazt a moderálási és szerzői
    értesítőt. Címzettek: a WP admin e-mail, a poszt szerzője, és
    `szabo.benedek.mail@gmail.com`. Amíg ez a verzió (1.6.0) nincs fent,
    az új kommentekről nem megy ki levél. A már beérkezett kommentekről
    utólag sem küld.
  - Válasz-értesítő (1.7.0): ha egy jóváhagyott hozzászólásra válasz
    érkezik, és azt is jóváhagyjátok, a szülő hozzászólás e-mail-címe
    kap egy levelet. A levél alján le lehet iratkozni. Jóváhagyás előtt
    nem megy ki, hogy a spam ne írjon idegeneknek.

Ellenőrzés: `curl -s https://admin.galaxisok.hu/wp-json/galaxisok/v1` →
JSON, benne a `newsletter` route.

## 3. Beállítások a WP adminban

### Hírlevél (Beállítások → Galaxisok Hírlevél)

- [ ] Mailchimp API kulcs: **új** kulcs (a régi `…-us19` kulcs a chatben
      szerepelt, generálj újat: Mailchimp → Account → Extras → API keys), a régit
      vond vissza.
- [ ] Audience ID: `839a11ac4a`.
- [ ] **Double opt-in: BEKAPCSOLVA.** Most ki van kapcsolva (a tesztfeliratkozás
      rögtön `subscribed` lett). Az ÁSZF, az adatkezelési tájékoztató és az
      űrlap szövege megerősítő e-mailt ígér, és a GDPR-hozzájárulás bizonyítéka
      is ez.

### Hozzászólások (Beállítások → Hozzászólások)

- [ ] „A hozzászólás írásához a felhasználónak regisztrálnia kell” – **KI**.
- [ ] „A hozzászólást kézzel kell jóváhagyni” – **BE** (a tájékoztató
      moderálást ígér).
- [ ] Név és e-mail megadása kötelező – BE.
- [ ] Avatarok/Gravatar – mindegy, a weboldal nem mutatja.
- [x] Jóvá nem hagyott / spam hozzászólások törlése 30 napon belül – a
      frissített bővítmény napi cronja intézi (2. pont), külön beállítás
      nem kell.

### Általános

- [ ] Admin e-mail: `bsidemusichu@gmail.com` (ide jön a helyreállítási mód
      levele és a hozzászólás-értesítő).
- [ ] Oldal nyelve: magyar; időzóna: Budapest.

### Kontakt oldal (Oldalak → kontakt)

- [ ] Ha ki van töltve, az ottani szöveg jelenik meg a weboldalon (nem a
      bővítmény tartaléka). Legyen benne: `bsidemusichu@gmail.com`,
      `+36 30 623 5677`; a `galaxisokmail@gmail.com` cím **nem létezik**, ne
      szerepeljen.

### Felhasználók

- [ ] A zenekar tagjainak / adminnak legyen saját WP-fiókja. A weboldal a WP
      regisztrált felhasználók hozzászólásait jelöli „(admin)”-ként, és a
      látogatók nem használhatják ezeket a neveket.
- [ ] Yoast SEO (ha telepítve): a posztoknál a SEO cím és meta leírás ki
      legyen töltve – a weboldal ezeket használja `<title>`-nek és
      description-nek.

## 4. Vercel (opcionális, a 2. pont kiváltja)

A `WORDPRESS_COMMENT_USERNAME` és `WORDPRESS_COMMENT_APPLICATION_PASSWORD`
csak **Preview** környezetben van beállítva, **Production**-ben nincs. A
bővítmény `rest_allow_anonymous_comments` engedélye után nem kell; ha mégis
app-jelszóval akarjátok küldeni, másoljátok át Production-be is (Vercel →
Project → Settings → Environment Variables).

## 5. Jelszavak cseréje (a chatben szerepeltek)

- [ ] WP alkalmazásjelszó a `bendeguznagy55@gmail.com` fióknál → visszavonás,
      új generálás, ha kell.
- [ ] FTP: `ftpa@admin.galaxisok.hu` jelszó → csere.
- [ ] `hirlevel@galaxisok.hu` postafiók jelszó → csere.
- [ ] Mailchimp API kulcs → új (lásd 3.).

## 6. Ellenőrzés a végén

1. `https://admin.galaxisok.hu/wp-json/wp/v2/posts?per_page=1` → JSON.
2. `https://galaxisok-new.vercel.app/blog` → a posztok betöltenek (nem
   gyorsítótárból: Vercel → Deployments → Redeploy, vagy
   `POST /api/revalidate` a titokkal).
3. Hírlevél: feliratkozás `bendeguznagy55+tesztX@gmail.com`-mal → Mailchimpben
   `pending`, FNAME kitöltve, megerősítő e-mail megjön.
4. Hozzászólás egy posztnál (név: „Teszt”, e-mail: a fenti) → „adminisztrátori
   jóváhagyásra vár”, a WP adminban megjelenik moderálásra. Utána töröld.
5. `https://galaxisok-new.vercel.app/sitemap.xml` → a posztok is szerepelnek.
