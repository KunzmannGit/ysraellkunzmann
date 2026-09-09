import type { Metadata } from "next";
import Image from "next/image";
import { Code2, Compass, Handshake } from "lucide-react";

import { site, waLink } from "@/lib/site";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Hairline, Reveal, WordReveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Sobre",
  description: `${site.name} é ${site.role.toLowerCase()} e ${site.secondRole.toLowerCase()}. Conheça o método por trás dos tours imersivos e da parceria com a ${site.partner.name}.`,
  alternates: { canonical: "/sobre" },
};

const TRAITS = [
  {
    icon: Code2,
    title: "Engenheiro antes de corretor",
    body: "Seis anos escrevendo software. O site que você está usando agora fui eu que construí — do design ao deploy. Nenhum plugin de portal, nenhum template comprado.",
  },
  {
    icon: Compass,
    title: "Eu visito antes de anunciar",
    body: "Nenhum imóvel entra no catálogo sem eu ter estado lá, medido a luz e reparado no que a foto esconde. Se eu não moraria, eu digo por quê.",
  },
  {
    icon: Handshake,
    title: "Estrutura de imobiliária",
    body: `A parte chata — crédito, garantia, vistoria, contrato — corre pela ${site.partner.name}. Você ganha a agilidade de falar com uma pessoa só e a segurança de uma empresa.`,
  },
] as const;

export default function SobrePage() {
  return (
    <>
      <PageHero
        kicker="Quem conduz a visita"
        title="Ysraell"
        accent="Kunzmann."
        lede={`${site.role} e ${site.secondRole}. Duas profissões que parecem não conversar — até você perceber que as duas são, no fundo, sobre reduzir a distância entre o que a pessoa quer e o que ela consegue enxergar.`}
      />

      {/* ══ Faixa visual ══
          Ysraell: para colocar seu retrato aqui, salve a foto em
          public/img/ysraell.jpg e troque o src abaixo. Formato ideal:
          vertical, 1400x1800, luz lateral, fundo escuro. */}
      <section className="relative h-[46svh] min-h-[20rem] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=2400&q=82"
          alt="Interior de uma casa em fim de tarde"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="from-noir via-noir/35 to-noir/75 absolute inset-0 bg-linear-to-t" />
      </section>

      {/* ══ História ══ */}
      <section className="bg-noir py-24 md:py-36">
        <div className="container-noir grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <div>
            <p className="kicker text-gold mb-6">A virada</p>
            <h2 className="font-display text-bone text-[clamp(1.75rem,3.4vw,3rem)] leading-[0.98]">
              <WordReveal text="Eu procurei apartamento" />{" "}
              <span className="text-gilded italic">
                <WordReveal text="por sete meses." delay={0.14} />
              </span>
            </h2>
          </div>

          <div className="space-y-7">
            <Reveal>
              <p className="text-mist text-lg leading-relaxed">
                Vinte e três visitas. Dessas, dezenove eu soube que não serviam nos
                primeiros quinze segundos — e mesmo assim tinha atravessado a cidade,
                perdido a manhã e ouvido meia hora de conversa sobre um imóvel que a foto
                do anúncio tinha inventado.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-ash text-lg leading-relaxed">
                Na época eu trabalhava com software. E a coisa mais óbvia do mundo para
                quem escreve sistema é olhar um processo que desperdiça dezenove de vinte
                e três tentativas e perguntar por que ninguém consertou.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-ash text-lg leading-relaxed">
                Ninguém tinha consertado porque, no modelo antigo, a visita inútil não
                custa nada ao corretor — custa ao cliente. Então tirei o CRECI e passei a
                trabalhar do outro lado, com uma regra: o visitante precisa poder eliminar
                o imóvel de casa. Se ele desistir vendo o tour, ótimo. Nós dois ganhamos o
                sábado de volta.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="text-mist border-gold-deep/50 border-l pl-6 text-lg leading-relaxed italic">
                Anunciar bem não é fazer o imóvel parecer melhor. É fazer a pessoa certa
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
            {TRAITS.map((trait, i) => (
              <Reveal key={trait.title} as="li" delay={i * 0.1}>
                <div className="border-noir-4 grid gap-5 border-b py-10 md:grid-cols-[auto_1fr_1.4fr] md:gap-12">
                  <trait.icon className="text-gold-deep h-6 w-6 shrink-0" strokeWidth={1.15} />
                  <h3 className="font-display text-bone text-2xl leading-tight">{trait.title}</h3>
                  <p className="text-ash leading-relaxed">{trait.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.2}>
            <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4">
              <span className="kicker">{site.creci}</span>
              <span className="kicker">
                {site.city} · {site.state}
              </span>
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
              Abra qualquer imóvel do catálogo e percorra o tour inteiro. Em três minutos
              você sabe se o meu jeito de trabalhar serve para você.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/imoveis" variant="gold" size="lg" arrow>
                Ver o catálogo
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
