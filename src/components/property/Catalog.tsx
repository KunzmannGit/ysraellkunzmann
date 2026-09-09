"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Kind, Property, Purpose } from "@/lib/types";
import { KIND_LABEL, KINDS } from "@/lib/types";
import { filterProperties } from "@/lib/filters";
import { cn } from "@/lib/utils";
import { PropertyCard } from "@/components/property/PropertyCard";
import { ButtonLink } from "@/components/ui/Button";
import { waLink } from "@/lib/site";

const PURPOSES: { value: Purpose | "todos"; label: string }[] = [
  { value: "todos", label: "Tudo" },
  { value: "aluguel", label: "Alugar" },
  { value: "venda", label: "Comprar" },
];

const BEDROOMS = [
  { value: 0, label: "Qualquer" },
  { value: 1, label: "1+" },
  { value: 2, label: "2+" },
  { value: 3, label: "3+" },
  { value: 4, label: "4+" },
];

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 font-mono text-[10px] tracking-[0.16em] uppercase",
        "transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
        active
          ? "border-gold bg-gold text-noir font-medium"
          : "border-noir-5 text-ash hover:border-smoke hover:text-bone",
      )}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

export function Catalog({ properties }: { properties: Property[] }) {
  const [purpose, setPurpose] = useState<Purpose | "todos">("todos");
  const [kind, setKind] = useState<Kind | "todos">("todos");
  const [bedroomsMin, setBedroomsMin] = useState(0);
  const [onlyTour, setOnlyTour] = useState(false);
  const [q, setQ] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const results = useMemo(
    () =>
      filterProperties(properties, {
        purpose,
        kind,
        bedroomsMin: bedroomsMin || undefined,
        onlyTour,
        q,
      }),
    [properties, purpose, kind, bedroomsMin, onlyTour, q],
  );

  // Só oferece os tipos que realmente existem na carteira — filtro vazio irrita.
  const availableKinds = useMemo(
    () => KINDS.filter((k) => properties.some((p) => p.kind === k)),
    [properties],
  );

  const dirty = purpose !== "todos" || kind !== "todos" || bedroomsMin > 0 || onlyTour || q !== "";

  const reset = () => {
    setPurpose("todos");
    setKind("todos");
    setBedroomsMin(0);
    setOnlyTour(false);
    setQ("");
  };

  return (
    <>
      {/* ── Barra de filtros ── */}
      <div className="border-noir-4 bg-noir/85 sticky top-16 z-40 border-y backdrop-blur-xl">
        <div className="container-noir py-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
            <div className="flex gap-2">
              {PURPOSES.map((p) => (
                <Pill key={p.value} active={purpose === p.value} onClick={() => setPurpose(p.value)}>
                  {p.label}
                </Pill>
              ))}
            </div>

            <span className="bg-noir-5 mx-1 hidden h-5 w-px sm:block" />

            <Pill active={onlyTour} onClick={() => setOnlyTour((v) => !v)}>
              Com tour
            </Pill>

            <button
              onClick={() => setShowAdvanced((v) => !v)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors duration-400",
                showAdvanced
                  ? "border-smoke text-bone"
                  : "border-noir-5 text-ash hover:border-smoke hover:text-bone",
              )}
              aria-expanded={showAdvanced}
            >
              <SlidersHorizontal className="h-3 w-3" strokeWidth={1.5} />
              Mais filtros
            </button>

            {/* Busca */}
            <div className="relative ml-auto w-full sm:w-64">
              <Search
                className="text-smoke pointer-events-none absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2"
                strokeWidth={1.5}
              />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Bairro, característica…"
                data-cursor="text"
                className="border-noir-5 text-bone placeholder:text-smoke focus:border-gold/60 w-full rounded-full border bg-transparent py-2 pr-4 pl-10 text-xs outline-none transition-colors duration-400"
              />
            </div>
          </div>

          {/* Filtros avançados */}
          <AnimatePresence initial={false}>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="border-noir-4 mt-4 flex flex-wrap items-center gap-x-8 gap-y-4 border-t pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="kicker mr-1">Dormitórios</span>
                    {BEDROOMS.map((b) => (
                      <Pill
                        key={b.value}
                        active={bedroomsMin === b.value}
                        onClick={() => setBedroomsMin(b.value)}
                      >
                        {b.label}
                      </Pill>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="kicker mr-1">Tipo</span>
                    <Pill active={kind === "todos"} onClick={() => setKind("todos")}>
                      Todos
                    </Pill>
                    {availableKinds.map((k) => (
                      <Pill key={k} active={kind === k} onClick={() => setKind(k)}>
                        {KIND_LABEL[k]}
                      </Pill>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Resultados ── */}
      <div className="container-noir py-12 md:py-16">
        <div className="mb-10 flex items-center justify-between">
          <p className="kicker">
            <span className="text-bone tabular-nums">
              {String(results.length).padStart(2, "0")}
            </span>{" "}
            {results.length === 1 ? "imóvel" : "imóveis"}
          </p>
          <AnimatePresence>
            {dirty && (
              <motion.button
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                onClick={reset}
                className="text-smoke hover:text-gold flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-400"
              >
                <X className="h-3 w-3" strokeWidth={1.5} />
                Limpar filtros
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {results.length > 0 ? (
          <motion.div
            layout
            className="grid gap-x-8 gap-y-16 md:grid-cols-2 xl:grid-cols-3"
          >
            {results.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} priority={i < 3} />
            ))}
          </motion.div>
        ) : (
          <div className="border-noir-4 flex flex-col items-center border-y py-24 text-center">
            <p className="font-display text-bone text-3xl">Nada com esse recorte.</p>
            <p className="text-ash mt-4 max-w-md leading-relaxed">
              A carteira gira rápido e nem tudo que eu tenho está publicado. Me diga o que
              procura e eu busco — inclusive fora do site.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <ButtonLink
                href={waLink("Olá Ysraell, não achei no site o que procuro. Estou buscando:")}
                variant="gold"
                arrow
              >
                Me diz o que procura
              </ButtonLink>
              <button
                onClick={reset}
                className="border-smoke/60 text-mist hover:border-gold hover:text-gold inline-flex h-12 items-center rounded-full border px-6 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors duration-500"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
