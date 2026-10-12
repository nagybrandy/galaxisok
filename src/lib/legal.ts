// src/lib/legal.ts
// Identity and processor facts shared by the ÁSZF, privacy and cookie pages.

import { BAND_EMAIL } from "@/lib/socials";

// Bump the version and date whenever any legal text changes.
export const LEGAL_VERSION = "2.0";
export const LEGAL_UPDATED_ISO = "2026-10-12";
export const LEGAL_UPDATED_LABEL = "2026. október 12.";

// The label runs the site (Eker tv. 4. § service provider, GDPR Art. 13
// controller). Company data matches the webshop ÁSZF at shop.bsidemusic.hu.
export const CONTROLLER = {
  name: "BSIDEMUSIC Kft.",
  representative: "Tóth Barbara, ügyvezető",
  address: "7623 Pécs, Semmelweis utca 28. 3. em. 7.",
  registration:
    "Cégjegyzékszám: 02-09-087116 (Pécsi Törvényszék Cégbírósága) · Adószám: 14218042-2-02",
  email: "bsidemusichu@gmail.com",
  privacyEmail: "bsidemusichu@gmail.com",
  bandEmail: BAND_EMAIL,
} as const;

export const SHOP_URL = "https://shop.bsidemusic.hu";
export const SHOP_TERMS_URL = `${SHOP_URL}/aszf`;
export const SHOP_PRIVACY_URL = `${SHOP_URL}/adatvedelmi-tajekoztato`;

export type Processor = {
  name: string;
  role: string;
  address: string;
  country: string;
  transfer: string;
  policyUrl: string;
};

export const PROCESSORS: Processor[] = [
  {
    name: "Vercel Inc.",
    role: "A weboldal tárhelye és kiszolgálása, technikai szervernaplók.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723",
    country: "Amerikai Egyesült Államok",
    transfer: "EU–USA adatvédelmi keretrendszer (DPF) tanúsítás és általános szerződési feltételek (SCC).",
    policyUrl: "https://vercel.com/legal/privacy-policy",
  },
  {
    name: "Websupport Magyarország Kft. (Magyar Hosting / Tárhelypark)",
    role: "A WordPress tartalomkezelő (admin.galaxisok.hu), a galaxisok.hu domain és a hirlevel@galaxisok.hu postafiók tárhelye.",
    address: "1119 Budapest, Fehérvári út 97–99.",
    country: "Magyarország",
    transfer: "Nincs harmadik országba továbbítás.",
    policyUrl: "https://www.mhosting.hu/adatkezelesi-tajekoztato/",
  },
  {
    name: "The Rocket Science Group LLC (Mailchimp, Intuit Inc.)",
    role: "Hírlevél-feliratkozások tárolása és a hírlevelek kiküldése.",
    address: "405 N. Angier Ave. NE, Atlanta, GA 30312",
    country: "Amerikai Egyesült Államok",
    transfer: "EU–USA adatvédelmi keretrendszer (DPF) tanúsítás és általános szerződési feltételek (SCC).",
    policyUrl: "https://www.intuit.com/privacy/statement/",
  },
];

export type ThirdParty = {
  name: string;
  purpose: string;
  policyUrl: string;
};

// Independent controllers whose content can load inside blog posts once
// the visitor allows embeds.
export const EMBED_PROVIDERS: ThirdParty[] = [
  {
    name: "YouTube (Google Ireland Ltd.)",
    purpose: "Beágyazott videók a blogbejegyzésekben.",
    policyUrl: "https://policies.google.com/privacy?hl=hu",
  },
  {
    name: "Spotify AB",
    purpose: "Beágyazott lejátszók a blogbejegyzésekben.",
    policyUrl: "https://www.spotify.com/hu/legal/privacy-policy/",
  },
  {
    name: "Bandcamp",
    purpose: "Beágyazott lejátszók a blogbejegyzésekben.",
    policyUrl: "https://bandcamp.com/privacy",
  },
];

// Sites the menu or the content links out to. They run their own rules.
export const EXTERNAL_SITES: ThirdParty[] = [
  {
    name: "Bandcamp",
    purpose: "Zene vásárlása és hallgatása.",
    policyUrl: "https://bandcamp.com/privacy",
  },
  {
    name: "BSIDE shop (shop.bsidemusic.hu)",
    purpose:
      "Merch vásárlása. A webshopot szintén a BSIDEMUSIC Kft. üzemelteti, saját ÁSZF-fel és adatvédelmi tájékoztatóval.",
    policyUrl: SHOP_PRIVACY_URL,
  },
  {
    name: "Jegyértékesítő partnerek",
    purpose: "Koncertjegyek vásárlása a koncertlistából nyíló linkeken.",
    policyUrl: "",
  },
  {
    name: "Instagram, Facebook, YouTube, Spotify, Apple Music, Deezer",
    purpose: "A zenekar hivatalos profiljai.",
    policyUrl: "",
  },
];

export const NAIH = {
  name: "Nemzeti Adatvédelmi és Információszabadság Hatóság",
  address: "1055 Budapest, Falk Miksa utca 9–11.",
  postal: "1363 Budapest, Pf. 9.",
  phone: "+36 (1) 391-1400",
  email: "ugyfelszolgalat@naih.hu",
  url: "https://naih.hu",
} as const;
