/**
 * Fundo do herói: duas manchas de luz que se movem devagar, como
 * aurora. Puro CSS, compositado na GPU, sem JavaScript.
 */
export function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="animate-aurora absolute -top-1/4 left-1/2 h-[70vh] w-[90vw] -translate-x-1/2 rounded-full opacity-[0.32] blur-[110px]"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, #1d4ed8 0deg, #22d3ee 120deg, #3b82f6 240deg, #1d4ed8 360deg)",
        }}
      />
      <div
        className="animate-aurora absolute top-1/3 -right-1/4 h-[60vh] w-[60vw] rounded-full opacity-20 blur-[120px] [animation-delay:-7s]"
        style={{ background: "radial-gradient(circle, #60a5fa 0%, transparent 70%)" }}
      />
      <div className="eng-grid absolute inset-0 opacity-70" />
    </div>
  );
}
