import type { Metadata } from "next";
import Image from "next/image";
import { Camera, Clock, FileCheck2, KeyRound, ScanEye, Users } from "lucide-react";

import { site, waLink } from "@/lib/site";
import { PageHero } from "@/components/layout/PageHero";
import { LeadForm } from "@/components/forms/LeadForm";
import { ButtonLink } from "@/components/ui/Button";
import { Hairline, Reveal, WordReveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Anuncie seu imóvel",
  description: `Tem um imóvel para alugar em Vila Velha ou na Grande Vitória? Eu fotografo, gravo o tour imersivo, anuncio e conduzo as visitas — com contrato e garantia locatícia pela ${site.partner.name}.`,
  alternates: { canonical: "/anuncie" },
};

const DELIVERABLES = [
  {
    icon: Camera,
    title: "Medição e ensaio",
    body: "Vou com trena e câmera. Pé-direito, vão entre pilares, largura de portão, carga elétrica. Sem grande-angular mentirosa — quem chega já sabe o que vai encontrar.",
  },
  {
    icon: ScanEye,
    title: "Tour imersivo",
    body: "Gravo o walkthrough completo e monto o tour que o interessado percorre no navegador, sem app e sem cadastro. Ele mede o seu galpão sem sair da empresa dele.",
  },
  {
    icon: Users,
    title: "Triagem de interessados",
    body: "Quem chega na visita já percorreu o imóvel inteiro. Corta o curioso e corta quem nunca ia caber ali — você recebe menos gente e gente com operação compatível.",
  },
  {
    icon: KeyRound,
    title: "Visitas acompanhadas",
    body: "Eu levo a chave e conduzo. Você não precisa parar o seu dia nem ceder cópia para desconhecido.",
  },
  {
    icon: FileCheck2,
    title: "Contrato e garantia",
    body: `Análise de crédito da empresa, seguro-fiança ou caução, vistoria com laudo fotografado e contrato registrado — tudo pela ${site.partner.name}.`,
  },
  {
    icon: Clock,
    title: "Retorno em 24h",
    body: "Você sabe quantas empresas viram o anúncio, quantas percorreram o tour inteiro e o que perguntaram. Relatório real, não 'tá difícil o mercado'.",
  },
] as const;

const COMPARISON = [
  {
    usual: "Seis fotos de canto, sem uma medida sequer",
    mine: "Pé-direito, vão, portão e carga elétrica documentados",
  },
  {
    usual: "Campo de quarto e banheiro num galpão de mil metros",
    mine: "A ficha que um empresário realmente lê antes de decidir",
  },
  {
    usual: "Doze visitas, onze de quem nunca ia caber ali",
    mine: "Três visitas de empresas com operação compatível",
  },
  {
    usual: "Você descobre o andamento perguntando",
    mine: "Você recebe os números sem precisar cobrar",
  },
] as const;

export default function AnunciePage() {
  return (
    <>
      <PageHero
        kicker="Para proprietários"
        title="Galpão parado não"
        accent="é preço alto. É dúvida."
        lede="Quem procura ponto não desiste do seu imóvel por causa do valor. Desiste porque não consegue saber, do escritório, se a operação dele cabe ali dentro. Enquanto essa dúvida existir, o galpão continua vazio."
      >
        <div className="mt-11 flex flex-wrap gap-4">
          <ButtonLink href="#cadastrar" variant="gold" size="lg" arrow>
            Cadastrar meu imóvel
          </ButtonLink>
          <ButtonLink
            href={waLink("Olá Ysraell, tenho um imóvel para alugar e quero entender como funciona.")}
            variant="ghost"
            size="lg"
          >
            Tirar uma dúvida antes
          </ButtonLink>
        </div>
      </PageHero>

      {/* ══ Faixa de imagem ══ */}
      <section className="relative h-[42svh] min-h-[18rem] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2400&q=82"
          alt="Galpão em plena operação logística"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="from-noir via-noir/40 to-noir/70 absolute inset-0 bg-linear-to-t" />
      </section>

      {/* ══ O que está incluso ══ */}
      <section className="bg-noir py-24 md:py-36">
        <div className="container-noir">
          <p className="kicker text-gold mb-6">O que está incluso</p>
          <h2 className="text-display font-display text-bone max-w-3xl">
            <WordReveal text="Tudo, do primeiro clique" />
            <br />
            <span className="text-gilded italic">
              <WordReveal text="à entrega da chave." delay={0.14} />
            </span>
          </h2>

          <Reveal delay={0.2}>
            <p className="text-ash mt-8 max-w-2xl text-lg leading-relaxed">
              Sem taxa de anúncio, sem mensalidade, sem pacote. Comissão só quando o
              contrato é assinado — e ela sai do aluguel, no padrão do mercado.
            </p>
          </Reveal>

          <div className="mt-20 grid gap-x-12 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {DELIVERABLES.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 0.09}>
                <div className="border-noir-4 border-t pt-7">
                  <item.icon className="text-gold-deep mb-5 h-5 w-5" strokeWidth={1.25} />
                  <h3 className="font-display text-bone text-2xl leading-tight">{item.title}</h3>
                  <p className="text-ash mt-3.5 leading-relaxed">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Comparação ══ */}
      <section className="bg-noir-2 py-24 md:py-32">
        <div className="container-noir">
          <p className="kicker text-gold mb-6">A diferença na prática</p>
          <h2 className="font-display text-bone mb-14 max-w-2xl text-[clamp(1.75rem,3.5vw,3rem)]">
            <WordReveal text="Duas maneiras de anunciar o mesmo imóvel." />
          </h2>

          <Hairline className="mb-2" />

          <ul>
            {COMPARISON.map((row, i) => (
              <Reveal key={row.usual} as="li" delay={i * 0.08}>
                <div className="border-noir-4 grid gap-4 border-b py-7 md:grid-cols-2 md:gap-12">
                  <div className="flex items-start gap-4">
                    <span className="text-smoke mt-0.5 shrink-0 font-mono text-[10px] tracking-[0.2em] uppercase">
                      Comum
                    </span>
                    <p className="text-smoke leading-relaxed line-through decoration-1">
                      {row.usual}
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-gold mt-0.5 shrink-0 font-mono text-[10px] tracking-[0.2em] uppercase">
                      Aqui
                    </span>
                    <p className="text-bone leading-relaxed">{row.mine}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ Cadastro ══ */}
      <section id="cadastrar" className="bg-noir scroll-mt-24 py-24 md:py-36">
        <div className="container-noir grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-24">
          <div>
            <p className="kicker text-gold mb-6">Cadastro</p>
            <h2 className="font-display text-bone text-[clamp(2rem,4vw,3.5rem)] leading-[0.95]">
              <WordReveal text="Me conta do" />
              <br />
              <span className="text-gilded italic">
                <WordReveal text="seu imóvel." delay={0.12} />
              </span>
            </h2>
            <Reveal delay={0.2}>
              <p className="text-ash mt-7 max-w-md leading-relaxed">
                Preencha o que souber agora — as medidas eu levanto na visita. Respondo em
                até 24 horas com uma avaliação honesta de valor e prazo, mesmo que a
                resposta seja &ldquo;esse preço está acima do que a região paga hoje&rdquo;.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="text-smoke mt-8 text-sm leading-relaxed">
                {site.reach} {site.creci}.
              </p>
            </Reveal>
          </div>

          <LeadForm variant="anuncio" />
        </div>
      </section>
    </>
  );
}
