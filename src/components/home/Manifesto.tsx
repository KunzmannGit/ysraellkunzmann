"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Counter, Hairline, Reveal, WordReveal } from "@/components/ui/Reveal";

const NUMBERS = [
  { value: 100, suffix: "%", label: "dos imóveis com tour" },
  { value: 24, suffix: "h", label: "para responder" },
  { value: 6, suffix: "", label: "anos de mercado" },
] as const;

const STEPS = [
  {
    n: "01",
    title: "Eu visito antes de você",
    body: "Vou ao imóvel, fotografo e gravo o walkthrough. Se o lugar tem um defeito que a foto esconde, ele aparece no tour — e eu digo qual é.",
  },
  {
    n: "02",
    title: "Você atravessa da sua casa",
    body: "O tour roda no navegador, sem app e sem cadastro. Você percorre o imóvel inteiro no ritmo do seu dedo, quantas vezes quiser, às três da manhã se for o caso.",
  },
  {
    n: "03",
    title: "A visita presencial é a última",
    body: "Quando você marca de ir, já sabe o que vai encontrar. A visita deixa de ser triagem e vira decisão. Ninguém perde sábado à toa.",
  },
  {
    n: "04",
    title: "Contrato com respaldo de imobiliária",
    body: "Análise de crédito, garantia locatícia e contrato saem pela Platina e Diamante. A tecnologia é minha, a segurança jurídica é deles.",
  },
] as const;

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // A palavra gigante do fundo desliza no contra-fluxo: dá profundidade ao branco.
  const driftX = useTransform(scrollYProgress, [0, 1], ["8%", "-14%"]);

  return (
    <section ref={ref} className="bg-noir relative overflow-hidden py-28 md:py-44">
      {/* Marca d'água tipográfica */}
      <motion.span
        aria-hidden
        style={{ x: driftX }}
        className="font-display text-noir-3 pointer-events-none absolute top-10 left-0 text-[22vw] leading-none whitespace-nowrap italic select-none"
      >
        transparência
      </motion.span>

      <div className="container-noir relative">
        <p className="kicker text-gold mb-10">O método</p>

        <h2 className="text-display font-display text-bone max-w-5xl">
          <WordReveal text="Anúncio bom não é o que" />
          <br />
          <WordReveal text="mostra mais." delay={0.12} />{" "}
          <span className="text-gilded italic">
            <WordReveal text="É o que esconde menos." delay={0.24} />
          </span>
        </h2>

        <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
          <Reveal delay={0.1}>
            <p className="text-mist text-lg leading-relaxed">
              Passei seis anos escrevendo software antes de tirar o CRECI. A primeira
              coisa que me incomodou no mercado foi óbvia: todo anúncio é otimizado para
              a foto, e nenhum é otimizado para a verdade.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-ash text-lg leading-relaxed">
              Então eu inverti. Cada imóvel aqui tem um tour em que você vê o corredor
              estreito, a vista bloqueada e o piso remendado — junto com a luz das seis
              da tarde e o pé-direito de três metros e meio. Quem chega na visita
              presencial já decidiu.
            </p>
          </Reveal>
        </div>

        {/* Números */}
        <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {NUMBERS.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.1}>
              <div className="border-noir-4 border-t pt-6">
                <p className="font-display text-bone text-5xl md:text-6xl">
                  <Counter to={item.value} suffix={item.suffix} />
                </p>
                <p className="text-smoke mt-3 font-mono text-[10px] tracking-[0.2em] uppercase">
                  {item.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Hairline className="mt-28" />

        {/* Passos */}
        <div className="mt-20">
          <p className="kicker text-gold mb-14">Como funciona</p>
          <ol className="grid gap-14 md:grid-cols-2 md:gap-x-20 md:gap-y-20">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} as="li" delay={i * 0.08}>
                <div className="flex gap-6">
                  <span className="font-display text-gold-deep shrink-0 text-3xl leading-none">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-display text-bone text-2xl leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-ash mt-3 leading-relaxed">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
