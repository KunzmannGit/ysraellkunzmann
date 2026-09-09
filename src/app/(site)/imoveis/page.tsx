import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Catalog } from "@/components/property/Catalog";
import { getProperties } from "@/lib/properties";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Imóveis",
  description: `Galpões, lojas, salas e terrenos para locação na Grande Vitória, com tour imersivo em cada anúncio. Curadoria de ${site.name}.`,
  alternates: { canonical: "/imoveis" },
};

// Revalida de hora em hora: catálogo de corretor não muda a cada minuto,
// e ISR mantém a página instantânea sem pesar no banco.
export const revalidate = 3600;

export default async function ImoveisPage() {
  const properties = await getProperties();

  return (
    <>
      <PageHero
        kicker="Catálogo"
        title="Galpões, lojas"
        accent="e terrenos."
        lede="Cada imóvel foi medido, fotografado e gravado por mim. O que você vê no tour é o que existe — inclusive o que costuma ficar fora da foto."
      />
      <Catalog properties={properties} />
    </>
  );
}
