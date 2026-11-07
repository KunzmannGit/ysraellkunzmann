"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { WhatsAppButton } from "@/components/engenharia/WhatsAppButton";

/**
 * Barra que entra por baixo depois que a pessoa passou do herói.
 * No celular ela É o botão principal: ocupa a largura toda, no
 * alcance do polegar. No desktop fica discreta, à direita.
 */
export function StickyCTA() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setVisible(v > 720));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-[90] px-3 pb-3 md:inset-x-auto md:right-6 md:bottom-6 md:px-0 md:pb-0"
        >
          <div className="border-line/80 bg-ink/85 flex items-center justify-between gap-3 rounded-2xl border p-2 pl-4 shadow-[0_20px_60px_-16px_rgb(0_0_0/0.9)] backdrop-blur-xl md:gap-5">
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold text-white">Primeira conversa sem custo</p>
              <p className="truncate text-xs text-slate-400">Resposta pelo WhatsApp</p>
            </div>
            <WhatsAppButton origem="flutuante" size="sm" className="shrink-0">
              Chamar agora
            </WhatsAppButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
