import Link from "next/link";

import { site } from "@/lib/site";
import { waEng } from "@/lib/engenharia";
import { WhatsAppButton } from "@/components/engenharia/WhatsAppButton";
import { StickyCTA } from "@/components/engenharia/StickyCTA";
import { ScrollProgress } from "@/components/engenharia/ScrollProgress";

/**
 * Moldura própria da página de engenharia de software.
 * Não usa a moldura do corretor (cortina, header, rodapé, cursor)
 * nem a identidade dele: quem chega por aqui procura outro serviço.
 */

const NAV = [
  { href: "#servicos", label: "Serviços" },
  { href: "#projetos", label: "Projetos" },
  { href: "#processo", label: "Como funciona" },
  { href: "#garantias", label: "Garantias" },
  { href: "#perguntas", label: "Dúvidas" },
] as const;

export default function EngenhariaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="eng min-h-screen">
      <ScrollProgress />

      <header className="border-line/70 bg-ink/70 fixed inset-x-0 top-0 z-[80] border-b backdrop-blur-2xl backdrop-saturate-150">
        <div className="container-noir flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
          <Link href="/software" className="flex items-center gap-3">
            <span className="from-volt-deep to-volt grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br font-mono text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgb(59_130_246/0.8)]">
              YK
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-tight text-white">{site.name}</span>
              <span className="hidden font-mono text-[10.5px] tracking-wider whitespace-nowrap text-slate-400 sm:block">
                engenharia de software
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-[13.5px] font-medium text-slate-400 transition-colors hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>

          <WhatsAppButton origem="header" size="sm">
            <span className="hidden sm:inline">Falar no WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </WhatsAppButton>
        </div>
      </header>

      <main id="conteudo" className="relative z-10">
        {children}
      </main>

      <footer className="border-line bg-ink border-t pt-14 pb-32 md:pb-16">
        <div className="container-noir flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-lg font-bold tracking-tight text-white">{site.name}</p>
            <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-400">
              Engenharia de software: back-end, infraestrutura e nuvem. Atendimento remoto para
              todo o Brasil, a partir de {site.city}, {site.state}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400">
            <a href={site.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              GitHub
            </a>
            <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              LinkedIn
            </a>
            <a href={waEng("header")} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              WhatsApp {site.phone}
            </a>
          </div>
        </div>
      </footer>

      <StickyCTA />
    </div>
  );
}
