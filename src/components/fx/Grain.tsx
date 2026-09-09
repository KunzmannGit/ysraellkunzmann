/**
 * Grão de filme.
 * Um único SVG de ruído fractal, repetido e deslocado por keyframes.
 * Custa ~0 (uma camada composta na GPU) e é o que faz o preto
 * parecer película em vez de #000 de navegador.
 */
export function Grain() {
  return (
    <div
      aria-hidden
      className="grain-layer pointer-events-none fixed inset-0 z-[70] opacity-[0.055] mix-blend-overlay"
    >
      <div
        className="animate-grain absolute -inset-[60%] bg-repeat"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

/**
 * Vinheta global fixa: escurece os quatro cantos da janela.
 * Faz o olho ir pro centro sem que ninguém perceba por quê.
 */
export function Vignette() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[69]"
      style={{
        background:
          "radial-gradient(130% 100% at 50% 42%, transparent 46%, rgba(3,2,5,0.42) 82%, rgba(3,2,5,0.78) 100%)",
      }}
    />
  );
}
