import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Cloud,
  Code2,
  Gauge,
  Globe,
  Lightbulb,
  Server,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { site } from "@/lib/site";
import { Reveal, WordReveal } from "@/components/ui/Reveal";
import { Terminal } from "@/components/engenharia/Terminal";
import { WhatsAppButton } from "@/components/engenharia/WhatsAppButton";

const DESCRICAO =
  "Software sob medida, APIs, sites e infraestrutura em nuvem com foco em Azure. Você fala direto com o engenheiro que constrói, do primeiro esboço ao deploy.";

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
  "Azure",
  "AWS",
  "Node.js",
  "NestJS",
  "TypeScript",
  "Next.js",
  "React",
  "PostgreSQL",
  "Supabase",
  "Terraform",
  "Bicep",
  "Vercel",
] as const;

const DORES = [
  {
    icon: Lightbulb,
    dor: "Tenho uma ideia e não sei por onde começar.",
    resposta: "A gente transforma a ideia em escopo, arquitetura e um plano de entrega por etapas, antes de escrever código.",
  },
  {
    icon: Gauge,
    dor: "Meu sistema está lento ou cai quando o uso aumenta.",
    resposta: "Começo por um diagnóstico do que já existe e ataco o gargalo real: banco, API ou infraestrutura.",
  },
  {
    icon: Globe,
    dor: "Preciso de um site que traga cliente, não só que exista.",
    resposta: "Sites rápidos, com SEO técnico e o contato a um toque de distância, como esta página.",
  },
  {
    icon: Wallet,
    dor: "Minha nuvem está cara ou ninguém sabe como foi montada.",
    resposta: "Infraestrutura organizada como código, com custo visível e ambientes separados de teste e produção.",
  },
] as const;

const SERVICOS = [
  {
    icon: Server,
    title: "Back-end e APIs",
    body: "Regras de negócio, integrações e APIs desenhadas para crescer sem reescrita.",
    itens: ["Modelagem de dados", "Autenticação e permissões", "Integrações com terceiros"],
  },
  {
    icon: Cloud,
    title: "Infraestrutura em nuvem",
    body: "Azure como plataforma principal e AWS quando o projeto já vive lá.",
    itens: ["Infraestrutura como código", "Ambientes de teste e produção", "Segredos e monitoramento"],
  },
  {
    icon: Code2,
    title: "Software sob medida",
    body: "Sistemas internos, painéis e ferramentas que resolvem um processo real da operação.",
    itens: ["Painéis administrativos", "Automação de processos", "Sistemas web completos"],
  },
  {
    icon: Globe,
    title: "Sites e aplicações web",
    body: "Sites institucionais e landing pages rápidas, prontas para receber tráfego pago.",
    itens: ["Velocidade e SEO técnico", "Contato direto por WhatsApp", "Painel para editar conteúdo"],
  },
] as const;

const PROJETOS = [
  {
    tag: "Aplicativo de frete",
    parceiro: "Simple Safety",
    title: "WeTruck",
    body: "Aplicativo que conecta clientes a motoristas de frete, desenvolvido em parceria com a Simple Safety, empresa que presta serviço para a Samarco. Atuei no desenvolvimento.",
    href: "https://www.wetruckhub.com",
    link: "wetruckhub.com",
  },
  {
    tag: "Sistema web",
    parceiro: "Melon AI",
    title: "Melon CRM",
    body: "CRM com back-end e front-end separados e fluxo de release controlado: nada vai para produção sem passar pelo ambiente de testes.",
    href: null,
    link: null,
  },
  {
    tag: "Site e infraestrutura",
    parceiro: "Projeto próprio",
    title: "ysraellkunzmann.com",
    body: "Site imobiliário com tour imersivo, painel administrativo próprio, banco e login no Supabase e publicação na Vercel. Do desenho ao servidor, sem plugin comprado.",
    href: "/",
    link: "ver o site",
  },
] as const;

const PROCESSO = [
  {
    n: "01",
    title: "Conversa no WhatsApp",
    body: "Você conta o problema, o que já existe e onde quer chegar. Sem formulário longo.",
  },
  {
    n: "02",
    title: "Diagnóstico e escopo",
    body: "Eu devolvo um caminho técnico claro, com escopo, prazo e investimento.",
  },
  {
    n: "03",
    title: "Construção por etapas",
    body: "Entregas que você consegue ver e testar ao longo do caminho, não só no final.",
  },
  {
    n: "04",
    title: "Deploy e acompanhamento",
    body: "Sistema no ar, com infraestrutura documentada e suporte combinado.",
  },
] as const;

