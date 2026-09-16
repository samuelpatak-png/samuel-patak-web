import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import { SITE, siteUrl } from "@/lib/site";
import "./globals.css";

const serif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
});

const ibm = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-ibm",
  display: "swap",
});

const url = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: `${SITE.name} — ${SITE.role}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url }],
  creator: SITE.name,
  keywords: [
    "Samuel Patak",
    "freelancer",
    "web dizajn",
    "tvorba webu",
    "automatizácie",
    "AI",
    "CRM",
    "Google Ads",
    "hľadanie klientov",
    "Slovensko",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1e2420",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    email: SITE.email,
    jobTitle: SITE.role,
    url,
    knowsLanguage: ["sk", "en"],
    offers: {
      "@type": "Offer",
      itemOffered: [
        { "@type": "Service", name: "Automatizácie" },
        { "@type": "Service", name: "Web dizajn" },
        { "@type": "Service", name: "Stavba webu na kľúč" },
        { "@type": "Service", name: "AI riešenia" },
        { "@type": "Service", name: "Reklama a propagácia" },
        { "@type": "Service", name: "Stavba CRM" },
        { "@type": "Service", name: "Hľadanie klientov" },
      ],
    },
  };

  return (
    <html lang="sk" className={`${serif.variable} ${ibm.variable}`}>
      <body className="sheet antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
