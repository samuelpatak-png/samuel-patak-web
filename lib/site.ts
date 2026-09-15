export const SITE = {
  name: "Samuel Patak",
  monogram: "SP",
  role: "Freelancer na dopyty, web a systémy okolo nich",
  email: "samuel.patak@gmail.com",
  tagline: "Stroj na dopyty. Diel si vyberiete na výkrese.",
  sheet: "SP-01",
  description:
    "Samuel Patak — freelancer na automatizácie, web design, stavbu webu, AI riešenia, reklamu, CRM a hľadanie klientov. Kliknite na diel stroja a napíšte, čo treba zapojiť.",
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
