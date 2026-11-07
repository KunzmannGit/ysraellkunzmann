import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { site } from "@/lib/site";
import { waEng } from "@/lib/engenharia";
import { WhatsAppButton } from "@/components/engenharia/WhatsAppButton";

/**
 * Moldura própria da página de engenharia de software.
 * Não usa a moldura do corretor (cortina, header e rodapé imobiliários)
 * nem a identidade dele: quem chega por aqui procura outro serviço.
 */

const NAV = [
  { href: "#servicos", label: "Serviços" },
  { href: "#projetos", label: "Projetos" },
  { href: "#processo", label: "Como funciona" },
  { href: "#perguntas", label: "Dúvidas" },
] as const;

export default function EngenhariaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="eng min-h-screen">
      <header className="border-line/80 bg-ink/75 fixed inset-x-0 top-0 z-[80] border-b backdrop-blur-xl backdrop-saturate-150">
        <div className="container-noir flex h-16 items-center justify-between gap-6 md:h-18">
          <Link href="/software" className="flex items-center gap-3">
            <span className="bg-volt/15 text-volt-lit border-volt/30 grid h-9 w-9 place-items-center rounded-lg border font-mono text-sm font-medium">
              YK
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-white">{site.name}</span>
              <span className="hidden font-mono text-[10.5px] tracking-wider whitespace-nowrap text-slate-400 sm:block">
                engenharia de software
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-slate-400 transition-colors hover:text-white">
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

      {/* pb maior: o botão flutuante não pode cobrir os links do rodapé */}
      <footer className="border-line bg-ink border-t pt-12 pb-28">
        <div className="container-noir flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-white">{site.name}</p>
            <p className="mt-1.5 text-sm text-slate-400">
              Engenharia de software · back-end, infraestrutura e nuvem
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
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

      {/* Botão fixo: o caminho mais curto para quem chega por anúncio pago. */}
      <a
        href={waEng("flutuante")}
        target="_blank"
        rel="noopener noreferrer"
        data-cta="whatsapp-flutuante"
        aria-label="Falar com Ysraell pelo WhatsApp"
        className="bg-wa hover:bg-wa-lit fixed right-4 bottom-4 z-[90] grid h-14 w-14 place-items-center rounded-full text-[#04210f] shadow-[0_12px_40px_-8px_rgb(37_211_102/0.7)] transition-transform duration-300 hover:scale-105 md:right-8 md:bottom-8"
      >
        <span aria-hidden className="bg-wa/60 animate-pulse-ring absolute inset-0 rounded-full" />
        <MessageCircle className="relative h-6 w-6" strokeWidth={2.2} />
      </a>
    </div>
  );
}
