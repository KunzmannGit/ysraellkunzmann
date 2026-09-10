import type { ReactNode } from "react";
import { Reveal, WordReveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Cabeçalho das páginas internas.
 * Mais baixo que o herói da home de propósito: aqui a pessoa já
 * entrou, o trabalho é orientar, não impressionar de novo.
 */
export function PageHero({
  kicker,
  title,
  accent,
  lede,
  children,
  media,
  className,
}: {
  kicker: string;
  title: string;
  /** Segunda linha, em itálico dourado */
  accent?: string;
  lede?: string;
  children?: ReactNode;
  /** Opcional: um retrato ou imagem flutuando ao lado do título (ver /sobre). */
  media?: ReactNode;
  className?: string;
}) {
  const texto = (
    <div>
      <p className="kicker text-gold mb-7">{kicker}</p>

      <h1 className="font-display text-bone text-[clamp(2.5rem,6.5vw,6rem)] leading-[0.92]">
        <WordReveal text={title} />
        {accent && (
          <>
            <br />
            <span className="text-gilded italic">
              <WordReveal text={accent} delay={0.14} />
            </span>
          </>
        )}
      </h1>

      {lede && (
        <Reveal delay={0.25}>
          <p className="text-ash mt-8 max-w-2xl text-lg leading-relaxed">{lede}</p>
        </Reveal>
      )}

      {children && <Reveal delay={0.35}>{children}</Reveal>}
    </div>
  );

  return (
    <section className={cn("relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-20", className)}>
      {/* Halo baixo atrás do título */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 h-[26rem] w-[26rem] rounded-full opacity-[0.07] blur-[120px]"
        style={{ background: "radial-gradient(circle, #C9A227 0%, transparent 70%)" }}
      />

      <div className="container-noir relative">
        {media ? (
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
            {texto}
            <Reveal delay={0.2} className="flex justify-center lg:justify-end">
              {media}
            </Reveal>
          </div>
        ) : (
          texto
        )}
      </div>
    </section>
  );
}
