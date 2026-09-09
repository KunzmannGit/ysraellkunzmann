import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Property } from "@/lib/types";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Hairline, Reveal, WordReveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";

export function Featured({ properties }: { properties: Property[] }) {
  if (properties.length === 0) return null;

  return (
    <section className="bg-noir relative py-24 md:py-36">
      <div className="container-noir">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="kicker text-gold mb-6">Seleção atual</p>
            <h2 className="text-display font-display text-bone max-w-2xl">
              <WordReveal text="Poucos imóveis." />
              <br />
              <span className="text-gilded italic">
                <WordReveal text="Escolhidos a dedo." delay={0.14} />
              </span>
            </h2>
          </div>

          <Reveal delay={0.25}>
            <Link
              href="/imoveis"
              className="group text-ash hover:text-gold flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-500"
            >
              Ver catálogo completo
              <ArrowRight
                className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          </Reveal>
        </div>

        <Hairline className="mt-12 mb-16" />

        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
          {properties.slice(0, 6).map((property, i) => (
            <PropertyCard key={property.id} property={property} index={i} priority={i < 2} />
          ))}
        </div>

        <Reveal delay={0.15} className="mt-20 flex justify-center">
          <ButtonLink href="/imoveis" variant="ghost" size="lg" arrow>
            Todos os imóveis
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
