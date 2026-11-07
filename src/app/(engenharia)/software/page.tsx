import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  Cloud,
  Code2,
  FileCheck2,
  Globe,
  KeyRound,
  MessageSquareText,
  Server,
  Sparkles,
  X,
} from "lucide-react";

import { site } from "@/lib/site";
import { Counter, Reveal, WordReveal } from "@/components/ui/Reveal";
import { Aurora } from "@/components/engenharia/Aurora";
import { SpotlightCard } from "@/components/engenharia/SpotlightCard";
import { Terminal } from "@/components/engenharia/Terminal";
import { WhatsAppButton } from "@/components/engenharia/WhatsAppButton";

const DESCRICAO =
  "Software sob medida, APIs, sites e infraestrutura em nuvem com foco em Azure. Diagnóstico gratuito pelo WhatsApp, escopo fechado por escrito e código no seu nome desde o primeiro dia.";

export const metadata: Metadata = {
  title: "Engenharia de software",
  description: `${site.name}: ${DESCRICAO}`,
  alternates: { canonical: "/software" },
  keywords: [
    "engenharia de software",
    "desenvolvedor back-end",
    "software sob medida",
    "infraestrutura em nuvem",
    "Azure",
    "AWS",
    "criação de sites",
    "Ysraell Kunzmann",
  ],
  openGraph: {
    title: `Engenharia de software · ${site.name}`,
    description: DESCRICAO,
    url: `${site.url}/software`,
  },
  twitter: {
    title: `Engenharia de software · ${site.name}`,
    description: DESCRICAO,
  },
};

const STACK = [
  "TypeScript",
  "JavaScript",
  "Node.js",
  "PostgreSQL",
  "Azure",
  "AWS",
  "NestJS",
  "Next.js",
  "React",
  "Supabase",
  "Terraform",
  "Bicep",
] as const;

const NUMEROS = [
  { prefixo: "+", valor: 100, sufixo: "", rotulo: "sites e sistemas entregues", nota: "Com meu sócio no FK Group, de landing page a SaaS em produção." },
  { prefixo: "", valor: 5, sufixo: "", rotulo: "anos construindo software", nota: "TypeScript, Node, Postgres e nuvem, todos os dias." },
  { prefixo: "", valor: 0, sufixo: "", rotulo: "intermediários", nota: "Quem orça é quem constrói e quem responde." },
  { prefixo: "", valor: 100, sufixo: "%", rotulo: "do código no seu nome", nota: "Repositório, nuvem e domínio ficam com você." },
] as const;

/** Sociedade: o que foi construído junto no FK Group. */
const SOCIO = {
  nome: "Matheus França",
  empresa: "FK Group",
  url: "https://www.matheusfranca.com.br/projetos",
} as const;

const CUSTO_INVISIVEL = [
  {
    titulo: "Na agência",
    pontos: [
      "Você fala com o vendedor, não com quem programa",
      "O escopo cresce depois do contrato assinado",
      "O júnior faz, o sênior assina, você paga os dois",
    ],
  },
  {
    titulo: "No freelancer de plataforma",
    pontos: [
      "Orçamento baixo, prazo elástico, sumiço no meio",
      "Código sem documentação que ninguém mais entende",
      "Infraestrutura montada à mão, no cartão dele",
    ],
  },
] as const;

const COMIGO = [
  "Diagnóstico gratuito por WhatsApp antes de qualquer proposta",
  "Escopo, prazo e valor fechados por escrito",
  "Entregas que você vê e testa toda semana",
  "Infraestrutura como código, documentada e no seu nome",
  "A mesma pessoa do primeiro áudio ao último deploy",
] as const;

