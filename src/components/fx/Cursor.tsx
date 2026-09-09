"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useHasFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

type CursorMode = "default" | "link" | "media" | "text" | "hidden";

interface CursorState {
  mode: CursorMode;
  label: string | null;
}

/**
 * Cursor customizado.
 *
 * Contrato: qualquer elemento pode pedir um cursor diferente com
 *   data-cursor="link" | "media" | "text"
 *   data-cursor-label="VER TOUR"   (só faz sentido com media)
 *
 * O ponto segue o mouse na hora; o anel segue com mola. Essa
 * diferença de velocidade é o que dá a sensação de peso.
 * Só liga em ponteiro fino — em touch não existe cursor.
 */
export function Cursor() {
  // Reativo: trocar de mouse para toque (ou ligar "reduzir movimento")
  // desliga o cursor customizado na hora, sem recarregar a página.
  const fine = useHasFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  const [{ mode, label }, setState] = useState<CursorState>({ mode: "default", label: null });
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const ringX = useSpring(x, { stiffness: 320, damping: 32, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 32, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const host = target?.closest?.("[data-cursor]") as HTMLElement | null;

      if (host) {
        setState({
          mode: (host.dataset.cursor as CursorMode) ?? "link",
          label: host.dataset.cursorLabel ?? null,
        });
        return;
      }

      const interactive = target?.closest?.("a, button, [role='button'], input, textarea, select");
      setState({ mode: interactive ? "link" : "default", label: null });
    };

    const onLeave = () => setState({ mode: "hidden", label: null });
    const onEnter = () => setState({ mode: "default", label: null });
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const isMedia = mode === "media";
  const isText = mode === "text";
  const hidden = mode === "hidden";

  const ringSize = isMedia ? 104 : isText ? 2 : mode === "link" ? 52 : 30;
  const ringHeight = isText ? 30 : ringSize;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      {/* Anel / disco — a parte com peso */}
      <motion.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY }}>
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2"
          animate={{
            width: ringSize,
            height: ringHeight,
            opacity: hidden ? 0 : 1,
            scale: pressed ? 0.86 : 1,
            borderRadius: isText ? 1 : 999,
            backgroundColor: isMedia ? "rgba(201,162,39,0.94)" : "rgba(201,162,39,0)",
            borderColor: isMedia ? "rgba(201,162,39,0)" : "rgba(201,162,39,0.55)",
          }}
          transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.5 }}
          style={{ borderWidth: 1, borderStyle: "solid" }}
        >
          <AnimatePresence>
            {isMedia && label && (
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="font-mono text-noir absolute inset-0 flex items-center justify-center text-center text-[10px] leading-tight font-medium tracking-[0.18em] uppercase"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Ponto — a parte sem inércia, ancora a precisão */}
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <motion.div
          className="bg-gold-lit -translate-x-1/2 -translate-y-1/2 rounded-full"
          animate={{
            width: isMedia || isText ? 0 : 4,
            height: isMedia || isText ? 0 : 4,
            opacity: hidden ? 0 : 1,
          }}
          transition={{ duration: 0.16 }}
        />
      </motion.div>
    </div>
  );
}
