"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Counter, Hairline, Reveal, WordReveal } from "@/components/ui/Reveal";

/**
 * Três promessas, não três estatísticas.
 *
 * Número de imóveis e metragem envelhecem — daqui a três meses a
 * carteira mudou e o site está mentindo sozinho. Promessa que
 * depende só de mim continua verdadeira em qualquer mês.
 */
const NUMEROS = [
  { value: 24, suffix: "h", label: "para responder" },
  { value: 0, suffix: "", label: "visitas às cegas" },
  { value: 1, suffix: "", label: "interlocutor, do começo ao fim" },
] as const;

const PASSOS = [
  {
    n: "01",
    title: "Eu vou com trena, não com celular",
    body: "Meço pé-direito, vão livre entre pilares, largura do portão e o raio que a carreta precisa para entrar. Fotografo, gravo o walkthrough e anoto a carga elétrica disponível.",
  },
  {
    n: "02",
    title: "Você percorre do seu escritório",
    body: "O tour roda no navegador, sem app e sem cadastro. Você vê o galpão inteiro no ritmo do seu dedo e já sabe se a sua empilhadeira gira ali dentro.",
  },
  {
    n: "03",
    title: "A visita presencial é a última, não a primeira",
    body: "Quando você marca de ir, já sabe o que vai encontrar. A visita deixa de ser triagem e vira decisão — e ninguém atravessa a Grande Vitória para descobrir que o portão é estreito.",
  },
  {
    n: "04",
    title: "Contrato com respaldo de imobiliária",
    body: "Análise de crédito da empresa, garantia locatícia, vistoria com laudo fotografado e contrato registrado saem pela Platina e Diamante. A tecnologia é minha, a segurança jurídica é deles.",
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
        medida
      </motion.span>

      <div className="container-noir relative">
        <p className="kicker text-gold mb-10">O método</p>

        <h2 className="text-display font-display text-bone max-w-5xl">
          <WordReveal text="Ninguém aluga um galpão" />
          <br />
          <WordReveal text="pela foto." delay={0.12} />{" "}
          <span className="text-gilded italic">
            <WordReveal text="Aluga pela medida." delay={0.24} />
          </span>
        </h2>

        <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
          <Reveal delay={0.1}>
            <p className="text-mist text-lg leading-relaxed">
              Quem procura ponto para o próprio negócio não está atrás de uma vista bonita.
              Está atrás de uma resposta: o caminhão entra? A empilhadeira gira? A energia
              aguenta a máquina? O mezanino cabe?
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-ash text-lg leading-relaxed">
              Nenhum anúncio responde isso. Eles mostram cinco fotos de canto e escrevem
              &ldquo;ótima localização&rdquo;. Então o empresário fecha o escritório, atravessa a
              cidade, e descobre em quinze segundos que não serve. Foi essa perda de tempo
              que eu resolvi atacar.
            </p>
          </Reveal>
        </div>

        {/* Números */}
        <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {NUMEROS.map((item, i) => (
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
            {PASSOS.map((step, i) => (
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
