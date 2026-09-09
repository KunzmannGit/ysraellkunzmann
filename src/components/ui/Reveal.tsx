"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { Fragment, useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Bloco que sobe e desembaça quando entra na tela. Uma vez só —
 * conteúdo que re-anima ao rolar de volta cansa.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "span";
}) {
  const MotionTag = motion[Tag] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12% 0px -8% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Texto que sobe palavra por palavra de dentro de uma máscara.
 * É o efeito que faz um título parecer "impresso" em vez de "carregado".
 *
 * Cuidado que custou caro: a deteção de entrada em tela fica no
 * elemento EXTERNO, nunca nas palavras. A palavra começa deslocada
 * 108% para baixo, ou seja, fora do pai com `overflow: hidden` — e o
 * IntersectionObserver, que respeita o recorte dos ancestrais, enxerga
 * área zero. Ela esperaria entrar em tela para animar, mas só entraria
 * em tela depois de animar. O título nunca apareceria.
 */
export function WordReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.045,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const words = text.split(" ");

  return (
    <span ref={ref} className={cn("inline", className)}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden align-bottom">
            <motion.span
              className={cn("inline-block", wordClassName)}
              initial={{ y: "108%", opacity: 0 }}
              animate={inView ? { y: "0%", opacity: 1 } : { y: "108%", opacity: 0 }}
              transition={{ duration: 0.95, delay: delay + i * stagger, ease: EASE }}
            >
              {word}
            </motion.span>
          </span>
          {/*
            O espaco fica FORA da mascara, e nao no fim da palavra.
            Dentro de um inline-block com overflow hidden, o espaco
            final e colapsado pelo proprio CSS — e o titulo sai
            "Oqueesta" em vez de "O que esta".
          */}
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}

/** Número que conta até o valor quando entra na tela. */
export function Counter({
  to,
  suffix = "",
  className,
  duration = 1.6,
}: {
  to: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const raw = useMotionValue(0);
  const spring = useSpring(raw, { duration: duration * 1000, bounce: 0 });
  const text = useTransform(spring, (v) => Math.round(v).toLocaleString("pt-BR"));

  useEffect(() => {
    if (inView) raw.set(to);
  }, [inView, raw, to]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      <motion.span>{text}</motion.span>
      {suffix}
    </span>
  );
}

/**
 * Régua fina que se desenha da esquerda para a direita.
 * Uso: separar seções sem usar uma borda dura.
 */
export function Hairline({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      aria-hidden
      className={cn("hairline w-full origin-left", className)}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease: EASE }}
    />
  );
}
