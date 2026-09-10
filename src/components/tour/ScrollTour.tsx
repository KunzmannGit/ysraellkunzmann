"use client";

import Image from "next/image";
import { AnimatePresence, motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Maximize2 } from "lucide-react";
import { propertyImages, type Media, type Property, type TourChapter } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLenis } from "@/components/fx/SmoothScroll";
import { usePrefersReducedMotion } from "@/lib/hooks";

/* ═══════════════════════════════════════════════════════════
   TOUR IMERSIVO CONDUZIDO PELO SCROLL

   A ideia: a seção tem N telas de altura, mas o palco fica
   grudado (sticky) na viewport. Rolar não desce a página —
   rolar ANDA pela casa. O visitante controla o ritmo com o
   dedo, e é isso que separa isto de "assistir a um vídeo".

   Dois modos, mesma gramática:
   · video  → o walkthrough é rebobinado quadro a quadro
   · frames → as fotos se dissolvem uma na outra
   ═══════════════════════════════════════════════════════════ */

const EASE = [0.16, 1, 0.3, 1] as const;

/** Um quadro do tour. Componente próprio porque cada um precisa dos seus hooks. */
function TourFrame({
  media,
  index,
  total,
  progress,
  priority,
}: {
  media: Media;
  index: number;
  total: number;
  progress: MotionValue<number>;
  priority: boolean;
}) {
  const seg = 1 / total;
  const start = index * seg;
  const fade = seg * 0.55;

  // O quadro 0 é o piso: sempre visível por baixo. Os outros entram por cima.
  const opacity = useTransform(
    progress,
    index === 0 ? [0, 1] : [start - fade, start],
    index === 0 ? [1, 1] : [0, 1],
  );

  // Ken Burns: cada quadro chega grande e assenta. Dá a sensação de avanço.
  const scale = useTransform(progress, [start - fade, start + seg], [1.16, 1.0]);

  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <motion.div className="relative h-full w-full" style={{ scale }}>
        <Image
          src={media.url}
          alt={media.alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  );
}

/** Walkthrough em vídeo rebobinado pelo scroll. */
function ScrubVideo({
  sources,
  poster,
  progress,
}: {
  sources: { src: string; type: string }[];
  poster: string;
  progress: MotionValue<number>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const target = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = progress.on("change", (v) => {
      target.current = v;
    });
    return unsub;
  }, [progress]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const video = videoRef.current;
      if (video && video.readyState >= 2 && video.duration) {
        const want = target.current * video.duration;
        // Interpolação: buscar direto no valor do scroll fica trêmulo.
        // Perseguir o alvo a 18% por quadro dá um movimento de trilho.
        const next = video.currentTime + (want - video.currentTime) * 0.18;
        if (Math.abs(next - video.currentTime) > 0.005) {
          video.currentTime = next;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        poster={poster}
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setReady(true)}
        className="h-full w-full object-cover"
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
      {!ready && (
        <div className="bg-noir absolute inset-0 grid place-items-center">
          <span className="kicker animate-pulse">Carregando o tour…</span>
        </div>
      )}
    </>
  );
}

