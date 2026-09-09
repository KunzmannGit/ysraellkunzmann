"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { nav, site, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/ui/Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setCondensed(v > 24));

  // Fechar o menu ao navegar é óbvio, mas é o tipo de coisa que
  // todo mundo esquece e o usuário sente.
  //
  // Ajuste durante a renderização em vez de dentro de um efeito: o
  // menu já sai fechado no mesmo quadro da navegação, sem o piscar
  // de um segundo render. É o padrão que o próprio React recomenda
  // para "resetar estado quando uma prop muda".
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[80] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          condensed
            ? "bg-noir/72 border-noir-4/80 border-b backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent",
        )}
      >
        {/*
          Sem isto o header some sobre qualquer foto clara. Um veu preto
          que desce do topo e desaparece — custa nada e resolve em todas
          as paginas de uma vez, em vez de remendar heroi por heroi.
        */}
        <div
          aria-hidden
          className={cn(
            "from-noir/85 pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b to-transparent transition-opacity duration-700",
            condensed ? "opacity-0" : "opacity-100",
          )}
        />
        <div
          className={cn(
            "container-noir relative flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            condensed ? "h-16" : "h-20 md:h-24",
          )}
        >
          {/* Monograma */}
          <Link
            href="/"
            className="group flex items-baseline gap-3"
            aria-label={`${site.name} — início`}
          >
            <span className="font-display text-bone group-hover:text-gold text-xl leading-none tracking-tight transition-colors duration-500 md:text-2xl">
              YK
            </span>
            <span
              className={cn(
                "kicker hidden overflow-hidden whitespace-nowrap transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:inline-block",
                condensed ? "max-w-0 opacity-0" : "max-w-[16rem] opacity-100",
              )}
            >
              {site.role}
            </span>
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative px-4 py-2 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-400",
                    active ? "text-gold" : "text-ash hover:text-bone",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "bg-gold absolute bottom-1 left-4 h-px transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      active ? "w-[calc(100%-2rem)]" : "w-0 group-hover:w-[calc(100%-2rem)]",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Ações */}
          <div className="flex items-center gap-5">
            <span className="kicker hidden xl:block">{site.creci}</span>

            <Magnetic strength={0.3} className="hidden sm:block">
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="border-gold/45 text-gold hover:bg-gold hover:text-noir inline-flex h-10 items-center gap-2 rounded-full border px-5 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-500"
              >
                <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
                WhatsApp
              </a>
            </Magnetic>

            <button
              onClick={() => setOpen((v) => !v)}
              className="text-bone relative z-[91] flex h-10 w-10 items-center justify-center lg:hidden"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
            >
              <span className="relative block h-3 w-6">
                <motion.span
                  className="bg-bone absolute left-0 block h-px w-full"
                  animate={open ? { top: 6, rotate: 45 } : { top: 0, rotate: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                />
                <motion.span
                  className="bg-bone absolute left-0 block h-px w-full"
                  animate={open ? { top: 6, rotate: -45 } : { top: 12, rotate: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile em tela cheia */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="bg-noir fixed inset-0 z-[90] lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="container-noir flex h-full flex-col justify-center pt-24 pb-16">
              <nav className="flex flex-col">
                {nav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24 + i * 0.07, duration: 0.7, ease: EASE }}
                    className="border-noir-4 border-b"
                  >
                    <Link href={item.href} className="group flex items-baseline gap-4 py-5">
                      <span className="kicker text-gold-deep w-8">0{i + 1}</span>
                      <span className="font-display text-bone group-hover:text-gold text-[clamp(2rem,9vw,3.5rem)] leading-none transition-colors duration-400">
                        {item.label}
                      </span>
                      <span className="text-smoke ml-auto hidden text-xs sm:block">{item.note}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="mt-12 flex flex-col gap-3"
              >
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="text-gold font-mono text-sm tracking-[0.14em]">
                  {site.phone}
                </a>
                <a href={`mailto:${site.email}`} className="text-ash font-mono text-sm tracking-[0.14em]">
                  {site.email}
                </a>
                <span className="kicker mt-4">{site.creci}</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
