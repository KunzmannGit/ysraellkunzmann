import type { Metadata } from "next";
import Image from "next/image";
import { Cloud, Code2, Globe, Server } from "lucide-react";

import { site, waLink } from "@/lib/site";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Hairline, Reveal, WordReveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Engenharia de software",
  description: `${site.name} é engenheiro de software especialista em back-end e infraestrutura, com foco em Microsoft Azure e presença em AWS. Criação de software, APIs, sites e ambientes em nuvem.`,
  alternates: { canonical: "/software" },
  keywords: [
    "engenharia de software",
    "desenvolvedor back-end",
    "infraestrutura em nuvem",
    "Azure",
    "AWS",
    "desenvolvimento de sites",
    "Ysraell Kunzmann",
  ],
  openGraph: {
    title: `Engenharia de software · ${site.name}`,
    description: "Back-end, APIs e infraestrutura em nuvem, com foco em Azure.",
    url: `${site.url}/software`,
  },
  twitter: {
    title: `Engenharia de software · ${site.name}`,
    description: "Back-end, APIs e infraestrutura em nuvem, com foco em Azure.",
  },
};

const SERVICOS = [
  {
    icon: Server,
    title: "Back-end e APIs",
    body: "Serviços, regras de negócio e integrações desenhados para crescer sem reescrita. Modelo de dados, autenticação, filas e contratos de API claros para quem consome.",
  },
  {
    icon: Cloud,
    title: "Infraestrutura em nuvem",
    body: "Ambientes provisionados como código, separados por etapa de desenvolvimento e produção, com segredos gerenciados, monitoramento e custo sob controle desde o primeiro dia.",
  },
  {
    icon: Code2,
    title: "Software sob medida",
    body: "Do levantamento à entrega: sistemas internos, painéis administrativos e ferramentas que resolvem um processo real da sua operação, e não um problema genérico de catálogo.",
  },
  {
    icon: Globe,
    title: "Sites e aplicações web",
    body: "Sites institucionais, landing pages e aplicações web com foco em velocidade, SEO e uma experiência que convence na primeira rolagem. Como este site que você está vendo.",
  },
] as const;

const PROJETOS = [
  {
    tag: "Aplicativo de frete · Simple Safety",
    title: "WeTruck",
    body: "Aplicativo que conecta clientes a motoristas de frete, desenvolvido em parceria com a Simple Safety, empresa que presta serviço para a Samarco. Eu atuei no desenvolvimento.",
  },
  {
    tag: "Sistema web · Melon AI",
    title: "Melon CRM",
    body: "CRM com backend e frontend separados, com fluxo de desenvolvimento e release controlado: nada vai para produção sem passar pelo ambiente de testes.",
  },
  {
    tag: "Site e infraestrutura",
    title: "ysraellkunzmann.com",
    body: "Este site: Next.js com banco, arquivos e login no Supabase, painel administrativo próprio e publicação na Vercel. Construído do desenho ao servidor, sem plugin comprado.",
  },
] as const;

const NUVEM = [
  "Azure como plataforma principal, com a infraestrutura desenhada para o contexto de cada projeto.",
  "AWS também no repertório, para quando o projeto ou a equipe já vive nesse ecossistema.",
  "Infraestrutura como código, para que o ambiente seja reproduzível e revisável como qualquer outro código.",
  "Identidade, segredos e permissões tratados desde o início, e não como remendo antes do lançamento.",
] as const;

