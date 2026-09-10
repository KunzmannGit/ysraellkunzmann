"use client";

import { useState } from "react";
import { Bell, MapPin, Trash2 } from "lucide-react";
import type { AdminAppointmentRow } from "@/lib/admin";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/**
 * Uma linha de compromisso.
 *
 * `compact`: usado dentro do painel de um dia já selecionado no
 * calendário — a data ali seria redundante (o dia inteiro já diz
 * qual é), então some o bloco de data e sobra só hora, título,
 * local e a lixeira.
 *
 * Apagar não precisa de e-mail nem de rota própria — é escrita
 * direta pelo cliente do navegador, protegida pela RLS da tabela
 * (só `authenticated` toca em `appointments`), igual ao "marcar
 * como atendido" dos leads.
 */
export function AppointmentRow({
  appointment,
  onDeleted,
  compact = false,
}: {
  appointment: AdminAppointmentRow;
  onDeleted: (id: string) => void;
  compact?: boolean;
}) {
  const [busy, setBusy] = useState(false);

  const inicio = new Date(appointment.starts_at);

  const data = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(inicio);
  const hora = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  }).format(inicio);

  async function excluir() {
    if (!window.confirm(`Apagar "${appointment.title}"?`)) return;

    const supabase = getBrowserSupabase();
    if (!supabase) return;

    setBusy(true);
    const { error } = await supabase.from("appointments").delete().eq("id", appointment.id);
    setBusy(false);

    if (!error) onDeleted(appointment.id);
  }

  return (
    <li className="border-noir-4 bg-noir-2/40 flex items-center gap-4 rounded-sm border p-4">
      {!compact && (
        <>
          <div className="w-16 shrink-0 text-center">
            <p className="kicker text-gold capitalize">{data}</p>
            <p className="font-display text-bone mt-0.5 text-lg leading-none">{hora}</p>
          </div>
          <div className="bg-noir-5 h-10 w-px shrink-0" />
        </>
      )}

      {compact && (
        <p className="font-display text-gold w-14 shrink-0 text-lg leading-none">{hora}</p>
      )}

      <div className="min-w-0 flex-1">
        <p className="font-display text-bone truncate text-lg">{appointment.title}</p>
        {appointment.location && (
          <p className="text-smoke mt-1 flex items-center gap-1.5 truncate text-xs">
            <MapPin className="h-3 w-3 shrink-0" strokeWidth={1.5} />
            {appointment.location}
          </p>
        )}
      </div>

      {appointment.reminder_sent && (
        <span title="Lembrete já enviado" className="text-gold-deep shrink-0">
          <Bell className="h-3.5 w-3.5" strokeWidth={1.5} />
        </span>
      )}

      <button
        onClick={excluir}
        disabled={busy}
        className={cn(
          "text-smoke hover:text-ember flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
          busy && "opacity-40",
        )}
        aria-label="Apagar compromisso"
      >
        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </li>
  );
}
