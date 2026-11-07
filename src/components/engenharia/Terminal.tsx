"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Ilustrativo: o caminho de um projeto, contado como um deploy. */
const LINHAS = [
  { tipo: "cmd", texto: "conversa --whatsapp ysraell" },
  { tipo: "ok", texto: "escopo, prazo e arquitetura definidos" },
  { tipo: "cmd", texto: "build --api --banco --painel" },
  { tipo: "ok", texto: "back-end e testes passando" },
  { tipo: "cmd", texto: "deploy --cloud azure --ambiente producao" },
  { tipo: "ok", texto: "infraestrutura como código aplicada" },
  { tipo: "live", texto: "seu sistema está no ar" },
] as const;

export function Terminal({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div
      ref={ref}
      className={
        "border-line bg-ink-2/90 overflow-hidden rounded-2xl border font-mono text-[12.5px] leading-relaxed shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9)] backdrop-blur-xl " +
        (className ?? "")
      }
    >
      <div className="border-line flex items-center gap-2 border-b px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] tracking-wide text-slate-500">projeto.sh</span>
      </div>

      <div className="space-y-1.5 px-4 py-4">
        {LINHAS.map((linha, i) => (
          <motion.p
            key={linha.texto}
            initial={{ opacity: 0, x: -6 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.42, ease: EASE }}
            className="flex gap-2"
          >
            {linha.tipo === "cmd" && (
              <>
                <span className="text-volt">$</span>
                <span className="text-slate-200">{linha.texto}</span>
              </>
            )}
            {linha.tipo === "ok" && (
              <>
                <span className="text-wa">✓</span>
                <span className="text-slate-400">{linha.texto}</span>
              </>
            )}
            {linha.tipo === "live" && (
              <>
                <span className="text-signal">●</span>
                <span className="text-signal font-medium">{linha.texto}</span>
                <span className="bg-signal animate-blink ml-0.5 inline-block h-4 w-2 translate-y-0.5" />
              </>
            )}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
