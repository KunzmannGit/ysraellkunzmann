"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AdminAppointmentRow } from "@/lib/admin";
import { useNow } from "@/lib/hooks";
import { dataChaveSP } from "@/lib/utils";
import { CalendarGrid } from "@/components/admin/CalendarGrid";
import { AppointmentForm } from "@/components/admin/AppointmentForm";
import { AppointmentRow } from "@/components/admin/AppointmentRow";

/**
 * Agenda em formato de calendário — mês inteiro, um dia por
 * célula, tipo Google Agenda.
 *
 * A data "hoje" e o mês exibido vêm de `useNow()`, não de
 * `Date.now()` direto: chamar o relógio no corpo do componente é
 * proibido pela regra de pureza (duas renderizações na mesma
 * passada podem pegar instantes diferentes). O mês exibido nunca
 * é guardado como Date em estado — só um deslocamento inteiro
 * (`offsetMeses`) a partir do mês atual, que é puro por natureza:
 * o número 0 não muda dependendo de quando o componente roda.
 */
export function AgendaCalendar({ initial }: { initial: AdminAppointmentRow[] }) {
  const [rows, setRows] = useState(initial);
  const router = useRouter();

  // Mesmo padrão do Header.tsx: ajustar durante a renderização
  // em vez de num efeito, para a lista já chegar sincronizada no
  // mesmo quadro em que o servidor manda dados novos (depois de
  // criar um compromisso, por exemplo).
  const [ultimoInitial, setUltimoInitial] = useState(initial);
  if (initial !== ultimoInitial) {
    setUltimoInitial(initial);
    setRows(initial);
  }

  const agora = useNow();
  const hojeISO = agora === null ? null : dataChaveSP(new Date(agora).toISOString());

  const [offsetMeses, setOffsetMeses] = useState(0);

  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [selecionadoPronto, setSelecionadoPronto] = useState(false);
  if (!selecionadoPronto && hojeISO !== null) {
    setSelecionadoPronto(true);
    setSelecionado(hojeISO);
  }

  function onDeleted(id: string) {
    setRows((r) => r.filter((x) => x.id !== id));
  }

  function onCreated() {
    // O POST em /api/agenda já gravou; um refresh do server component
    // traz a lista completa e atualizada.
    router.refresh();
  }

  // Antes de saber "hoje", não há mês para desenhar — o formulário
  // e o calendário dependem de uma data real. Dura um quadro só.
  if (hojeISO === null || selecionado === null) {
    return <div className="h-96" aria-hidden />;
  }

  const [anoHoje, mesHoje1] = hojeISO.split("-").map(Number);
  const mesExibido = new Date(anoHoje, mesHoje1 - 1 + offsetMeses, 1);
  const anoExibido = mesExibido.getFullYear();
  const mes0Exibido = mesExibido.getMonth();

  const rotulo = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(mesExibido);

  const porDia = new Map<string, AdminAppointmentRow[]>();
  for (const r of rows) {
    const chave = dataChaveSP(r.starts_at);
    const lista = porDia.get(chave);
    if (lista) lista.push(r);
    else porDia.set(chave, [r]);
  }
  for (const lista of porDia.values()) {
    lista.sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  }

  const [anoSel, mesSel1, diaSel] = selecionado.split("-").map(Number);
  const rotuloDia = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date(anoSel, mesSel1 - 1, diaSel));

  const compromissosDoDia = (porDia.get(selecionado) ?? []).slice();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-bone text-2xl capitalize">{rotulo}</h2>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setOffsetMeses(0);
                setSelecionado(hojeISO);
              }}
              className="text-smoke hover:text-gold mr-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-300"
            >
              Hoje
            </button>
            <button
              onClick={() => setOffsetMeses((o) => o - 1)}
              className="border-noir-5 text-ash hover:border-gold hover:text-gold flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setOffsetMeses((o) => o + 1)}
              className="border-noir-5 text-ash hover:border-gold hover:text-gold flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300"
              aria-label="Próximo mês"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <CalendarGrid
          ano={anoExibido}
          mes0={mes0Exibido}
          hojeISO={hojeISO}
          selecionado={selecionado}
          porDia={porDia}
          onSelectDay={setSelecionado}
        />
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="kicker text-gold mb-1.5">
          {selecionado === hojeISO ? "Hoje" : "Selecionado"}
        </p>
        <h3 className="font-display text-bone mb-6 text-xl capitalize">{rotuloDia}</h3>

        {compromissosDoDia.length === 0 ? (
          <p className="text-smoke mb-6 text-sm">Nenhum compromisso neste dia.</p>
        ) : (
          <ul className="mb-6 space-y-2.5">
            {compromissosDoDia.map((a) => (
              <AppointmentRow key={a.id} appointment={a} onDeleted={onDeleted} compact />
            ))}
          </ul>
        )}

        <AppointmentForm date={selecionado} onCreated={onCreated} />
      </div>
    </div>
  );
}