const SERVICOS = [
  {
    icon: Server,
    title: "Back-end e APIs",
    body: "O motor do seu negócio: regras, integrações e dados desenhados para aguentar o crescimento sem reescrita.",
    itens: ["Modelagem de dados", "Autenticação e permissões", "Integrações com ERPs e pagamentos"],
  },
  {
    icon: Cloud,
    title: "Infraestrutura em nuvem",
    body: "Azure como plataforma principal, AWS quando o projeto já vive lá. Tudo como código, com custo visível.",
    itens: ["Terraform e Bicep", "Ambientes de teste e produção", "Monitoramento e segredos"],
  },
  {
    icon: Code2,
    title: "Software sob medida",
    body: "Sistemas internos, painéis e automações que resolvem um processo real da sua operação.",
    itens: ["Painéis administrativos", "Automação de rotinas", "Sistemas web completos"],
  },
  {
    icon: Globe,
    title: "Sites que vendem",
    body: "Landing pages e sites rápidos, com SEO técnico e o WhatsApp a um toque. Como esta página.",
    itens: ["Velocidade e SEO técnico", "Pronto para tráfego pago", "Painel para editar conteúdo"],
  },
] as const;

const PROJETOS = [
  {
    tag: "SaaS · Destaque",
    title: "Melon AI",
    body: "Plataforma de IA para negócios, com CRM próprio. Back-end e front-end separados e fluxo de release controlado: nada entra em produção sem passar pelo ambiente de testes.",
    papel: "Back-end, infraestrutura e releases",
    href: "https://melonai.com.br",
    link: "melonai.com.br",
    destaque: true,
  },
  {
    tag: "Logística",
    title: "WeTruckHub",
    body: "Hub logístico que conecta clientes a motoristas de frete, em parceria com a Simple Safety, empresa que presta serviço para a Samarco.",
    papel: "Desenvolvimento",
    href: "https://www.wetruckhub.com",
    link: "wetruckhub.com",
    destaque: false,
  },
  {
    tag: "AI · SST",
    title: "Simple Safety AI",
    body: "Inteligência aplicada à saúde e segurança do trabalho: dados de operação virando decisão para indústrias de alto risco.",
    papel: "Engenharia e nuvem",
    href: "https://simplesafety.ai",
    link: "simplesafety.ai",
    destaque: false,
  },
  {
    tag: "Infra",
    title: "Stark Proxy",
    body: "Proxies residenciais com painel de vendas: produto de infraestrutura vendido como serviço.",
    papel: "Back-end e infraestrutura",
    href: "https://starkproxy.com.br",
    link: "starkproxy.com.br",
    destaque: false,
  },
  {
    tag: "Travel",
    title: "Elevare Travel",
    body: "Site de agência de viagens de luxo, pensado para converter quem chega por anúncio.",
    papel: "Desenvolvimento",
    href: "https://elevaretravel.com.br",
    link: "elevaretravel.com.br",
    destaque: false,
  },
  {
    tag: "Real estate",
    title: "Seu Imóvel Ideal",
    body: "Plataforma imobiliária com catálogo, filtros e captação de contatos.",
    papel: "Desenvolvimento",
    href: "https://seuimovelideal.com",
    link: "seuimovelideal.com",
    destaque: false,
  },
  {
    tag: "Landing",
    title: "New Holder",
    body: "Landing page institucional, rápida e direta ao contato.",
    papel: "Desenvolvimento",
    href: "https://lpnewholder.vercel.app",
    link: "ver landing",
    destaque: false,
  },
  {
    tag: "Site e infraestrutura",
    title: "ysraellkunzmann.com",
    body: "Site imobiliário com tour imersivo, painel administrativo, banco e login no Supabase e publicação na Vercel. Do desenho ao servidor.",
    papel: "Tudo, sozinho",
    href: "/",
    link: "ver o site",
    destaque: false,
  },
] as const;

