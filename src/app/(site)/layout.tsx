import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { Vignette } from "@/components/fx/Grain";
import { Preloader } from "@/components/fx/Preloader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/** A moldura do site público: abertura de cinema, header, rodapé, scroll com inércia. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Atalho de teclado: quem navega por Tab merece uma saída rápida */}
      <a
        href="#conteudo"
        className="focus:bg-gold focus:text-noir sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[120] focus:rounded-full focus:px-5 focus:py-2.5 focus:font-mono focus:text-xs focus:tracking-[0.2em] focus:uppercase"
      >
        Pular para o conteúdo
      </a>

      <Preloader />
      <Vignette />

      <SmoothScroll>
        <Header />
        <main id="conteudo" className="relative z-10">
          {children}
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
