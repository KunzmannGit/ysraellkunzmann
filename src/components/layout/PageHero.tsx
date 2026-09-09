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
  className,
}: {
  kicker: string;
  title: string;
  /** Segunda linha, em itálico dourado */
  accent?: string;
  lede?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-20", className)}>
      {/* Halo baixo atrás do título */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 h-[26rem] w-[26rem] rounded-full opacity-[0.07] blur-[120px]"
        style={{ background: "radial-gradient(circle, #C9A227 0%, transparent 70%)" }}
      />

      <div className="container-noir relative">
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
    </section>
  );
}
