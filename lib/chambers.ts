export type ChamberId =
  | "dizajn"
  | "stavba"
  | "reklamy"
  | "recenzie"
  | "pristup"
  | "kontakt";

export type Chamber = {
  id: ChamberId;
  index: number;
  combo: string;
  short: string;
  title: string;
  kicker: string;
  lead: string;
  body: string;
  bullets: string[];
  cta: string;
};

export const CHAMBERS: Chamber[] = [
  {
    id: "dizajn",
    index: 0,
    combo: "00",
    short: "Dizajn",
    title: "Web dizajn, ktorý vyzerá ako značka, nie ako šablóna",
    kicker: "Komora 00 · vizuál",
    lead: "Najprv kreslím, potom kódim. Dizajn drží tvar ešte pred prvým commitom.",
    body: "Navrhnem vizuálnu identitu stránky: typografiu, rytmus, farby a rozloženie, ktoré sedí na firmu. Žiadny katalóg motívov. Stránka má byť zapamätateľná hneď, ako sa otvorí.",
    bullets: [
      "Návrh hero, stránok a kľúčových stavov (prázdny, chyba, hotovo)",
      "Typografia a farebný kód podľa vášho biznisu, nie podľa trendu týždňa",
      "Klikateľný prototyp, ktorý uvidíte skôr, než sa začne stavať",
    ],
    cta: "Chcem návrh",
  },
  {
    id: "stavba",
    index: 1,
    combo: "06",
    short: "Stavba",
    title: "Celý web na kľúč, od štruktúry po nasadenie",
    kicker: "Komora 06 · kód",
    lead: "Jeden človek postaví stránku tak, aby sa dala spustiť, nie len ukázať vo Figme.",
    body: "Poskladám kompletný web: štruktúru, kód, formuláre, rýchlosť a publikovanie. Pracujem v Next.js, takže stránka ide na Vercel bez divadla s hostingom. Od vizitky po e-shop.",
    bullets: [
      "Responzívny web, ktorý drží na mobile aj na širokom monitore",
      "Formuláre, SEO základy, analytika a čisté nasadenie",
      "Odovzdanie s prístupmi, nie s hádankou „kde to teraz žije“",
    ],
    cta: "Chcem postaviť web",
  },
  {
    id: "reklamy",
    index: 2,
    combo: "12",
    short: "Reklamy",
    title: "Reklamy nastavené tak, aby sa dalo povedať, čo zarába",
    kicker: "Komora 12 · kampane",
    lead: "Neklikám „publikovať“ a dúfam. Najprv meranie, potom budget.",
    body: "Pripravím Google Ads alebo Meta kampane: štruktúru účtu, konverzie, pixel a texty, ktoré sedia k stránke. Reklama bez merania je trezor bez kľúča.",
    bullets: [
      "Založenie a čistá štruktúra kampaní, nie jeden veľký kôš",
      "Sledovanie konverzií, pixel, eventy a landing zladený s inzerátom",
      "Prvé týždne ladenia, kým je vidieť, čo treba nechať a čo treba zavrieť",
    ],
    cta: "Chcem nastaviť reklamy",
  },
  {
    id: "recenzie",
    index: 3,
    combo: "18",
    short: "Recenzie",
    title: "Pečate z práce, nie vymyslené hviezdičky",
    kicker: "Komora 18 · dôvera",
    lead: "Do trezoru dávam reálne veci, ktoré som postavil. Falošné recenzie sem nepatria.",
    body: "Tu budú mená klientov, keď po odovzdaní budú chcieť nechať pečať. Zatiaľ otváram komoru ukážkou práce: e-shop, CRM, weby a nástroje, ktoré už bežia.",
    bullets: [
      "Kofein — e-shop s platbami a správou objednávok",
      "CallBot CRM — kampane, hovory a automatizácia predaja",
      "Scalar.sk a ďalšie weby postavené na merateľný výsledok",
    ],
    cta: "Pozrieť prístup",
  },
  {
    id: "pristup",
    index: 4,
    combo: "24",
    short: "Prístup",
    title: "Krátky kód: brief, návrh, stavba, kľúče",
    kicker: "Komora 24 · ako pracujem",
    lead: "Bez agentúrnych posunov. Píšete mne, odpovedám ja, odovzdávam ja.",
    body: "Začneme krátkym zadaním, čo má stránka spraviť. Potom uvidíte návrh, schválite smer a idem stavať. Na konci dostanete prístupy, nie prezentáciu o tom, ako by to mohlo vyzerať.",
    bullets: [
      "1. Natočíte komoru, napíšete čo potrebujete",
      "2. Dostanete návrh a jasný rozsah",
      "3. Staviam, ukazujem, odovzdám a nechám vám kľúče",
    ],
    cta: "Začať brief",
  },
  {
    id: "kontakt",
    index: 5,
    combo: "30",
    short: "Kontakt",
    title: "Napíšte, ktorú komoru chcete otvoriť",
    kicker: "Komora 30 · spojenie",
    lead: "Jedna správa stačí. Odpoviem s ďalším krokom, nie s balíčkom o ničom.",
    body: "Napíšte, či ide o dizajn, celý web alebo reklamy. Ak neviete, nechajte kolečko tam, kde to cítite, a opíšte problém. Kód doladíme spolu.",
    bullets: [
      "samuel.patak@gmail.com",
      "Odpoveď zvyčajne do jedného pracovného dňa",
      "Stručný brief je viac ako dlhá prezentácia",
    ],
    cta: "Poslať správu",
  },
];

export const CHAMBER_STEP = 360 / CHAMBERS.length;

export function wrapIndex(index: number): number {
  return ((index % CHAMBERS.length) + CHAMBERS.length) % CHAMBERS.length;
}

export function chamberByIndex(index: number): Chamber {
  return CHAMBERS[wrapIndex(index)];
}

export function nearestChamberIndex(rotation: number): number {
  const n = ((rotation % 360) + 360) % 360;
  return wrapIndex(Math.round(n / CHAMBER_STEP));
}

export function shortestRotationToIndex(from: number, index: number): number {
  const targetNorm = wrapIndex(index) * CHAMBER_STEP;
  const currentNorm = ((from % 360) + 360) % 360;
  let diff = targetNorm - currentNorm;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return from + diff;
}

export function shortestAngleDelta(from: number, to: number): number {
  let diff = to - from;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return diff;
}
