"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminAppointmentRow } from "@/lib/admin";
import { useNow } from "@/lib/hooks";
import { AppointmentForm } from "@/components/admin/AppointmentForm";
import { AppointmentRow } from "@/components/admin/AppointmentRow";

/**
 * Lista interativa da agenda.
 *
 * Separa próximos de passados: o compromisso de amanhã é o que
 * importa agora, o de semana passada é arquivo. Empilhar os dois
 * juntos faria a lista crescer para sempre e esconder o que interessa
 * lá embaixo.
 */
export function AgendaList({ initial }: { initial: AdminAppointmentRow[] }) {
  const [rows, setRows] = useState(initial);
  const router = useRouter();

  // O servidor manda uma lista nova a cada `router.refresh()` (ex.:
  // depois de criar um compromisso). Ajustar durante a renderização,
  // e não dentro de um efeito, evita o quadro extra de um
  // useEffect+setState — é o padrão que o próprio React recomenda
  // para "resetar estado quando uma prop muda" (mesmo truque do
  // menu em Header.tsx).
  const [ultimoInitial, setUltimoInitial] = useState(initial);
  if (initial !== ultimoInitial) {
    setUltimoInitial(initial);
    setRows(initial);
  }

  // `null` no primeiro quadro (ver useNow): tudo aparece em
  // "Próximos" até o valor real chegar, o que dura um quadro só.
  const agora = useNow();

  const proximos = agora === null ? rows : rows.filter((r) => new Date(r.starts_at).getTime() >= agora);
  const passados =
    agora === null
      ? []
      : rows
          .filter((r) => new Date(r.starts_at).getTime() < agora)
          .sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime());

  function onDeleted(id: string) {
    setRows((r) => r.filter((x) => x.id !== id));
  }

  function onCreated() {
    // O POST em /api/agenda já gravou; um refresh do server component
    // traz a lista completa e atualizada, com o novo item na ordem certa.
    router.refresh();
  }

  return (
    <div className="space-y-12">
      <AppointmentForm onCreated={onCreated} />

      <div>
        <p className="kicker text-gold mb-5">
          Próximos <span className="text-bone">({proximos.length})</span>
        </p>
        {proximos.length === 0 ? (
          <div className="border-noir-4 rounded-sm border border-dashed p-10 text-center">
            <p className="text-ash">Nenhum compromisso à frente.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {proximos.map((a) => (
              <AppointmentRow key={a.id} appointment={a} onDeleted={onDeleted} />
            ))}
          </ul>
        )}
      </div>

      {passados.length > 0 && (
        <div>
          <p className="kicker mb-5">
            Anteriores <span className="text-bone">({passados.length})</span>
          </p>
          <ul className="space-y-3">
            {passados.map((a) => (
              <AppointmentRow key={a.id} appointment={a} onDeleted={onDeleted} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
