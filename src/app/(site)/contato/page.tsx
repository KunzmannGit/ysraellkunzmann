import type { Metadata } from "next";
import { Clock4, Mail, MapPin, MessageCircle } from "lucide-react";

import { site, waLink } from "@/lib/site";
import { PageHero } from "@/components/layout/PageHero";
import { LeadForm } from "@/components/forms/LeadForm";
import { Hairline, Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com ${site.name}, ${site.role.toLowerCase()} em ${site.city}. WhatsApp, e-mail e formulário — resposta no mesmo dia.`,
  alternates: { canonical: "/contato" },
};

const CHANNELS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: site.phone,
    href: waLink(),
    note: "O canal mais rápido. Costumo responder em minutos no horário comercial.",
    external: true,
  },
  {
    icon: Mail,
    label: "E-mail",
    value: site.email,
    href: `mailto:${site.email}`,
    note: "Melhor para documentos, propostas e o que precisa ficar registrado.",
    external: false,
  },
] as const;

export default function ContatoPage() {
  return (
    <>
      <PageHero
        kicker="Contato"
        title="Escolha o canal."
        accent="Eu respondo hoje."
        lede="Sem central de atendimento, sem robô, sem 'em breve um consultor entrará em contato'. Você fala comigo."
      />

      <section className="bg-noir pb-24 md:pb-36">
        <div className="container-noir">
          <Hairline className="mb-16" />

          <div className="grid gap-16 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
            {/* Canais diretos */}
            <div>
              <ul className="space-y-10">
                {CHANNELS.map((channel, i) => (
                  <Reveal key={channel.label} as="li" delay={i * 0.1}>
                    <a
                      href={channel.href}
                      {...(channel.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group block"
                    >
                      <div className="flex items-center gap-3">
                        <channel.icon
                          className="text-gold-deep h-4 w-4 shrink-0"
                          strokeWidth={1.25}
                        />
                        <span className="kicker">{channel.label}</span>
                      </div>
                      <p className="font-display text-bone group-hover:text-gold mt-3 text-2xl transition-colors duration-500 md:text-3xl">
                        {channel.value}
                      </p>
                      <p className="text-smoke mt-2.5 max-w-sm text-sm leading-relaxed">
                        {channel.note}
                      </p>
                      <span className="bg-gold mt-5 block h-px w-full origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                    </a>
                  </Reveal>
                ))}
              </ul>

              <Reveal delay={0.25}>
                <div className="border-noir-4 mt-14 space-y-5 border-t pt-10">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-smoke mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} />
                    <div>
                      <p className="kicker mb-1.5">Área de atuação</p>
                      <p className="text-ash text-sm leading-relaxed">
                        {site.city} e região · {site.state}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock4 className="text-smoke mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} />
                    <div>
                      <p className="kicker mb-1.5">Atendimento</p>
                      <p className="text-ash text-sm leading-relaxed">
                        Segunda a sexta, 9h às 19h. Sábado sob agendamento.
                      </p>
                    </div>
                  </div>
                  <p className="kicker pt-2">{site.creci}</p>
                </div>
              </Reveal>
            </div>

            {/* Formulário */}
            <div>
              <p className="kicker text-gold mb-8">Ou escreva aqui</p>
              <LeadForm variant="contato" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
