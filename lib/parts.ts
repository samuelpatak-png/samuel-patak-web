export type PartId =
  | "automatizacia"
  | "dizajn"
  | "stavba"
  | "ai"
  | "reklamy"
  | "crm"
  | "klienti";

export type Part = {
  id: PartId;
  index: number;
  code: string;
  rim: string;
  short: string;
  title: string;
  body: string;
  points: string[];
  cta: string;
};

export const PARTS: Part[] = [
  {
    id: "automatizacia",
    index: 0,
    code: "AUT",
    rim: "tok",
    short: "Automatizácie",
    title: "Tok namiesto kopírovania z okna do okna",
    body: "Dopyt, objednávka alebo hovor prejde z webu do mailu a ďalej. Ak to robíte trikrát ručne, zapojím to.",
    points: [
      "Formulár, mail, tabuľka a CRM v jednom ťahu",
      "Menej stratených správ medzi nástrojmi",
      "Tok na mieru, nie jeden univerzálny recept",
    ],
    cta: "Objednať automatizácie",
  },
  {
    id: "dizajn",
    index: 1,
    code: "WDS",
    rim: "oko",
    short: "Web design",
    title: "Vizuál, ktorý vyzerá ako vaša firma",
    body: "Kreslím pred kódom. Stránka má byť zapamätateľná, nie z katalógu motívov.",
    points: [
      "Hero a kľúčové stavy stránky",
      "Písmo a farba podľa biznisu",
      "Návrh uvidíte skôr, než sa začne stavať",
    ],
    cta: "Objednať design",
  },
  {
    id: "stavba",
    index: 2,
    code: "WEB",
    rim: "web",
    short: "Stavba webu",
    title: "Web, ktorý sa dá spustiť",
    body: "Štruktúra, kód, formuláre, nasadenie. Odovzdám prístupy, nie prezentáciu o tom, ako by to mohlo vyzerať.",
    points: [
      "Drží na mobile aj na širokom monitore",
      "SEO základy a analytika",
      "Hosting bez hádanky, kde to žije",
    ],
    cta: "Objednať stavbu",
  },
  {
    id: "ai",
    index: 3,
    code: "AIS",
    rim: "ai",
    short: "AI riešenia",
    title: "Asistent na konkrétny úkon",
    body: "Triedenie dopytov, návrhy odpovedí, interné pomôcky v CRM. Nie slogan, že máte AI.",
    points: [
      "Jeden jasný úkon, nie ozdoba na webe",
      "Napojenie na vaše dáta",
      "Človek schvaľuje, stroj pripravuje",
    ],
    cta: "Objednať AI diel",
  },
  {
    id: "reklamy",
    index: 4,
    code: "ADS",
    rim: "ads",
    short: "Reklama",
    title: "Budget ide tam, kde je meranie",
    body: "Google Ads alebo Meta. Najprv pixel a landing, potom minúte.",
    points: [
      "Čistá štruktúra kampaní",
      "Konverzie a zladený landing",
      "Ladenie podľa čísel, nie podľa pocitu",
    ],
    cta: "Objednať reklamu",
  },
  {
    id: "crm",
    index: 5,
    code: "CRM",
    rim: "crm",
    short: "Stavba CRM",
    title: "Klienti na jednom pulte",
    body: "Karty, stavy, follow-up. Od jednoduchého pipeline po CRM s hovormi.",
    points: [
      "Kto čaká a kto je hotový",
      "Napojenie na web a toky",
      "Úlohy namiesto pamäti v hlave",
    ],
    cta: "Objednať CRM",
  },
  {
    id: "klienti",
    index: 6,
    code: "LED",
    rim: "led",
    short: "Hľadanie klientov",
    title: "Najprv dopyty, potom systém",
    body: "Kanál, landing a follow-up, aby ľudia neskončili v stratenom inboxe.",
    points: [
      "Kanál, ktorý sedí na váš biznis",
      "Stránka, ktorá vie zobrať dopyt",
      "CRM hneď za prvým kontaktom",
    ],
    cta: "Objednať dopyty",
  },
];

export const PART_STEP = 360 / PARTS.length;

export function wrapIndex(index: number): number {
  return ((index % PARTS.length) + PARTS.length) % PARTS.length;
}

export function partByIndex(index: number): Part {
  return PARTS[wrapIndex(index)];
}

export function partById(id: string): Part | undefined {
  return PARTS.find((item) => item.id === id);
}

export function nearestPartIndex(rotation: number): number {
  const n = ((rotation % 360) + 360) % 360;
  return wrapIndex(Math.round(n / PART_STEP));
}

export function shortestRotationToIndex(from: number, index: number): number {
  const targetNorm = wrapIndex(index) * PART_STEP;
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
