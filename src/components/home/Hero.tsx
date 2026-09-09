"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowDown, Play } from "lucide-react";
import type { Property } from "@/lib/types";
import { site } from "@/lib/site";
import { brl, specLine } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A primeira tela.
 *
 * Regra: o imóvel é a única luz. O texto flutua sobre ele, as barras
 * de cinema abrem, e a imagem respira devagar (18s por ciclo) para
 * que a página nunca pareça uma foto parada — mas também nunca
 * chame atenção para a animação em si.
 */
export function Hero({ featured }: { featured: Property }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // A imagem sai mais devagar que o texto: profundidade sem 3D.
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-38%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[38rem] overflow-hidden">
      {/* ── Camada 1: a fotografia ── */}
      <motion.div className="absolute inset-0" style={{ y: imgY, scale: imgScale }}>
        <div className="animate-breathe relative h-full w-full">
          <Image
            src={featured.cover.url}
            alt={featured.cover.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* Escurecimento em três passadas: sem isso o texto não sobrevive à foto */}
        <div className="from-noir via-noir/55 absolute inset-0 bg-linear-to-t to-transparent" />
        <div className="from-noir/92 absolute inset-0 bg-linear-to-r via-transparent to-transparent" />
        <div className="bg-noir/25 absolute inset-0" />
        {/* Sem isto o header desaparece quando a foto tem ceu claro no topo */}
        <div className="from-noir/85 absolute inset-x-0 top-0 h-56 bg-linear-to-b to-transparent" />
      </motion.div>

      {/* ── Camada 2: barras de cinema que abrem no load ── */}
      <motion.div
        aria-hidden
        className="bg-noir absolute inset-x-0 top-0 z-20"
        initial={{ height: "18vh" }}
        animate={{ height: 0 }}
        transition={{ duration: 1.5, delay: 0.15, ease: EASE }}
      />
      <motion.div
        aria-hidden
        className="bg-noir absolute inset-x-0 bottom-0 z-20"
        initial={{ height: "18vh" }}
        animate={{ height: 0 }}
        transition={{ duration: 1.5, delay: 0.15, ease: EASE }}
      />

      {/* ── Camada 3: o texto ── */}
      <motion.div
        className="container-noir relative z-30 flex h-full flex-col justify-end pt-28 pb-16 md:justify-center md:pt-24 md:pb-0"
        style={{ y: textY, opacity: textOpacity }}
      >
        <div className="max-w-[70rem]">
          <motion.div
            className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
          >
            <span className="kicker text-gold">{site.role}</span>
            <span className="bg-smoke/40 h-3 w-px" />
            <span className="kicker">{site.secondRole}</span>
            <span className="bg-smoke/40 hidden h-3 w-px sm:block" />
            <span className="kicker hidden sm:block">{site.creci}</span>
          </motion.div>

          <h1 className="font-display text-hero text-bone">
            {["Imóveis que você", "atravessa antes"].map((line, li) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.3, delay: 0.95 + li * 0.11, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden">
              <motion.span
                className="text-gilded block italic"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.3, delay: 1.17, ease: EASE }}
              >
                de visitar.
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="text-mist/85 mt-8 max-w-lg text-base leading-relaxed md:text-lg"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.35, ease: EASE }}
          >
            Tour imersivo, fotografia de arquitetura e locação sem fricção. Em parceria
            com a imobiliária <span className="text-bone">{site.partner.name}</span>.
          </motion.p>

          <motion.div
            className="mt-11 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5, ease: EASE }}
          >
            <Magnetic>
              <ButtonLink href={`/imoveis/${featured.slug}`} variant="gold" size="lg">
                <Play className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
                Iniciar tour
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="/imoveis" variant="ghost" size="lg" arrow>
                Ver imóveis
              </ButtonLink>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Camada 4: o cartão do imóvel em destaque ── */}
      <motion.div
        className="absolute right-6 bottom-8 z-30 hidden xl:block"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, delay: 1.65, ease: EASE }}
        style={{ opacity: textOpacity }}
      >
        <Link
          href={`/imoveis/${featured.slug}`}
          data-cursor="media"
          data-cursor-label="Ver imóvel"
          className="group border-noir-5/70 bg-noir/55 hover:border-gold/40 block w-72 rounded-sm border p-5 backdrop-blur-xl transition-colors duration-500"
        >
          <div className="flex items-center justify-between">
            <span className="kicker text-gold">Em destaque</span>
            <span className="bg-gold relative flex h-1.5 w-1.5 rounded-full">
              <span className="bg-gold animate-pulse-ring absolute inset-0 rounded-full" />
            </span>
          </div>
          <p className="font-display text-bone mt-4 text-xl leading-tight">{featured.title}</p>
          <p className="text-smoke mt-1.5 text-xs">
            {featured.address.district} · {featured.address.city}
          </p>
          <p className="text-ash mt-4 font-mono text-[10px] tracking-[0.14em] uppercase">
            {specLine([
              featured.bedrooms ? `${featured.bedrooms} dorm` : null,
              featured.parking ? `${featured.parking} vagas` : null,
              featured.area ? `${featured.area} m²` : null,
            ])}
          </p>
          <p className="text-bone mt-3 font-mono text-sm">
            {brl(featured.price)}
            <span className="text-smoke text-[10px]">
              {featured.purpose === "aluguel" ? " /mês" : ""}
            </span>
          </p>
        </Link>
      </motion.div>

      {/* ── Camada 5: convite a rolar ── */}
      <motion.div
        className="text-smoke absolute bottom-8 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        style={{ opacity: textOpacity }}
      >
        <span className="kicker">Role</span>
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" strokeWidth={1} />
        </motion.span>
      </motion.div>
    </section>
  );
}
