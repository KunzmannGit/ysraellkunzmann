"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Bath, BedDouble, Car, Compass, Ruler } from "lucide-react";
import type { Property } from "@/lib/types";
import { KIND_LABEL } from "@/lib/types";
import { brl, cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

function Spec({ icon: Icon, value }: { icon: typeof BedDouble; value: string }) {
  return (
    <span className="text-ash flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em]">
      <Icon className="h-3.5 w-3.5" strokeWidth={1.25} />
      {value}
    </span>
  );
}

export function PropertyCard({
  property,
  index = 0,
  priority = false,
}: {
  property: Property;
  index?: number;
  priority?: boolean;
}) {
  const hasTour = Boolean(property.tour);
  const isRent = property.purpose === "aluguel";

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay: (index % 3) * 0.09, ease: EASE }}
    >
      <Link
        href={`/imoveis/${property.slug}`}
        data-cursor="media"
        data-cursor-label={hasTour ? "Iniciar tour" : "Ver imóvel"}
        className="group block"
      >
        {/* ── Imagem ── */}
        <div className="bg-noir-3 relative aspect-4/5 overflow-hidden rounded-sm">
          <Image
            src={property.cover.url}
            alt={property.cover.alt}
            fill
            priority={priority}
            sizes="(min-width:1280px) 32vw, (min-width:768px) 48vw, 92vw"
            className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />

          {/* O preto sobe na foto no hover: dá foco ao texto que aparece */}
          <div className="scrim-b absolute inset-0 opacity-90" />
          <div className="bg-noir/0 group-hover:bg-noir/25 absolute inset-0 transition-colors duration-700" />

          {/* Etiquetas */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-noir/70 text-mist rounded-full px-3 py-1.5 font-mono text-[9px] tracking-[0.18em] uppercase backdrop-blur-md">
              {isRent ? "Aluguel" : "Venda"}
            </span>
            {hasTour && (
              <span className="bg-gold/90 text-noir flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[9px] font-medium tracking-[0.18em] uppercase backdrop-blur-md">
                <Compass className="h-3 w-3" strokeWidth={2} />
                Tour
              </span>
            )}
          </div>

          {property.status === "reservado" && (
            <span className="border-ember/60 text-ember absolute top-4 right-4 rounded-full border bg-black/60 px-3 py-1.5 font-mono text-[9px] tracking-[0.18em] uppercase backdrop-blur-md">
              Reservado
            </span>
          )}

          {/* Preço grudado no rodapé da foto */}
          <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-3">
            <p className="text-bone font-mono text-lg leading-none">
              {brl(property.price)}
              {isRent && property.price != null && (
                <span className="text-mist/60 text-[10px]"> /mês</span>
              )}
            </p>
            <span className="kicker text-mist/70">{KIND_LABEL[property.kind]}</span>
          </div>

          {/* Régua de ouro que se desenha no hover */}
          <span className="bg-gold absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
        </div>

        {/* ── Texto ── */}
        <div className="pt-5">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display text-bone group-hover:text-gold text-2xl leading-tight transition-colors duration-500">
              {property.title}
            </h3>
            <span className="text-smoke shrink-0 font-mono text-[10px] tracking-[0.14em] uppercase">
              {property.address.district}
            </span>
          </div>

          <p className="text-ash mt-2.5 line-clamp-2 text-sm leading-relaxed italic">
            {property.headline}
          </p>

          <div
            className={cn(
              "border-noir-4 mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-4",
              "transition-colors duration-500 group-hover:border-gold-deep/40",
            )}
          >
            {property.bedrooms != null && property.bedrooms > 0 && (
              <Spec icon={BedDouble} value={`${property.bedrooms} dorm`} />
            )}
            {property.bathrooms != null && property.bathrooms > 0 && (
              <Spec icon={Bath} value={`${property.bathrooms} banho`} />
            )}
            {property.parking != null && property.parking > 0 && (
              <Spec icon={Car} value={`${property.parking} vaga${property.parking > 1 ? "s" : ""}`} />
            )}
            {property.area != null && <Spec icon={Ruler} value={`${property.area} m²`} />}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
