"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Media } from "@/lib/types";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Galeria editorial + visor em tela cheia.
 *
 * A grade não é uniforme de propósito: a primeira foto ocupa duas
 * colunas, e a cada cinco imagens o ritmo se repete. Grade regular
 * lê como planilha; grade com ritmo lê como revista.
 */
export function Gallery({ images, title }: { images: Media[]; title: string }) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const isOpen = openAt !== null;

  const close = useCallback(() => setOpenAt(null), []);
  const next = useCallback(
    () => setOpenAt((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  );
  const prev = useCallback(
    () => setOpenAt((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close, next, prev]);

  if (images.length === 0) return null;

  const current = openAt !== null ? images[openAt] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {images.map((image, i) => {
          // Ritmo: a cada 5, uma foto grande abrindo o bloco.
          const wide = i % 5 === 0;
          return (
            <motion.button
              key={image.url}
              onClick={() => setOpenAt(i)}
              data-cursor="media"
              data-cursor-label="Ampliar"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6% 0px" }}
              transition={{ duration: 0.8, delay: (i % 4) * 0.07, ease: EASE }}
              className={cn(
                "group bg-noir-3 relative overflow-hidden rounded-sm",
                wide ? "col-span-2 aspect-16/10" : "aspect-4/5",
              )}
              aria-label={`Ampliar foto ${i + 1} de ${images.length}: ${image.alt}`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes={wide ? "(min-width:768px) 50vw, 92vw" : "(min-width:768px) 25vw, 46vw"}
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
              <span className="bg-noir/0 group-hover:bg-noir/20 absolute inset-0 transition-colors duration-600" />
              <span className="text-mist/70 absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.2em] tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ── Visor ── */}
      <AnimatePresence>
        {isOpen && current && (
          <motion.div
            className="fixed inset-0 z-[110] flex flex-col bg-black/97 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Galeria — ${title}`}
          >
            {/* Barra superior */}
            <div className="flex shrink-0 items-center justify-between px-5 py-5 md:px-10">
              <div>
                <p className="kicker text-gold">{title}</p>
                <p className="text-mist/60 mt-1.5 font-mono text-[10px] tracking-[0.2em] tabular-nums">
                  {String(openAt + 1).padStart(2, "0")} /{" "}
                  {String(images.length).padStart(2, "0")}
                </p>
              </div>
              <button
                onClick={close}
                className="text-mist hover:border-gold hover:text-gold flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors duration-400"
                aria-label="Fechar galeria"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Palco */}
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.url}
                  className="relative h-full w-full"
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.015 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.14}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) next();
                    if (info.offset.x > 80) prev();
                  }}
                >
                  <Image
                    src={current.url}
                    alt={current.alt}
                    fill
                    sizes="100vw"
                    priority
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="text-mist hover:border-gold hover:text-gold absolute left-2 hidden h-12 w-12 items-center justify-center rounded-full border border-white/15 transition-colors duration-400 md:flex"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={1.25} />
                  </button>
                  <button
                    onClick={next}
                    className="text-mist hover:border-gold hover:text-gold absolute right-2 hidden h-12 w-12 items-center justify-center rounded-full border border-white/15 transition-colors duration-400 md:flex"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={1.25} />
                  </button>
                </>
              )}
            </div>

            {/* Legenda + miniaturas */}
            <div className="shrink-0 px-5 pt-4 pb-6 md:px-10">
              <p className="text-mist/80 mb-4 min-h-[1.5rem] max-w-2xl text-sm leading-relaxed">
                {current.caption ?? current.alt}
              </p>
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                {images.map((image, i) => (
                  <button
                    key={image.url}
                    onClick={() => setOpenAt(i)}
                    className={cn(
                      "relative h-14 w-20 shrink-0 overflow-hidden rounded-sm transition-all duration-400",
                      i === openAt ? "opacity-100 ring-1 ring-[#C9A227]" : "opacity-40 hover:opacity-80",
                    )}
                    aria-label={`Ir para foto ${i + 1}`}
                  >
                    <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