const PERGUNTAS = [
  {
    q: "Quanto custa um projeto?",
    a: "Depende do escopo. Depois de uma conversa curta, você recebe uma proposta com escopo, prazo e valor antes de qualquer compromisso.",
  },
  {
    q: "Você pega um sistema que já está em andamento?",
    a: "Sim. Começo por um diagnóstico do que existe, para decidir o que manter, o que corrigir e o que reconstruir.",
  },
  {
    q: "Atende empresas fora do Espírito Santo?",
    a: "Sim. O trabalho é remoto, então atendo qualquer cidade. As conversas acontecem por WhatsApp e chamada de vídeo.",
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
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        <div aria-hidden className="eng-grid pointer-events-none absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-[-10%] h-[38rem] w-[38rem] rounded-full opacity-25 blur-[140px]"
          style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/3 left-[-15%] h-[28rem] w-[28rem] rounded-full opacity-15 blur-[140px]"
          style={{ background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)" }}
        />

        <div className="container-noir relative grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div>
            <Reveal>
              <p className="border-volt/30 bg-volt/10 text-volt-lit inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-wider">
                <span className="bg-signal h-1.5 w-1.5 rounded-full" />
                back-end · infraestrutura · Azure
              </p>
            </Reveal>

            <h1 className="mt-7 text-[clamp(2.4rem,5.6vw,4.6rem)]">
              <WordReveal text="Software sob medida que" />{" "}
              <span className="bg-linear-to-r from-[#93c5fd] via-[#3b82f6] to-[#22d3ee] bg-clip-text text-transparent">
                sai do papel e aguenta crescer.
              </span>
            </h1>

            <Reveal delay={0.25}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300">
                Sistemas, APIs, sites e infraestrutura em nuvem. Você fala direto com o engenheiro
                que vai construir, do primeiro esboço ao deploy, sem intermediário.
              </p>
            </Reveal>

            <Reveal delay={0.35}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <WhatsAppButton origem="hero">Pedir orçamento no WhatsApp</WhatsAppButton>
                <a
                  href="#projetos"
                  className="border-line inline-flex h-14 items-center justify-center gap-2 rounded-xl border px-6 font-medium text-slate-200 transition-colors hover:border-slate-500 hover:text-white"
                >
                  Ver projetos
                  <ArrowDown className="h-4 w-4" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.45}>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="text-wa h-4 w-4" /> Fala direta com quem constrói
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="text-wa h-4 w-4" /> Escopo e prazo antes de começar
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="text-wa h-4 w-4" /> Atendimento remoto em todo o Brasil
                </li>
              </ul>
            </Reveal>
          </div>

          {/* Retrato + terminal */}
          <Reveal delay={0.2} className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[24rem] overflow-hidden rounded-[2rem] border border-white/10 bg-linear-to-b from-[#12203d] to-[#070b14]">
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-2/3"
                style={{ background: "radial-gradient(ellipse 70% 60% at 50% 100%, rgb(59 130 246 / 0.45), transparent 70%)" }}
              />
              <Image
                src="/perfil/ysraell-sobre.png"
                alt="Ysraell Kunzmann, engenheiro de software"
                fill
                priority
                sizes="(min-width: 1024px) 384px, 90vw"
                className="object-contain object-bottom"
              />
            </div>

            <Terminal className="relative z-10 mx-auto -mt-20 w-[92%] max-w-[22rem] lg:absolute lg:bottom-6 lg:-left-10 lg:mt-0 lg:w-[20rem]" />
          </Reveal>
        </div>
      </section>

      {/* ══ Stack ══ */}
      <section aria-label="Tecnologias" className="border-line bg-ink-2 border-y py-6">
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-marquee flex w-max gap-12 pr-12">
            {[...STACK, ...STACK].map((tec, i) => (
              <span
                key={`${tec}-${i}`}
                aria-hidden={i >= STACK.length}
                className="font-mono text-sm tracking-wide whitespace-nowrap text-slate-400"
              >
                <span className="text-volt mr-2">/</span>
                {tec}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Dores ══ */}
      <section className="py-24 md:py-32">
        <div className="container-noir">
          <div className="max-w-2xl">
            <p className="text-volt-lit font-mono text-xs tracking-[0.2em] uppercase">Se você se reconhece aqui</p>
            <h2 className="mt-4 text-[clamp(1.9rem,3.6vw,3rem)]">
              <WordReveal text="O problema quase nunca está na tela." />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-5 text-lg leading-relaxed text-slate-400">
                Está no banco sem plano de crescimento, no servidor montado à mão e na chave de API
                colada num arquivo. É aí que eu trabalho.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {DORES.map((item, i) => (
              <Reveal key={item.dor} delay={i * 0.08}>
                <div className="group border-line bg-ink-2 hover:border-volt/50 h-full rounded-2xl border p-7 transition-colors duration-300">
                  <item.icon className="text-volt h-6 w-6" strokeWidth={1.6} />
                  <p className="mt-5 text-xl font-semibold tracking-tight text-white">&ldquo;{item.dor}&rdquo;</p>
                  <p className="mt-3 leading-relaxed text-slate-400">{item.resposta}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-10">
              <WhatsAppButton origem="dores">Quero resolver o meu</WhatsAppButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ Serviços ══ */}
      <section id="servicos" className="bg-ink-2 scroll-mt-20 py-24 md:py-32">
        <div className="container-noir">
          <p className="text-volt-lit font-mono text-xs tracking-[0.2em] uppercase">Serviços</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.9rem,3.6vw,3rem)]">
            <WordReveal text="Do servidor ao site, tudo com o mesmo cuidado." />
          </h2>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICOS.map((servico, i) => (
              <Reveal key={servico.title} delay={i * 0.08}>
                <div className="border-line bg-ink hover:border-volt/50 relative h-full overflow-hidden rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-volt/10 border-volt/25 grid h-11 w-11 place-items-center rounded-xl border">
                    <servico.icon className="text-volt-lit h-5 w-5" strokeWidth={1.7} />
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
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Projetos ══ */}
      <section id="projetos" className="scroll-mt-20 py-24 md:py-32">
        <div className="container-noir">
          <p className="text-volt-lit font-mono text-xs tracking-[0.2em] uppercase">Projetos reais</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.9rem,3.6vw,3rem)]">
            <WordReveal text="Coisas que já saíram do papel." />
          </h2>

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {PROJETOS.map((projeto, i) => (
              <Reveal key={projeto.title} delay={i * 0.1}>
                <article className="border-line from-ink-3 to-ink-2 group relative flex h-full flex-col rounded-2xl border bg-linear-to-b p-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-volt/10 text-volt-lit rounded-full px-3 py-1 font-mono text-[11px]">
                      {projeto.tag}
                    </span>
                    <span className="rounded-full bg-white/5 px-3 py-1 font-mono text-[11px] text-slate-400">
                      {projeto.parceiro}
                    </span>
                  </div>
                  <h3 className="mt-6 text-3xl">{projeto.title}</h3>
                  <p className="mt-4 flex-1 leading-relaxed text-slate-400">{projeto.body}</p>
                  {projeto.href && (
                    <a
                      href={projeto.href}
                      target={projeto.href.startsWith("http") ? "_blank" : undefined}
                      rel={projeto.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-volt-lit mt-6 inline-flex items-center gap-1.5 text-sm font-medium hover:text-white"
                    >
                      {projeto.link}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Processo ══ */}
      <section id="processo" className="bg-ink-2 scroll-mt-20 py-24 md:py-32">
        <div className="container-noir">
          <p className="text-volt-lit font-mono text-xs tracking-[0.2em] uppercase">Como funciona</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.9rem,3.6vw,3rem)]">
            <WordReveal text="Quatro passos, nenhuma surpresa." />
          </h2>

          <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PROCESSO.map((passo, i) => (
              <Reveal key={passo.n} as="li" delay={i * 0.1}>
                <div className="border-line bg-ink relative h-full rounded-2xl border p-7">
                  <span className="from-volt-lit to-signal bg-linear-to-r bg-clip-text font-mono text-4xl font-medium text-transparent">
                    {passo.n}
                  </span>
                  <h3 className="mt-5 text-lg">{passo.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-slate-400">{passo.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
              <WhatsAppButton origem="processo">Começar pelo passo 1</WhatsAppButton>
              <span className="text-sm text-slate-500">Sem custo para a primeira conversa.</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ Perguntas ══ */}
      <section id="perguntas" className="scroll-mt-20 py-24 md:py-32">
        <div className="container-noir grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-volt-lit font-mono text-xs tracking-[0.2em] uppercase">Dúvidas</p>
            <h2 className="mt-4 text-[clamp(1.9rem,3.6vw,3rem)]">
              <WordReveal text="Perguntas que todo mundo faz." />
            </h2>
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
            <div className="border-volt/30 relative overflow-hidden rounded-[2rem] border bg-linear-to-br from-[#0f1d3a] via-[#0a1226] to-[#06101c] px-7 py-16 text-center md:px-16 md:py-20">
              <div aria-hidden className="eng-grid pointer-events-none absolute inset-0 opacity-60" />
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
                style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
              />
              <div className="relative">
                <h2 className="mx-auto max-w-3xl text-[clamp(2rem,4.4vw,3.6rem)]">
                  Tem um sistema para tirar do papel?
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
                  Me conte em uma mensagem. Eu respondo com um caminho técnico claro, mesmo que a
                  melhor resposta seja um escopo menor.
                </p>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <WhatsAppButton origem="final">Chamar no WhatsApp</WhatsAppButton>
                  <a
                    href={site.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-white/15 px-6 font-medium text-slate-200 transition-colors hover:border-white/40 hover:text-white"
                  >
                    Ver LinkedIn
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
