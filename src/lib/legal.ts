// src/lib/legal.ts
// Identity and processor facts shared by the ÁSZF, privacy and cookie pages.

import { BAND_EMAIL } from "@/lib/socials";

// Bump the version and date whenever any legal text changes.
export const LEGAL_VERSION = "2.0";
export const LEGAL_UPDATED_ISO = "2026-10-12";
export const LEGAL_UPDATED_LABEL = "2026. október 12.";

// Fill these in before the pages go live on galaxisok.hu. Eker tv. 4. §
// requires the service provider's name, seat and e-mail; GDPR Art. 13 the
// controller's identity. A band is not a legal person, so name the person
// or company that actually runs the site (e.g. a member or the label).
export const CONTROLLER = {
  name: "[Adatkezelő / szolgáltató neve]",
  representative: "[Képviselő neve]",
  address: "[Székhely vagy lakcím]",
  registration: "[Nyilvántartási szám / adószám, ha van]",
  email: BAND_EMAIL,
  privacyEmail: BAND_EMAIL,
} as const;

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
    name: "Tárhelypark Kft.",
    role: "A WordPress tartalomkezelő (admin.galaxisok.hu) és a hirlevel@galaxisok.hu postafiók tárhelye.",
    address: "1132 Budapest, Victor Hugo utca 18–22.",
    country: "Magyarország",
    transfer: "Nincs harmadik országba továbbítás.",
    policyUrl: "https://www.tarhelypark.hu/adatvedelem/",
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
    name: "B Side Music webshop (shop.bsidemusic.hu)",
    purpose: "Merch vásárlása.",
    policyUrl: "https://shop.bsidemusic.hu/",
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
