"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const LenisContext = createContext<Lenis | null>(null);

/** Use para `lenis.scrollTo(...)` de qualquer lugar (âncoras, botão de topo). */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Scroll com inércia. É metade da sensação de "site caro":
 * a página não para no dedo, ela desacelera.
 * Respeita prefers-reduced-motion — quem pediu menos movimento
 * recebe o scroll nativo do sistema.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const instance = new Lenis({
      duration: 1.15,
      // curva exponencial: rápido no início, longa cauda de desaceleração
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      // no touch o scroll nativo já é bom — forçar Lenis piora
      syncTouch: false,
    });

    const raf = (time: number) => {
      instance.raf(time);
      rafId.current = requestAnimationFrame(raf);
    };
    rafId.current = requestAnimationFrame(raf);
    setLenis(instance);

    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