export function ScrollTour({ property }: { property: Property }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const reduced = usePrefersReducedMotion();

  const tour = property.tour;

  // Os quadros: capa primeiro, depois a galeria — sem repetir a capa
  // quando ela também está na galeria (ver propertyImages).
  const frames = useMemo<Media[]>(
    () => propertyImages({ cover: property.cover, gallery: property.gallery }),
    [property.cover, property.gallery],
  );

  const chapters: TourChapter[] = useMemo(() => {
    if (tour?.chapters?.length) return tour.chapters;
    // Sem capítulos declarados, cada foto vira um: melhor isso que uma barra muda.
    return frames.map((f, i) => ({
      id: `f${i}`,
      label: i === 0 ? "Chegada" : `Ambiente ${i}`,
      at: i,
      note: f.caption,
    }));
  }, [tour, frames]);

  const isVideo = tour?.kind === "video" && (tour.sources?.length ?? 0) > 0;
  const steps = isVideo ? Math.max(4, chapters.length) : frames.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Mola leve: o scroll bruto é nervoso demais para conduzir imagem.
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  const [active, setActive] = useState(0);
  useEffect(() => {
    const unsub = smooth.on("change", (v) => {
      const idx = Math.min(chapters.length - 1, Math.floor(v * chapters.length + 0.0001));
      setActive(Math.max(0, idx));
    });
    return unsub;
  }, [smooth, chapters.length]);

  const barScaleX = useTransform(smooth, [0, 1], [0, 1]);

  /** Clique no capítulo: rola até o ponto exato daquele trecho. */
  const goTo = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const y = el.offsetTop + (index / chapters.length) * total + 8;
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  // Quem pediu menos movimento recebe uma galeria honesta, não um palco travado.
  if (reduced) {
    return (
      <section className="bg-noir py-16">
        <div className="container-noir">
          <p className="kicker text-gold mb-6">Tour do imóvel</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {frames.map((f) => (
              <figure key={f.url} className="relative aspect-4/3 overflow-hidden rounded-sm">
                <Image src={f.url} alt={f.alt} fill sizes="(min-width:640px) 50vw, 100vw" className="object-cover" />
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative bg-black"
      style={{ height: `${steps * 100}vh` }}
      aria-label={`Tour imersivo — ${property.title}`}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* ── O palco ── */}
        <div className="absolute inset-0">
          {isVideo ? (
            <ScrubVideo sources={tour!.sources!} poster={tour!.poster} progress={smooth} />
          ) : (
            frames.map((media, i) => (
              <TourFrame
                key={media.url}
                media={media}
                index={i}
                total={frames.length}
                progress={smooth}
                priority={i === 0}
              />
            ))
          )}
        </div>

        {/* ── Escurecimento ──
            A interface do tour flutua sobre fotos que eu nao controlo:
            podem ser um quarto escuro ou uma cozinha branca estourada.
            Estas tres camadas garantem contraste nos dois extremos. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/90 via-black/45 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-linear-to-b from-black/75 via-black/30 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-2/5 bg-linear-to-r from-black/75 via-black/25 to-transparent" />

        {/* ── Selo superior ── */}
        <div className="absolute top-24 left-0 z-20 w-full md:top-28">
          <div className="container-noir flex items-start justify-between">
            <div>
              <p className="kicker on-photo text-gold flex items-center gap-2">
                <span className="bg-gold relative flex h-1.5 w-1.5 rounded-full">
                  <span className="bg-gold animate-pulse-ring absolute inset-0 rounded-full" />
                </span>
                Tour imersivo
              </p>
              <p className="on-photo font-display text-bone mt-3 text-2xl md:text-4xl">{property.title}</p>
            </div>
            <p className="kicker on-photo hidden text-right md:block">
              Role para
              <br />
              <span className="text-bone">caminhar</span>
            </p>
          </div>
        </div>

        {/* ── Trilha de capítulos (desktop, à esquerda) ── */}
        <nav
          className="absolute top-1/2 left-6 z-20 hidden -translate-y-1/2 flex-col gap-1 lg:flex xl:left-10"
          aria-label="Capítulos do tour"
        >
          {chapters.map((c, i) => {
            const isActive = i === active;
            return (
              <button
                key={c.id}
                onClick={() => goTo(i)}
                className="group flex items-center gap-3 py-2 text-left"
                aria-current={isActive}
              >
                <span
                  className={cn(
                    "h-px transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isActive ? "bg-gold w-10" : "bg-smoke/60 group-hover:bg-mist w-5",
                  )}
                />
                <span
                  className={cn(
                    "on-photo font-mono text-[10px] tracking-[0.22em] uppercase transition-all duration-500",
                    isActive
                      ? "text-gold translate-x-0 opacity-100"
                      : "text-mist/65 group-hover:text-bone -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100",
                  )}
                >
                  {c.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ── Legenda do capítulo atual ── */}
        <div className="absolute right-0 bottom-24 left-0 z-20 md:bottom-28">
          <div className="container-noir flex items-end justify-between gap-8">
            <div className="max-w-md lg:pl-32 xl:pl-40">
              <motion.p
                key={chapters[active]?.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <span className="on-photo font-display text-bone block text-2xl md:text-3xl">
                  {chapters[active]?.label}
                </span>
                {chapters[active]?.note && (
                  <span className="on-photo text-mist/85 mt-2 block text-sm leading-relaxed">
                    {chapters[active].note}
                  </span>
                )}
              </motion.p>
            </div>

            <div className="hidden shrink-0 items-center gap-3 md:flex">
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/50 tabular-nums">
                {String(active + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
              </span>
              <a
                href={`#galeria`}
                className="border-smoke/50 text-mist hover:border-gold hover:text-gold inline-flex h-9 items-center gap-2 rounded-full border px-4 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-500"
              >
                <Maximize2 className="h-3 w-3" strokeWidth={1.5} />
                Ver fotos
              </a>
            </div>

            {/* No computador, "Role para caminhar" fica fixo no topo.
                Não cabe do mesmo jeito no celular — e quem usa celular
                o dia inteiro já sabe rolar a tela, então o aviso só
                precisa aparecer até a pessoa dar o primeiro passo.
                Some sozinho assim que ela sai do primeiro capítulo. */}
            <AnimatePresence>
              {active === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex shrink-0 flex-col items-end gap-1.5 md:hidden"
                >
                  <span className="on-photo kicker text-mist/70">Role para ver mais</span>
                  <motion.span
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ChevronDown className="on-photo h-4 w-4 text-mist/70" strokeWidth={1.5} />
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Barra de progresso ── */}
        <div className="absolute right-0 bottom-0 left-0 z-20 h-px bg-white/10">
          <motion.div
            className="bg-gold h-full origin-left"
            style={{ scaleX: barScaleX }}
          />
        </div>
      </div>
    </section>
  );
}
