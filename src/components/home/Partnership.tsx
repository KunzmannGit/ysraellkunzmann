import { ShieldCheck, FileSignature, Landmark } from "lucide-react";
import { site } from "@/lib/site";
import { Hairline, Reveal, WordReveal } from "@/components/ui/Reveal";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Garantia locatícia",
    body: "Seguro-fiança, caução ou fiador — a análise sai pela imobiliária, não por um formulário genérico.",
  },
  {
    icon: FileSignature,
    title: "Contrato e vistoria",
    body: "Documentação, laudo de vistoria com fotos datadas e registro. O que protege proprietário e inquilino no fim do contrato.",
  },
  {
    icon: Landmark,
    title: "Repasse e cobrança",
    body: "Boleto, repasse mensal e cobrança administrativa com estrutura de imobiliária estabelecida.",
  },
] as const;

export function Partnership() {
  return (
    <section className="bg-noir relative overflow-hidden py-28 md:py-40">
      {/* Brilho frio para separar esta faixa das seções vizinhas */}
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute top-1/2 -right-40 h-[30rem] w-[30rem] -translate-y-1/2 rounded-full opacity-[0.06] blur-[130px]"
        style={{ background: "radial-gradient(circle, #C9A227 0%, transparent 70%)" }}
      />

      <div className="container-noir relative">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
          <div>
            <p className="kicker text-gold mb-6">{site.partner.kind}</p>
            <h2 className="font-display text-bone text-[clamp(2.25rem,4.5vw,4rem)] leading-[0.95]">
              <WordReveal text="Platina" />
              <br />
              <span className="text-gilded italic">
                <WordReveal text="e Diamante" delay={0.12} />
              </span>
            </h2>
            <Reveal delay={0.2}>
              <p className="text-mist mt-8 max-w-md text-lg leading-relaxed">
                {site.partner.blurb}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="text-smoke mt-6 max-w-md leading-relaxed">
                Na prática: você fala comigo do começo ao fim, mas assina com uma
                imobiliária por trás. Sem intermediário a mais, sem responsabilidade a
                menos.
              </p>
            </Reveal>
          </div>

          <div>
            <Hairline className="mb-2" />
            <ul>
              {PILLARS.map((pillar, i) => (
                <Reveal key={pillar.title} as="li" delay={i * 0.1}>
                  <div className="border-noir-4 flex gap-6 border-b py-8">
                    <pillar.icon
                      className="text-gold-deep mt-1 h-5 w-5 shrink-0"
                      strokeWidth={1.25}
                    />
                    <div>
                      <h3 className="font-display text-bone text-xl">{pillar.title}</h3>
                      <p className="text-ash mt-2.5 leading-relaxed">{pillar.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