const PROCESSO = [
  {
    n: "01",
    title: "Diagnóstico gratuito",
    body: "Você manda um áudio ou texto no WhatsApp contando o problema. Eu devolvo perguntas certas e uma primeira leitura técnica.",
    entrega: "Clareza sobre o que você precisa de verdade",
  },
  {
    n: "02",
    title: "Proposta por escrito",
    body: "Escopo, etapas, prazo e investimento num documento. Sem surpresa no meio do caminho.",
    entrega: "Documento de escopo e cronograma",
  },
  {
    n: "03",
    title: "Construção às claras",
    body: "Entregas semanais que você acessa e testa. Dúvida é respondida no mesmo dia, pela mesma pessoa.",
    entrega: "Versões para testar toda semana",
  },
  {
    n: "04",
    title: "No ar, no seu nome",
    body: "Deploy em produção, infraestrutura documentada, acessos transferidos e um período de acompanhamento combinado.",
    entrega: "Sistema no ar e documentação",
  },
] as const;

const GARANTIAS = [
  {
    icon: MessageSquareText,
    title: "Diagnóstico sem custo",
    body: "A primeira conversa não tem preço nem compromisso. Se eu não for a pessoa certa, digo isso e aponto o caminho.",
  },
  {
    icon: FileCheck2,
    title: "Escopo fechado por escrito",
    body: "O que foi combinado é o que é entregue. Mudança de escopo vira nova proposta, nunca cobrança surpresa.",
  },
  {
    icon: KeyRound,
    title: "Tudo no seu nome",
    body: "Repositório, nuvem, domínio e acessos ficam na sua conta desde o primeiro dia. Você nunca fica refém.",
  },
  {
    icon: BadgeCheck,
    title: "Documentado para durar",
    body: "Infraestrutura como código e documentação suficiente para qualquer engenheiro continuar o trabalho.",
  },
] as const;

const PERGUNTAS = [
  {
    q: "Quanto custa?",
    a: "Depende do escopo. Depois do diagnóstico gratuito, você recebe uma proposta com escopo, prazo e valor por escrito, antes de qualquer compromisso. Projetos grandes são divididos em etapas com entregas e pagamentos separados.",
  },
  {
    q: "Meu sistema já existe e está um caos. Você pega?",
    a: "Sim. Começo por um diagnóstico do que existe, para decidir o que manter, o que corrigir e o que reconstruir. Muitas vezes a resposta é menor e mais barata do que recomeçar.",
  },
  {
    q: "Em quanto tempo fica pronto?",
    a: "Uma landing page leva dias. Um sistema completo, semanas a meses, em etapas. O prazo vai na proposta, e você acompanha o andamento toda semana.",
  },
  {
    q: "Atende empresas fora do Espírito Santo?",
    a: "Sim. O trabalho é remoto e atendo qualquer cidade do Brasil. As conversas acontecem por WhatsApp e chamada de vídeo.",
  },
  {
    q: "Por que Azure?",
    a: "É a plataforma em que tenho mais profundidade. Se a sua empresa já está na AWS, eu trabalho nela também.",
  },
] as const;

