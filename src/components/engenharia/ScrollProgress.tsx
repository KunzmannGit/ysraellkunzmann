"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Linha fina no topo que cresce com a rolagem. Sinal de "quanto falta". */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="from-volt via-signal to-volt-lit fixed inset-x-0 top-0 z-[95] h-[2px] origin-left bg-linear-to-r"
    />
  );
}
