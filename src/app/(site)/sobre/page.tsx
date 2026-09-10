import type { Metadata } from "next";
import Image from "next/image";
import { Code2, Ruler, Handshake } from "lucide-react";

import { site, waLink } from "@/lib/site";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Hairline, Reveal, WordReveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Sobre",
  description: `${site.name} é ${site.role.toLowerCase()} e ${site.secondRole.toLowerCase()}, especializado em locação comercial na Grande Vitória — galpões, lojas, salas e terrenos.`,
  alternates: { canonical: "/sobre" },
};

const TRACOS = [
  {
    icon: Ruler,
    title: "Eu meço antes de anunciar",
    body: "Nenhum imóvel entra na carteira sem eu ter estado lá com trena. Pé-direito, vão entre pilares, largura de portão, carga elétrica disponível. Se alguma medida inviabiliza o seu tipo de operação, eu digo antes de você marcar visita.",
  },
  {
    icon: Code2,
    title: "Engenheiro de software antes de corretor",
    body: "Este site fui eu que construí — do desenho ao servidor. Nenhum plugin de portal, nenhum modelo comprado. É por isso que cada imóvel aqui tem um tour de verdade, e não uma galeria de cinco fotos como em todo lugar.",
  },
  {
    icon: Handshake,
    title: "Estrutura de imobiliária por trás",
    body: `A parte chata — análise de crédito da empresa, garantia locatícia, vistoria e contrato — corre pela ${site.partner.name}. Você fala com uma pessoa só e assina com uma empresa estabelecida.`,
  },
] as const;

export default function SobrePage() {
  return (
    <>
      <PageHero
        kicker="Quem conduz a visita"
        title="Ysraell"
        accent="Kunzmann."
        lede={`${site.role} e ${site.secondRole}, especializado em locação comercial. Duas profissões que parecem não conversar — até você reparar que as duas são, no fundo, sobre eliminar a distância entre o que a pessoa precisa e o que ela consegue enxergar.`}
        media={
          <div
            /* O PNG foi aparado ate a silhueta (1684x2536), entao a caixa
               segue essa proporcao exata: sem margem transparente, a cabeca
               encosta no topo da caixa e alinha com o kicker, e a pessoa
               ocupa a largura toda em vez de 56% dela. */
            className="relative aspect-[1684/2536] w-[13rem] sm:w-[16rem] lg:w-[22.5rem]"
            style={{
              maskImage: "linear-gradient(to bottom, black 78%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 78%, transparent 100%)",
            }}
          >
            {/* A foto recortada termina em linha reta na altura da cintura —
                sem o degradê acima, essa borda reta contra o fundo escuro lia
                como um corte malfeito, não como o fim natural do retrato. */}
            <Image
              src="/perfil/ysraell-sobre.png"
              alt="Ysraell Kunzmann"
              fill
              priority
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 256px, 208px"
              className="object-contain object-bottom"
            />
          </div>
        }
      />

      {/* ══ O problema ══ */}
      <section className="bg-noir py-24 md:py-36">
        <div className="container-noir grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <div>
            <p className="kicker text-gold mb-6">O incômodo</p>
            <h2 className="font-display text-bone text-[clamp(1.75rem,3.4vw,3rem)] leading-[0.98]">
              <WordReveal text="Galpão é vendido" />{" "}
              <span className="text-gilded italic">
                <WordReveal text="como se fosse apartamento." delay={0.14} />
              </span>
            </h2>
          </div>

          <div className="space-y-7">
            <Reveal>
              <p className="text-mist text-lg leading-relaxed">
                Repare em qualquer portal: um galpão de mil metros aparece com as mesmas cinco
                fotos de canto, o mesmo &ldquo;excelente localização&rdquo; e os mesmos campos de
                quarto e banheiro que um apartamento de dois dormitórios. Como se quem procura
                ponto para instalar uma operação estivesse decidindo pela decoração.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-ash text-lg leading-relaxed">
                Só que a decisão de um empresário é outra. É se a carreta entra sem manobrar na
                rua. É se o pé-direito comporta a estante. É se o transformador aguenta a
                máquina que ele vai comprar ano que vem. Nenhum anúncio responde isso — então
                ele fecha o escritório, atravessa a Grande Vitória e descobre em quinze segundos
                que não serve.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-ash text-lg leading-relaxed">
                No modelo antigo, essa visita perdida não custa nada ao corretor — custa ao
                empresário, que fechou a loja por meio dia. Eu trabalho do outro lado dessa
                conta: quanto mais gente eliminar o imóvel de casa, melhor. Se você desistir
                vendo o tour, nós dois ganhamos a manhã de volta.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="text-mist border-gold-deep/50 border-l pl-6 text-lg leading-relaxed italic">
                Anunciar bem não é fazer o imóvel parecer maior. É fazer a empresa certa
                reconhecê-lo mais rápido.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ Diferenciais ══ */}
      <section className="bg-noir-2 py-24 md:py-32">
        <div className="container-noir">
          <p className="kicker text-gold mb-14">O que isso muda para você</p>
          <Hairline className="mb-2" />
          <ul>
            {TRACOS.map((traco, i) => (
              <Reveal key={traco.title} as="li" delay={i * 0.1}>
                <div className="border-noir-4 grid gap-5 border-b py-10 md:grid-cols-[auto_1fr_1.4fr] md:gap-12">
                  <traco.icon className="text-gold-deep h-6 w-6 shrink-0" strokeWidth={1.15} />
                  <h3 className="font-display text-bone text-2xl leading-tight">{traco.title}</h3>
                  <p className="text-ash leading-relaxed">{traco.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.2}>
            <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4">
              <span className="kicker">{site.creci}</span>
              <span className="kicker">{site.region} · {site.state}</span>
              <span className="kicker text-gold">{site.partner.name}</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="bg-noir py-24 md:py-32">
        <div className="container-noir max-w-3xl">
          <h2 className="font-display text-bone text-[clamp(2rem,4.5vw,4rem)] leading-[0.95]">
            <WordReveal text="Prefere julgar pelo" />{" "}
            <span className="text-gilded italic">
              <WordReveal text="resultado?" delay={0.12} />
            </span>
          </h2>
          <Reveal delay={0.2}>
            <p className="text-ash mt-7 text-lg leading-relaxed">
              Abra qualquer galpão da carteira e percorra o tour inteiro. Em três minutos você
              sabe se o meu jeito de trabalhar serve para a sua operação.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/imoveis" variant="gold" size="lg" arrow>
                Ver a carteira
              </ButtonLink>
              <ButtonLink href={waLink()} variant="ghost" size="lg">
                Falar comigo
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
