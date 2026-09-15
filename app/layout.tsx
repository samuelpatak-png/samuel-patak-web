import type { Metadata, Viewport } from "next";
import { Figtree, Outfit } from "next/font/google";
import { SITE, siteUrl } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  variable: "--font-figtree",
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
    "Google Ads",
    "Meta reklamy",
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
  themeColor: "#e6ebf3",
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
    jobTitle: "Freelance web designer & developer",
    url,
    knowsLanguage: ["sk", "en"],
    offers: {
      "@type": "Offer",
      itemOffered: [
        { "@type": "Service", name: "Web dizajn" },
        { "@type": "Service", name: "Stavba webu na kľúč" },
        { "@type": "Service", name: "Nastavenie reklám" },
      ],
    },
  };

  return (
    <html lang="sk" className={`${outfit.variable} ${figtree.variable}`}>
      <body className="neu-page antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
