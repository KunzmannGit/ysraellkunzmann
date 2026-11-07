"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Cartão cuja borda e um brilho interno seguem o mouse.
 * Só CSS custom properties: nenhum re-render do React por movimento.
 */
export function SpotlightCard({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  };

  // A tag e dinamica (div | li | article), entao o ref recebe o
  // elemento generico via callback em vez de um RefObject tipado.
  const setRef = (el: HTMLElement | null) => {
    ref.current = el;
  };

  return (
    <Tag
      ref={setRef}
      onPointerMove={onMove}
      className={cn(
        "spot-border group border-line bg-ink-2/80 relative overflow-hidden rounded-3xl border backdrop-blur-sm",
        "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1",
        className,
      )}
    >
      {/* Luz interna que acompanha o cursor */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(59 130 246 / 0.14), transparent 60%)",
        }}
      />
      <div className="relative">{children}</div>
    </Tag>
  );
}
