"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { markSessionFlag, usePrefersReducedMotion, useSessionFlag } from "@/lib/hooks";

const NAME = "YSRAELL KUNZMANN";
const SESSION_KEY = "yk:seen-intro";

/**
 * Abertura de cinema.
 *
 * Tela preta, o nome aparece letra por letra, uma régua de ouro
 * atravessa a tela, e então a sala "abre" em duas metades.
 *
 * Roda uma vez por sessão — na segunda visita o site é direto ao
 * ponto, que é o respeito mínimo com quem voltou.
 *
 * A cortina vem no HTML do servidor, não depois da hidratação: se
 * ela só aparecesse quando o JavaScript acordasse, o visitante veria
 * um lampejo do site antes de a cortina cair, que é o oposto do
 * efeito. Quem já viu a abertura tem a cortina removida no primeiro
 * quadro, e quem está sem JavaScript nunca a vê (ver o <noscript>
 * no layout raiz).
 */
export function Preloader() {
  const reduced = usePrefersReducedMotion();
  const seen = useSessionFlag(SESSION_KEY);
  const skip = reduced || seen;

  const [phase, setPhase] = useState<"running" | "opening" | "done">("running");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (skip) return;

    document.body.style.overflow = "hidden";

    const started = performance.now();
    const MIN_MS = 1900;
    let frame = 0;

    const tick = () => {
      const elapsed = performance.now() - started;
      const timed = Math.min(1, elapsed / MIN_MS);
      // easeOutCubic: o contador desacelera perto de 100, como um projetor
      const eased = 1 - Math.pow(1 - timed, 3);
      setProgress(Math.round(eased * 100));

      if (timed < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }

      setPhase("opening");
      markSessionFlag(SESSION_KEY);
      window.setTimeout(() => {
        setPhase("done");
        document.body.style.overflow = "";
      }, 1150);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
    };
  }, [skip]);

  const opening = phase === "opening";
  const visible = !skip && phase !== "done";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          id="yk-preloader"
          className="fixed inset-0 z-[95]"
          initial={false}
          exit={{ opacity: 0 }}
          aria-hidden
        >
          {/* Metade de cima */}
          <motion.div
            className="bg-noir absolute inset-x-0 top-0 h-1/2 origin-top"
            animate={opening ? { y: "-100%" } : { y: 0 }}
            transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Metade de baixo */}
          <motion.div
            className="bg-noir absolute inset-x-0 bottom-0 h-1/2 origin-bottom"
            animate={opening ? { y: "100%" } : { y: 0 }}
            transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* A régua de ouro fica na linha do corte: é ela que "abre" */}
          <motion.div
            className="absolute top-1/2 right-0 left-0 h-px origin-center"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(201,162,39,0.9) 20%, rgba(246,233,184,1) 50%, rgba(201,162,39,0.9) 80%, transparent)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={
              opening
                ? { scaleX: 1, opacity: 0, transition: { duration: 0.7, ease: "easeIn" } }
                : { scaleX: progress / 100, opacity: 1 }
            }
            transition={{ duration: 0.1, ease: "linear" }}
          />

          {/* Conteúdo central */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            animate={opening ? { opacity: 0, filter: "blur(6px)" } : { opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className="flex flex-wrap justify-center px-6">
              {NAME.split("").map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                  animate={{ opacity: char === " " ? 0 : 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: 0.12 + i * 0.035,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-bone font-display text-[clamp(1.1rem,3.4vw,2.1rem)] tracking-[0.34em]"
                >
                  {char === " " ? "  " : char}
                </motion.span>
              ))}
            </div>

            <div className="kicker flex items-center gap-4">
              <span>{site.role}</span>
              <span className="bg-smoke/50 h-3 w-px" />
              <span className="text-gold tabular-nums">{String(progress).padStart(3, "0")}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
