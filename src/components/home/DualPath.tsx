"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   A BIFURCACAO

   Quem chega no site do corretor e uma de duas pessoas:
   procura imovel, ou tem imovel. Em vez de esconder o segundo
   num item de menu, ele ganha metade da tela.

   No desktop, o lado sob o cursor se abre e o outro recua —
   o proprio layout responde a intencao antes do clique.
   ═══════════════════════════════════════════════════════════ */

const PATHS = [
  {
    href: "/imoveis",
    eyebrow: "Para quem procura",
    title: "Quero morar",
    line: "aqui",
    body: "Catálogo curado, tour imersivo em cada anúncio e a verdade sobre o imóvel antes da visita.",
    cta: "Ver imóveis disponíveis",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80",
    alt: "Interior iluminado de um apartamento",
  },
  {
    href: "/anuncie",
    eyebrow: "Para quem tem",
    title: "Quero alugar",
    line: "meu imóvel",
    body: "Eu fotografo, gravo o tour, anuncio e conduzo as visitas. Você recebe o contrato pronto com garantia locatícia.",
    cta: "Anunciar meu imóvel",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=80",
    alt: "Fachada de uma casa ao entardecer",
  },
] as const;

export function DualPath() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="bg-void relative" aria-label="Escolha seu caminho">
      <div className="flex min-h-[80svh] flex-col lg:flex-row">
        {PATHS.map((path, i) => {
          const isHovered = hovered === i;
          const isDimmed = hovered !== null && !isHovered;

          return (
            <Link
              key={path.href}
              href={path.href}
              data-cursor="media"
              data-cursor-label={path.cta}
              onPointerEnter={() => setHovered(i)}
              onPointerLeave={() => setHovered(null)}
              className={cn(
                "group relative flex flex-1 items-end overflow-hidden",
                "min-h-[26rem] lg:min-h-0",
                "transition-[flex-grow] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                isHovered && "lg:grow-[1.45]",
                isDimmed && "lg:grow-[0.8]",
              )}
            >
              <Image
                src={path.image}
                alt={path.alt}
                fill
                sizes="(min-width:1024px) 55vw, 100vw"
                className={cn(
                  "object-cover transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isHovered ? "scale-105 opacity-55" : "scale-100 opacity-30",
                  isDimmed && "opacity-15 grayscale",
                )}
              />

              {/* Base preta: sem isso o texto some na foto clara */}
              <div className="from-void via-void/70 absolute inset-0 bg-linear-to-t to-transparent" />

              {/* Divisória de ouro entre os dois lados */}
              {i === 0 && (
                <span className="via-gold-deep/60 absolute inset-y-0 right-0 hidden w-px bg-linear-to-b from-transparent to-transparent lg:block" />
              )}

              <div className="relative z-10 w-full p-8 md:p-14 lg:p-16">
                <p className="kicker text-gold mb-5">{path.eyebrow}</p>

                <h2 className="font-display text-bone text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.92]">
                  {path.title}
                  <br />
                  <span
                    className={cn(
                      "italic transition-colors duration-700",
                      isHovered ? "text-gilded" : "text-bone/80",
                    )}
                  >
                    {path.line}
                  </span>
                </h2>

                <p
                  className={cn(
                    "text-mist/80 mt-6 max-w-md leading-relaxed transition-all duration-700",
                    "lg:max-h-0 lg:overflow-hidden lg:opacity-0",
                    isHovered && "lg:max-h-40 lg:opacity-100",
                  )}
                >
                  {path.body}
                </p>

                <span className="text-gold mt-8 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase">
                  {path.cta}
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
                    strokeWidth={1.5}
                  />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