export default function SoftwarePage() {
  return (
    <>
      <PageHero
        kicker="Engenharia de software"
        title="Sistemas que"
        accent="aguentam o tranco."
        lede={`${site.name} constrói o que fica por trás da tela: back-end, APIs e infraestrutura. Software que funciona no primeiro dia e continua funcionando quando o uso cresce.`}
        media={
          <div
            /* Mesma proporção e máscara do retrato de /sobre, para as duas
               páginas parecerem da mesma pessoa e do mesmo trabalho. */
            className="relative aspect-[1684/2536] w-[13rem] sm:w-[16rem] lg:w-[22.5rem]"
            style={{
              maskImage: "linear-gradient(to bottom, black 78%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 78%, transparent 100%)",
            }}
          >
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
            <p className="kicker text-gold mb-6">O que costuma dar errado</p>
            <h2 className="font-display text-bone text-[clamp(1.75rem,3.4vw,3rem)] leading-[0.98]">
              <WordReveal text="Software costuma ser" />{" "}
              <span className="text-gilded italic">
                <WordReveal text="construído às pressas." delay={0.14} />
              </span>
            </h2>
          </div>

          <div className="space-y-7">
            <Reveal>
              <p className="text-mist text-lg leading-relaxed">
                O primeiro protótipo funciona na máquina de quem fez. Depois vem o cliente, a
                segunda equipe, o pico de acesso num domingo à noite, e o sistema que parecia
                pronto começa a cair em lugares que ninguém mapeou.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-ash text-lg leading-relaxed">
                Quase sempre o problema não está no código da tela. Está na base de dados sem
                plano de crescimento, no ambiente de produção montado à mão, na chave de API
                colada em um arquivo, e na ausência de qualquer forma de saber o que está
                acontecendo quando algo quebra.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-mist border-gold-deep/50 border-l pl-6 text-lg leading-relaxed italic">
                Eu trato back-end e infraestrutura como parte do produto, e não como algo que se
                resolve depois.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ Serviços ══ */}
      <section className="bg-noir-2 py-24 md:py-32">
        <div className="container-noir">
          <p className="kicker text-gold mb-14">Onde posso ajudar</p>
          <Hairline className="mb-2" />
          <ul>
            {SERVICOS.map((servico, i) => (
              <Reveal key={servico.title} as="li" delay={i * 0.1}>
                <div className="border-noir-4 grid gap-5 border-b py-10 md:grid-cols-[auto_1fr_1.4fr] md:gap-12">
                  <servico.icon className="text-gold-deep h-6 w-6 shrink-0" strokeWidth={1.15} />
                  <h3 className="font-display text-bone text-2xl leading-tight">{servico.title}</h3>
                  <p className="text-ash leading-relaxed">{servico.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ Projetos ══ */}
      <section className="bg-noir py-24 md:py-32">
        <div className="container-noir">
          <p className="kicker text-gold mb-14">Projetos reais</p>
          <Hairline className="mb-2" />
          <ul>
            {PROJETOS.map((projeto, i) => (
              <Reveal key={projeto.title} as="li" delay={i * 0.1}>
                <div className="border-noir-4 grid gap-5 border-b py-10 md:grid-cols-[1fr_1.4fr] md:gap-12">
                  <div>
                    <p className="kicker text-gold-deep mb-3">{projeto.tag}</p>
                    <h3 className="font-display text-bone text-3xl leading-tight">{projeto.title}</h3>
                  </div>
                  <p className="text-ash leading-relaxed">{projeto.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ Nuvem ══ */}
      <section className="bg-noir py-24 md:py-36">
        <div className="container-noir grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <div>
            <p className="kicker text-gold mb-6">Nuvem</p>
            <h2 className="font-display text-bone text-[clamp(1.75rem,3.4vw,3rem)] leading-[0.98]">
              <WordReveal text="Foco em" />{" "}
              <span className="text-gilded italic">
                <WordReveal text="Azure." delay={0.14} />
              </span>
            </h2>
          </div>

          <ul className="space-y-6">
            {NUVEM.map((item, i) => (
              <Reveal key={item} as="li" delay={i * 0.1}>
                <p className="text-mist border-noir-4 border-b pb-6 text-lg leading-relaxed">
                  {item}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="bg-noir-2 py-24 md:py-32">
        <div className="container-noir max-w-3xl">
          <h2 className="font-display text-bone text-[clamp(2rem,4.5vw,4rem)] leading-[0.95]">
            <WordReveal text="Tem um sistema para" />{" "}
            <span className="text-gilded italic">
              <WordReveal text="tirar do papel?" delay={0.12} />
            </span>
          </h2>
          <Reveal delay={0.2}>
            <p className="text-ash mt-7 text-lg leading-relaxed">
              Conte o problema, o que já existe e onde você quer chegar. Eu respondo com um
              caminho técnico claro, mesmo que a melhor resposta seja um escopo menor.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink
                href={waLink("Olá Ysraell, vim pela sua página de engenharia de software e quero falar sobre um projeto.")}
                variant="gold"
                size="lg"
                arrow
              >
                Falar sobre um projeto
              </ButtonLink>
              <ButtonLink href={site.social.github} variant="ghost" size="lg">
                Ver meu GitHub
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
