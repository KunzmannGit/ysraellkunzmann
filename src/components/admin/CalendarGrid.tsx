"use client";

import type { AdminAppointmentRow } from "@/lib/admin";
import { cn } from "@/lib/utils";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** "AAAA-MM-DD" a partir de um Date construído com ano/mês/dia explícitos. */
function isoLocal(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dia}`;
}

/**
 * As 42 células do mês (6 semanas), incluindo o resto do mês
 * anterior e o começo do seguinte para fechar a grade.
 *
 * Só usa o construtor `new Date(ano, mês, dia)` com números
 * explícitos — nunca `new Date()` nem `Date.now()`. Isso é o que
 * mantém a função pura: o mesmo mês sempre gera a mesma grade,
 * então dá para chamar isto direto no corpo do componente sem
 * esbarrar na regra que proíbe ler o relógio durante a renderização.
 * A normalização de mês/ano nas bordas (dia 0, dia 32…) é o
 * próprio `Date` do JavaScript quem resolve.
 */
function gerarGrade(ano: number, mes0: number): Date[] {
  const primeiroDoMes = new Date(ano, mes0, 1);
  const inicio = new Date(ano, mes0, 1 - primeiroDoMes.getDay());
  return Array.from(
    { length: 42 },
    (_, i) => new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i),
  );
}

export function CalendarGrid({
  ano,
  mes0,
  hojeISO,
  selecionado,
  porDia,
  onSelectDay,
}: {
  ano: number;
  /** 0 = janeiro. */
  mes0: number;
  hojeISO: string;
  selecionado: string | null;
  porDia: Map<string, AdminAppointmentRow[]>;
  onSelectDay: (iso: string) => void;
}) {
  const celulas = gerarGrade(ano, mes0);

  return (
    <div className="border-noir-4 overflow-hidden rounded-sm border">
      <div className="bg-noir-2/60 grid grid-cols-7">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="kicker px-2 py-3 text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {celulas.map((cel) => {
          const iso = isoLocal(cel);
          const noMes = cel.getMonth() === mes0;
          const hoje = iso === hojeISO;
          const ativo = iso === selecionado;
          const compromissos = porDia.get(iso) ?? [];

          return (
            <button
              key={iso}
              onClick={() => onSelectDay(iso)}
              className={cn(
                "border-noir-4 hover:bg-noir-2/70 flex min-h-20 flex-col items-start gap-1 border-t border-l p-2 text-left transition-colors duration-200 sm:min-h-24 sm:p-2.5",
                "nth-[7n+1]:border-l-0",
                ativo && "bg-gold/10",
                !noMes && "opacity-35",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px]",
                  hoje && "bg-gold text-noir font-medium",
                  !hoje && ativo && "text-gold",
                  !hoje && !ativo && "text-ash",
                )}
              >
                {cel.getDate()}
              </span>

              <div className="flex w-full flex-col gap-1">
                {compromissos.slice(0, 2).map((c) => (
                  <span
                    key={c.id}
                    className="bg-noir-4 text-mist block truncate rounded-xs px-1.5 py-0.5 text-left font-mono text-[9px] leading-tight"
                  >
                    {c.title}
                  </span>
                ))}
                {compromissos.length > 2 && (
                  <span className="text-smoke pl-1 font-mono text-[9px]">
                    +{compromissos.length - 2}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
