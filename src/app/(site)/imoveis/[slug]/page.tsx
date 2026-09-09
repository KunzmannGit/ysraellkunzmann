import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bath, BedDouble, Car, Check, MapPin, Ruler, Sparkles } from "lucide-react";

import { getProperties, getPropertyBySlug, getRelated } from "@/lib/properties";
import { KIND_LABEL } from "@/lib/types";
import { brl } from "@/lib/utils";
import { site, waLink } from "@/lib/site";
import { ScrollTour } from "@/components/tour/ScrollTour";
import { Gallery } from "@/components/property/Gallery";
import { PropertyCard } from "@/components/property/PropertyCard";
import { LeadForm } from "@/components/forms/LeadForm";
import { ButtonLink } from "@/components/ui/Button";
import { Hairline, Reveal, WordReveal } from "@/components/ui/Reveal";

export const revalidate = 3600;

export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Imóvel não encontrado" };

  const price = brl(property.price);
  const label = property.purpose === "aluguel" ? `${price}/mês` : price;

  return {
    title: `${property.title} — ${KIND_LABEL[property.kind]} em ${property.address.district}`,
    description: `${property.headline} ${label}. Tour imersivo e fotos completas.`,
    alternates: { canonical: `/imoveis/${property.slug}` },
    openGraph: {
      type: "article",
      title: property.title,
      description: property.headline,
      images: [{ url: property.cover.url, width: 1200, height: 630, alt: property.cover.alt }],
    },
  };
}

function SpecBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BedDouble;
  label: string;
  value: string;
}) {
  return (
    <div className="border-noir-4 border-t pt-4">
      <Icon className="text-gold-deep mb-3 h-4 w-4" strokeWidth={1.25} />
      <p className="font-display text-bone text-2xl leading-none">{value}</p>
      <p className="text-smoke mt-2 font-mono text-[10px] tracking-[0.18em] uppercase">{label}</p>
    </div>
  );
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const related = await getRelated(property);
  const isRent = property.purpose === "aluguel";
  const images = [property.cover, ...property.gallery];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.headline,
    url: `${site.url}/imoveis/${property.slug}`,
    image: images.map((i) => i.url),
    datePosted: property.publishedAt,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.address.city,
      addressRegion: property.address.state,
      addressCountry: "BR",
    },
    offers: property.price
      ? {
          "@type": "Offer",
          price: property.price,
          priceCurrency: "BRL",
          availability: property.status === "publicado" ? "https://schema.org/InStock" : "https://schema.org/LimitedAvailability",
        }
      : undefined,
    numberOfRooms: property.bedrooms ?? undefined,
    floorSize: property.area
      ? { "@type": "QuantitativeValue", value: property.area, unitCode: "MTK" }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ══ Abertura ══ */}
      <section className="relative h-[78svh] min-h-[30rem] overflow-hidden">
        <Image
          src={property.cover.url}
          alt={property.cover.alt}
          fill
          priority
          sizes="100vw"
          className="animate-breathe object-cover"
        />
        {/* Quatro passadas de escurecimento: a foto de arquitetura costuma
            ser clara, e o titulo em Bodoni fino nao sobrevive sem isto. */}
        <div className="bg-noir/30 absolute inset-0" />
        <div className="from-noir via-noir/60 absolute inset-0 bg-linear-to-t to-transparent" />
        <div className="from-noir/70 absolute inset-0 bg-linear-to-r via-transparent to-transparent" />
        <div className="from-noir/80 absolute inset-x-0 top-0 h-60 bg-linear-to-b to-transparent" />

        <div className="container-noir relative flex h-full flex-col justify-end pb-14">
          <Link
            href="/imoveis"
            className="text-ash hover:text-gold mb-8 inline-flex w-fit items-center gap-2.5 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            Catálogo
          </Link>

          <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="kicker text-gold">{isRent ? "Para alugar" : "À venda"}</span>
            <span className="bg-smoke/40 h-3 w-px" />
            <span className="kicker">{KIND_LABEL[property.kind]}</span>
            <span className="bg-smoke/40 h-3 w-px" />
            <span className="kicker flex items-center gap-1.5">
              <MapPin className="h-3 w-3" strokeWidth={1.5} />
              {property.address.district} · {property.address.city}
            </span>
          </div>

          <h1 className="font-display text-bone text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.9]">
            {property.title}
          </h1>

          <p className="text-mist/85 mt-6 max-w-2xl text-lg leading-relaxed italic md:text-xl">
            {property.headline}
          </p>
        </div>
      </section>

      {/* ══ O tour ══ */}
      <ScrollTour property={property} />

      {/* ══ História + ficha ══ */}
      <section className="bg-noir py-24 md:py-32">
        <div className="container-noir grid gap-16 lg:grid-cols-[1.35fr_1fr] lg:gap-24">
          {/* Coluna narrativa */}
          <div>
            <p className="kicker text-gold mb-8">Sobre o imóvel</p>
            <div className="space-y-6">
              {property.story.split("\n\n").map((paragraph, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <p className="text-mist text-lg leading-relaxed">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            {/* Números */}
            <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {property.bedrooms != null && property.bedrooms > 0 && (
                <SpecBlock icon={BedDouble} label="Dormitórios" value={String(property.bedrooms)} />
              )}
              {property.bathrooms != null && property.bathrooms > 0 && (
                <SpecBlock icon={Bath} label="Banheiros" value={String(property.bathrooms)} />
              )}
              {property.parking != null && property.parking > 0 && (
                <SpecBlock icon={Car} label="Vagas" value={String(property.parking)} />
              )}
              {property.area != null && (
                <SpecBlock icon={Ruler} label="Área útil" value={`${property.area}`} />
              )}
            </div>

            {/* Diferenciais */}
            {property.features.length > 0 && (
              <div className="mt-20">
                <Hairline className="mb-10" />
                <p className="kicker text-gold mb-8">O que o imóvel tem</p>
                <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {property.features.map((feature, i) => (
                    <Reveal key={feature} as="li" delay={(i % 4) * 0.05}>
                      <div className="text-mist flex items-start gap-3">
                        <Check className="text-gold-deep mt-1 h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                        <span className="leading-relaxed">{feature}</span>
                      </div>
                    </Reveal>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Coluna de conversão */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border-noir-4 bg-noir-2/70 rounded-sm border p-7 backdrop-blur-sm md:p-9">
              <p className="kicker">{isRent ? "Aluguel mensal" : "Valor de venda"}</p>
              <p className="font-display text-bone mt-3 text-[clamp(2.25rem,4vw,3.25rem)] leading-none">
                {brl(property.price)}
              </p>

              {(property.condoFee || property.iptu) && (
                <ul className="border-noir-4 mt-6 space-y-2.5 border-t pt-6">
                  {property.condoFee ? (
                    <li className="text-ash flex justify-between font-mono text-[11px] tracking-[0.1em]">
                      <span className="text-smoke uppercase">Condomínio</span>
                      <span>{brl(property.condoFee)}</span>
                    </li>
                  ) : null}
                  {property.iptu ? (
                    <li className="text-ash flex justify-between font-mono text-[11px] tracking-[0.1em]">
                      <span className="text-smoke uppercase">IPTU / mês</span>
                      <span>{brl(property.iptu)}</span>
                    </li>
                  ) : null}
                  {isRent && property.price ? (
                    <li className="border-noir-4 text-bone mt-3 flex justify-between border-t pt-3 font-mono text-[11px] tracking-[0.1em]">
                      <span className="uppercase">Total estimado</span>
                      <span className="text-gold">
                        {brl(property.price + (property.condoFee ?? 0) + (property.iptu ?? 0))}
                      </span>
                    </li>
                  ) : null}
                </ul>
              )}

              <div className="mt-8 flex flex-col gap-3">
                <ButtonLink
                  href={waLink(
                    `Olá Ysraell, tenho interesse no imóvel "${property.title}" (${site.domain}/imoveis/${property.slug}).`,
                  )}
                  variant="gold"
                  size="lg"
                  className="w-full"
                >
                  Falar sobre este imóvel
                </ButtonLink>
                <ButtonLink href="#agendar" variant="ghost" size="lg" className="w-full">
                  Agendar visita
                </ButtonLink>
              </div>

              {property.viaPartner && (
                <p className="text-smoke border-noir-4 mt-7 border-t pt-6 text-xs leading-relaxed">
                  Captação em parceria com a imobiliária{" "}
                  <span className="text-ash">{site.partner.name}</span>. Contrato, vistoria e
                  garantia locatícia inclusos.
                </p>
              )}

              <p className="kicker mt-6">{site.creci}</p>
            </div>
          </aside>
        </div>
      </section>

      {/* ══ Galeria ══ */}
      <section id="galeria" className="bg-noir py-16 md:py-24">
        <div className="container-noir">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="kicker text-gold mb-5">Galeria</p>
              <h2 className="font-display text-bone text-[clamp(1.75rem,3.5vw,3rem)]">
                <WordReveal text="Cada canto," />{" "}
                <span className="text-gilded italic">
                  <WordReveal text="sem retoque." delay={0.1} />
                </span>
              </h2>
            </div>
            <p className="text-smoke hidden shrink-0 font-mono text-[10px] tracking-[0.2em] uppercase sm:block">
              {images.length} fotos
            </p>
          </div>

          <Gallery images={images} title={property.title} />
        </div>
      </section>

      {/* ══ Agendamento ══ */}
      <section id="agendar" className="bg-noir-2 scroll-mt-24 py-24 md:py-32">
        <div className="container-noir grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <div>
            <p className="kicker text-gold mb-6">Próximo passo</p>
            <h2 className="font-display text-bone text-[clamp(2rem,4vw,3.5rem)] leading-[0.95]">
              <WordReveal text="Quer ver" />
              <br />
              <span className="text-gilded italic">
                <WordReveal text="ao vivo?" delay={0.12} />
              </span>
            </h2>
            <Reveal delay={0.2}>
              <p className="text-ash mt-7 max-w-md leading-relaxed">
                Me diga dois horários que funcionam para você. Eu confirmo o acesso com o
                proprietário e levo a chave — sem fila de visita coletiva.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="text-smoke mt-8 flex items-center gap-3 text-sm">
                <Sparkles className="text-gold-deep h-4 w-4" strokeWidth={1.25} />
                Você já viu o tour. A visita é só para confirmar.
              </div>
            </Reveal>
          </div>

          <LeadForm
            variant="interesse"
            propertySlug={property.slug}
            propertyTitle={property.title}
          />
        </div>
      </section>

      {/* ══ Relacionados ══ */}
      {related.length > 0 && (
        <section className="bg-noir py-24 md:py-32">
          <div className="container-noir">
            <p className="kicker text-gold mb-6">Talvez também sirva</p>
            <h2 className="font-display text-bone mb-14 text-[clamp(1.75rem,3.5vw,3rem)]">
              <WordReveal text="Na mesma linha" />
            </h2>
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item, i) => (
                <PropertyCard key={item.id} property={item} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
