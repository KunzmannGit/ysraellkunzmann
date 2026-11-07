import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { site, waLink } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Moldura própria da página de engenharia de software.
 * Não usa a moldura do corretor (cortina, header e rodapé imobiliários):
 * quem chega por aqui procura outro serviço, então vê outra casa.
 */
export default function EngenhariaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-noir-4/80 bg-noir/72 fixed inset-x-0 top-0 z-[80] border-b backdrop-blur-xl backdrop-saturate-150">
        <div className="container-noir flex h-20 items-center justify-between gap-6">
          <Link href="/software" className="flex items-baseline gap-4">
            <span className="font-display text-bone text-xl">YK</span>
            <span className="kicker text-ash hidden sm:inline">Engenharia de software</span>
          </Link>

          <div className="flex items-center gap-3">
            <ButtonLink href={site.social.github} variant="quiet" size="sm" className="hidden md:inline-flex">
              GitHub
            </ButtonLink>
            <ButtonLink href={waLink(`Olá Ysraell, vim pela sua página de engenharia de software e quero falar sobre um projeto.`)} variant="ghost" size="sm">
              WhatsApp
            </ButtonLink>
          </div>
        </div>
      </header>

      <main id="conteudo" className="relative z-10">
        {children}
      </main>

      <footer className="border-noir-4 bg-noir border-t py-12">
        <div className="container-noir flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-bone text-lg">{site.name}</p>
            <p className="text-ash mt-2 text-sm">Engenharia de software · back-end, infraestrutura e nuvem</p>
          </div>

          <div className="text-ash flex items-center gap-6 text-sm">
            <a href={site.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
              GitHub
            </a>
            <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
              LinkedIn
            </a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="hover:text-gold inline-flex items-center gap-2">
              <MessageCircle className="h-4 w-4" strokeWidth={1.4} /> WhatsApp
            </a>
          </div>
        </div>
      </footer>

      {/* Botão fixo: o caminho mais curto para quem chega por anúncio pago. */}
      <a
        href={waLink("Olá Ysraell, vim pela sua página de engenharia de software e quero falar sobre um projeto.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com Ysraell pelo WhatsApp"
        className="bg-gold text-noir hover:bg-gold-lit fixed right-5 bottom-5 z-[90] inline-flex items-center gap-2.5 rounded-full px-5 py-3.5 font-mono text-xs font-medium tracking-[0.18em] uppercase shadow-lg shadow-black/40 transition-colors duration-500 md:right-8 md:bottom-8"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={1.6} />
        WhatsApp
      </a>
    </>
  );
}