export default function SoftwarePage() {
  return (
    <>
      {/* ══ Hero ══ */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28">
        <Aurora />

        <div className="container-noir relative grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pr-4 pl-1.5 text-[12.5px] text-slate-300 backdrop-blur">
                <span className="bg-wa/15 text-wa inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10.5px] font-semibold tracking-wide uppercase">
                  <span className="bg-wa h-1.5 w-1.5 animate-pulse rounded-full" />
                  disponível
                </span>
                Diagnóstico gratuito pelo WhatsApp
              </p>
            </Reveal>

            <h1 className="mt-8 text-[clamp(2.6rem,6vw,5.4rem)]">
              <WordReveal text="Pare de pagar por software que" />{" "}
              <em className="text-volt-gradient">
                <WordReveal text="não entrega." delay={0.3} />
              </em>
            </h1>

            <Reveal delay={0.35}>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-300 md:text-xl">
                Back-end, APIs, sites e nuvem construídos por <strong className="font-semibold text-white">um engenheiro que responde no seu WhatsApp</strong>, não por uma fila de tickets. Escopo fechado por escrito, entregas toda semana, tudo no seu nome.
              </p>
            </Reveal>

            <Reveal delay={0.45}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <WhatsAppButton origem="hero">Quero meu diagnóstico gratuito</WhatsAppButton>
                <a
                  href="#projetos"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-6 font-semibold text-slate-200 transition-colors hover:border-white/30 hover:text-white"
                >
                  Ver o que já construí
                  <ArrowDown className="h-4 w-4" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.55}>
              <p className="mt-7 text-sm text-slate-500">
                Sem formulário. Sem compromisso. Você manda um áudio, eu respondo.
              </p>
            </Reveal>
          </div>

          {/* Retrato + terminal. O terminal fica ABAIXO do retrato e só
              encosta na borda inferior do cartão: o rosto nunca é coberto. */}
          <Reveal delay={0.25} className="relative mx-auto w-full max-w-[24rem] lg:max-w-[26rem]">
            <div className="relative mx-auto w-full max-w-[22rem] lg:ml-auto lg:mr-0">
              {/* Luz difusa atrás do retrato */}
              <div
                aria-hidden
                className="absolute -inset-10 rounded-full opacity-60 blur-[70px]"
                style={{ background: "radial-gradient(circle, rgb(59 130 246 / 0.55), transparent 65%)" }}
              />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-linear-to-b from-[#10203f] to-[#070b14] shadow-[0_40px_100px_-30px_rgb(59_130_246/0.45)]">
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-2/3"
                  style={{ background: "radial-gradient(ellipse 70% 60% at 50% 100%, rgb(59 130 246 / 0.5), transparent 70%)" }}
                />
                <Image
                  src="/perfil/ysraell-sobre.png"
                  alt="Ysraell Kunzmann, engenheiro de software"
                  fill
                  priority
                  sizes="(min-width: 1024px) 384px, 90vw"
                  className="object-contain object-bottom"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-slate-200 backdrop-blur">
                  <Sparkles className="text-signal h-3.5 w-3.5" />
                  {site.name}
                </div>
              </div>
            </div>

            <Terminal className="relative z-10 mx-auto -mt-8 w-[94%] max-w-[22rem] lg:mr-6 lg:ml-0 lg:w-[21rem]" />
          </Reveal>
        </div>
      </section>

      {/* ══ Números ══ */}
      <section className="border-line bg-ink-2 border-y">
        <div className="container-noir grid divide-y divide-white/5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {NUMEROS.map((n, i) => (
            <Reveal key={n.rotulo} delay={i * 0.08} className="px-2 py-8 sm:px-6 lg:py-10">
              <p className="text-volt-gradient text-5xl font-extrabold tracking-tighter tabular-nums">
                {n.prefixo}
                <Counter to={n.valor} suffix={n.sufixo} />
              </p>
              <p className="mt-2 font-semibold text-white">{n.rotulo}</p>
              <p className="mt-1 text-sm text-slate-400">{n.nota}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ Stack ══ */}
      <section aria-label="Tecnologias" className="py-6">
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-marquee flex w-max gap-12 pr-12">
            {[...STACK, ...STACK].map((tec, i) => (
              <span
                key={`${tec}-${i}`}
                aria-hidden={i >= STACK.length}
                className="font-mono text-sm tracking-wide whitespace-nowrap text-slate-500"
              >
                <span className="text-volt mr-2">/</span>
                {tec}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ O custo invisível ══ */}
      <section className="py-24 md:py-32">
        <div className="container-noir">
          <div className="max-w-3xl">
            <p className="text-volt-lit font-mono text-xs tracking-[0.22em] uppercase">O custo invisível</p>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.4rem)]">
              <WordReveal text="Software barato é o mais" />{" "}
              <em className="text-volt-gradient">
                <WordReveal text="caro" delay={0.2} />
              </em>{" "}
              <WordReveal text="que existe." delay={0.25} />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                Você não paga só o orçamento. Paga o retrabalho, o mês parado, o cliente que foi
                embora enquanto o sistema estava fora do ar e o engenheiro que precisou refazer tudo
                depois. Veja onde esse custo costuma se esconder.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-[1fr_1fr_1.25fr]">
            {CUSTO_INVISIVEL.map((coluna, i) => (
              <Reveal key={coluna.titulo} delay={i * 0.08}>
                <div className="border-line h-full rounded-3xl border border-dashed p-8">
                  <p className="font-semibold text-slate-300">{coluna.titulo}</p>
                  <ul className="mt-6 space-y-4">
                    {coluna.pontos.map((p) => (
                      <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-slate-400">
                        <X className="mt-1 h-4 w-4 shrink-0 text-red-400/80" strokeWidth={2.2} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <SpotlightCard className="h-full border-volt/40 bg-linear-to-b from-[#0d1a33] to-[#0a0e17] p-8">
                <p className="flex items-center gap-2 font-semibold text-white">
                  <span className="bg-wa h-2 w-2 rounded-full" />
                  Comigo
                </p>
                <ul className="mt-6 space-y-4">
                  {COMIGO.map((p) => (
                    <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-slate-200">
                      <BadgeCheck className="text-wa mt-0.5 h-5 w-5 shrink-0" strokeWidth={2} />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <WhatsAppButton origem="dores" size="sm">
                    Quero trabalhar assim
                  </WhatsAppButton>
                </div>
              </SpotlightCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ Manifesto ══ */}
      <section className="border-line bg-ink-2 border-y py-20 md:py-28">
        <div className="container-noir max-w-4xl text-center">
          <Reveal>
            <p className="text-[clamp(1.6rem,3.2vw,2.6rem)] leading-snug font-semibold tracking-tight text-white">
              &ldquo;O problema quase nunca está na tela. Está no banco sem plano de crescimento, no
              servidor montado à mão e na chave de API colada num arquivo.{" "}
              <em className="text-volt-gradient font-normal">É aí que eu trabalho.</em>&rdquo;
            </p>
            <p className="mt-8 font-mono text-sm text-slate-500">
              {site.name} · engenheiro de software
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ Serviços ══ */}
      <section id="servicos" className="scroll-mt-20 py-24 md:py-32">
        <div className="container-noir">
          <p className="text-volt-lit font-mono text-xs tracking-[0.22em] uppercase">Serviços</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(2rem,4vw,3.4rem)]">
            <WordReveal text="Do servidor ao site," />{" "}
            <em className="text-volt-gradient">
              <WordReveal text="um só" delay={0.2} />
            </em>{" "}
            <WordReveal text="responsável." delay={0.25} />
          </h2>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICOS.map((servico, i) => (
              <Reveal key={servico.title} delay={i * 0.08} className="h-full">
                <SpotlightCard className="h-full p-7">
                  <div className="from-volt-deep/40 to-volt/10 border-volt/25 grid h-11 w-11 place-items-center rounded-xl border bg-linear-to-br">
                    <servico.icon className="text-volt-lit h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-6 text-xl">{servico.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-400">{servico.body}</p>
                  <ul className="mt-5 space-y-2 text-sm text-slate-300">
                    {servico.itens.map((it) => (
                      <li key={it} className="flex gap-2">
                        <span className="text-signal">→</span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Projetos ══ */}
      <section id="projetos" className="bg-ink-2 scroll-mt-20 py-24 md:py-32">
        <div className="container-noir">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-volt-lit font-mono text-xs tracking-[0.22em] uppercase">Prova, não promessa</p>
              <h2 className="mt-4 max-w-2xl text-[clamp(2rem,4vw,3.4rem)]">
                <WordReveal text="Coisas que já" />{" "}
                <em className="text-volt-gradient">
                  <WordReveal text="saíram do papel." delay={0.2} />
                </em>
              </h2>
            </div>
            <Reveal delay={0.2}>
              <a
                href={site.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white"
              >
                Código aberto no GitHub <ArrowUpRight className="h-4 w-4" />
              </a>
            </Reveal>
          </div>

          {/* 3 colunas: o destaque ocupa 2 e os 7 restantes fecham as linhas sem sobra */}
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PROJETOS.map((projeto, i) => (
              <Reveal
                key={projeto.title}
                delay={i * 0.06}
                className={projeto.destaque ? "h-full md:col-span-2" : "h-full"}
              >
                <SpotlightCard
                  as="article"
                  className={
                    projeto.destaque
                      ? "border-volt/40 flex h-full flex-col bg-linear-to-br from-[#0d1a33] to-[#0a0e17] p-8"
                      : "flex h-full flex-col p-7"
                  }
                >
                  <span className="bg-volt/10 text-volt-lit self-start rounded-full px-3 py-1 font-mono text-[11px]">
                    {projeto.tag}
                  </span>
                  <h3 className={projeto.destaque ? "mt-7 text-4xl" : "mt-6 text-2xl"}>{projeto.title}</h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-slate-400">{projeto.body}</p>
                  <div className="border-line mt-7 flex flex-col gap-2 border-t pt-5 text-sm">
                    <span className="text-slate-500">
                      Meu papel: <span className="text-slate-200">{projeto.papel}</span>
                    </span>
                    {projeto.href && (
                      <a
                        href={projeto.href}
                        target={projeto.href.startsWith("http") ? "_blank" : undefined}
                        rel={projeto.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-volt-lit inline-flex items-center gap-1 font-medium hover:text-white"
                      >
                        {projeto.link}
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>

          {/* Sociedade */}
          <Reveal delay={0.15}>
            <div className="border-line mt-6 flex flex-col gap-6 rounded-3xl border bg-white/[0.02] p-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-volt-lit font-mono text-xs tracking-[0.22em] uppercase">{SOCIO.empresa}</p>
                <p className="mt-3 text-xl font-semibold tracking-tight text-white">
                  Esses são alguns dos mais de 100 projetos que construí com meu sócio,{" "}
                  {SOCIO.nome}.
                </p>
                <p className="mt-2 text-slate-400">
                  Ele cuida do design e do front-end; eu, do back-end, da infraestrutura e da nuvem.
                  Juntos, cobrimos o projeto inteiro, do desenho ao deploy.
                </p>
              </div>
              <a
                href={SOCIO.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/12 px-5 font-semibold text-slate-200 transition-colors hover:border-white/30 hover:text-white"
              >
                Ver os +100 projetos
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ Processo ══ */}
      <section id="processo" className="scroll-mt-20 py-24 md:py-32">
        <div className="container-noir">
          <p className="text-volt-lit font-mono text-xs tracking-[0.22em] uppercase">Como funciona</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(2rem,4vw,3.4rem)]">
            <WordReveal text="Quatro passos," />{" "}
            <em className="text-volt-gradient">
              <WordReveal text="zero" delay={0.2} />
            </em>{" "}
            <WordReveal text="surpresa." delay={0.25} />
          </h2>

          <ol className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Linha que liga os passos no desktop */}
            <div aria-hidden className="from-volt/0 via-volt/50 to-volt/0 absolute top-7 right-8 left-8 hidden h-px bg-linear-to-r lg:block" />
            {PROCESSO.map((passo, i) => (
              <Reveal key={passo.n} as="li" delay={i * 0.1} className="relative">
                <div className="from-volt-deep to-volt relative z-10 grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br font-mono text-lg font-bold text-white shadow-[0_12px_32px_-10px_rgb(59_130_246/0.8)]">
                  {passo.n}
                </div>
                <h3 className="mt-6 text-xl">{passo.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-400">{passo.body}</p>
                <p className="border-volt/40 mt-5 border-l-2 pl-3 text-sm text-slate-300">
                  <span className="text-slate-500">Você recebe:</span> {passo.entrega}
                </p>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.2}>
            <div className="mt-14 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
              <WhatsAppButton origem="processo">Começar pelo passo 1, grátis</WhatsAppButton>
              <span className="text-sm text-slate-500">Leva uma mensagem. Eu respondo.</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ Garantias ══ */}
      <section id="garantias" className="bg-ink-2 scroll-mt-20 py-24 md:py-32">
        <div className="container-noir">
          <div className="max-w-2xl">
            <p className="text-volt-lit font-mono text-xs tracking-[0.22em] uppercase">Garantias</p>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.4rem)]">
              <WordReveal text="O risco fica" />{" "}
              <em className="text-volt-gradient">
                <WordReveal text="comigo," delay={0.2} />
              </em>{" "}
              <WordReveal text="não com você." delay={0.25} />
            </h2>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {GARANTIAS.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.08} className="h-full">
                <SpotlightCard className="h-full p-8">
                  <div className="flex items-start gap-5">
                    <div className="bg-wa/10 border-wa/25 grid h-12 w-12 shrink-0 place-items-center rounded-xl border">
                      <g.icon className="text-wa h-5 w-5" strokeWidth={1.9} />
                    </div>
                    <div>
                      <h3 className="text-xl">{g.title}</h3>
                      <p className="mt-2.5 leading-relaxed text-slate-400">{g.body}</p>
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Perguntas ══ */}
      <section id="perguntas" className="scroll-mt-20 py-24 md:py-32">
        <div className="container-noir grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-volt-lit font-mono text-xs tracking-[0.22em] uppercase">Dúvidas</p>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.4rem)]">
              <WordReveal text="O que todo mundo" />{" "}
              <em className="text-volt-gradient">
                <WordReveal text="pergunta" delay={0.2} />
              </em>{" "}
              <WordReveal text="antes de chamar." delay={0.25} />
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-6 text-slate-400">
                Ficou alguma fora da lista? Manda no WhatsApp. Responder dúvida também é parte do
                diagnóstico gratuito.
              </p>
            </Reveal>
          </div>

          <dl className="divide-line divide-y">
            {PERGUNTAS.map((item, i) => (
              <Reveal key={item.q} delay={i * 0.06}>
                <div className="py-7 first:pt-0">
                  <dt className="text-lg font-semibold text-white">{item.q}</dt>
                  <dd className="mt-2.5 leading-relaxed text-slate-400">{item.a}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ══ CTA final ══ */}
      <section className="pb-28 md:pb-36">
        <div className="container-noir">
          <Reveal>
            <div className="border-volt/30 relative overflow-hidden rounded-[2.5rem] border bg-linear-to-br from-[#0f1d3a] via-[#0a1226] to-[#06101c] px-7 py-20 text-center md:px-16 md:py-28">
              <div aria-hidden className="eng-grid pointer-events-none absolute inset-0 opacity-60" />
              <div
                aria-hidden
                className="animate-aurora pointer-events-none absolute -top-32 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
                style={{ background: "radial-gradient(circle, #3b82f6 0%, #22d3ee 40%, transparent 70%)" }}
              />
              <div className="relative">
                <p className="text-volt-lit font-mono text-xs tracking-[0.22em] uppercase">Próximo passo</p>
                <h2 className="mx-auto mt-5 max-w-3xl text-[clamp(2.2rem,5vw,4.2rem)]">
                  Você já sabe o que precisa.{" "}
                  <em className="text-volt-gradient">Falta só mandar a mensagem.</em>
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
                  Atendo poucos projetos ao mesmo tempo, para dar a cada um a atenção de quem vai
                  assinar o resultado. Conte o seu problema e receba um diagnóstico gratuito.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <WhatsAppButton origem="final">Quero meu diagnóstico gratuito</WhatsAppButton>
                  <a
                    href={site.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-white/15 px-6 font-semibold text-slate-200 transition-colors hover:border-white/40 hover:text-white"
                  >
                    Ver LinkedIn
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
                <p className="mt-7 text-sm text-slate-500">
                  {site.phone} · atendimento remoto para todo o Brasil
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
