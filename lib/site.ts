export const SITE = {
  name: "Samuel Patak",
  monogram: "SP",
  role: "Freelancer · web, reklama, automatizácie",
  email: "samuel.patak@gmail.com",
  tagline: "Samuel Patak. Web, reklamy a automatizácie.",
  description:
    "Samuel Patak — freelancer na web dizajn, stavbu webu na kľúč, nastavenie reklám a automatizácie. Otočte kolečko trezoru a otvorte komoru, ktorá vás zaujíma.",
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
