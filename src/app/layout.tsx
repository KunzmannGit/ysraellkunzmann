import type { Metadata, Viewport } from "next";
import "./globals.css";

import { fontVars } from "@/lib/fonts";
import { site } from "@/lib/site";
import { Grain } from "@/components/fx/Grain";
import { Cursor } from "@/components/fx/Cursor";

/**
 * Camada raiz: só o que vale para TODA a aplicação —
 * fontes, metadados, grão de filme e cursor.
 * A moldura de marketing (header, rodapé, cortina de abertura)
 * vive em (site)/layout.tsx; o painel tem a sua em (admin).
 */

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "corretor de imóveis",
    "aluguel de imóveis",
    "tour virtual imóvel",
    "imóveis para alugar",
    "corretor Vila Velha",
    "imóveis Grande Vitória",
    "aluguel Vila Velha ES",
    site.city,
    site.region,
    site.partner.name,
    "Ysraell Kunzmann",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#08070A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/** Dados estruturados: é assim que o Google entende que você é corretor. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: site.name,
  url: site.url,
  description: site.description,
  email: site.email,
  telephone: site.phone,
  areaServed: [
    { "@type": "City", name: "Vila Velha" },
    { "@type": "City", name: "Vitória" },
    { "@type": "City", name: "Serra" },
    { "@type": "City", name: "Cariacica" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressRegion: site.state,
    addressCountry: "BR",
  },
  knowsLanguage: ["pt-BR"],
  memberOf: { "@type": "Organization", name: site.partner.name },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={fontVars} suppressHydrationWarning>
      <body className="bg-noir text-mist antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Sem JavaScript a cortina de abertura nunca se abriria.
            Esta regra a remove antes que ela chegue a aparecer. */}
        <noscript>
          <style>{`#yk-preloader{display:none!important}`}</style>
        </noscript>
        <Grain />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
