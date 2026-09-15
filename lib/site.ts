export const SITE = {
  name: "Samuel Patak",
  monogram: "SP",
  role: "Freelancer · web a reklama",
  email: "samuel.patak@gmail.com",
  tagline: "Natočte trezor. Vnútri je presne to, čo hľadáte.",
  description:
    "Samuel Patak — freelancer na web dizajn, stavbu webu na kľúč a nastavenie reklám. Otočte kolečko trezoru a otvorte komoru, ktorá vás zaujíma.",
};

export function siteUrl(): string {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://samuel-patak-web.vercel.app";
}
