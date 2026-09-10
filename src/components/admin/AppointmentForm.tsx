"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full border-b border-noir-5 bg-transparent pb-2 pt-1 text-bone outline-none " +
  "transition-colors duration-300 focus:border-gold placeholder:text-smoke";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="kicker mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

/**
 * Formulário de novo compromisso.
 *
 * O dia já vem escolhido — quem decide a data é o clique no
 * calendário, não este formulário. Ele só pergunta hora, título e
 * o resto, o que também elimina qualquer leitura de relógio aqui
 * dentro (nada de `Date.now()` impuro no meio do render).
 *
 * Passa pela rota /api/agenda em vez de escrever direto no banco
 * pelo cliente do navegador, porque criar precisa disparar o
 * e-mail de confirmação — e a chave do Resend é secreta, só existe
 * no servidor.
 */
export function AppointmentForm({
  date,
  onCreated,
}: {
  /** Dia já escolhido no calendário, formato AAAA-MM-DD. */
  date: string;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const hora = String(form.get("hora") ?? "09:00");

    // Horário de Brasília, -03:00 fixo (sem horário de verão desde
    // 2019) — o navegador converte para UTC no Date.toISOString().
    const startsAt = new Date(`${date}T${hora}:00-03:00`).toISOString();

    try {
      const res = await fetch("/api/agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: String(form.get("title") ?? ""),
          startsAt,
          location: String(form.get("location") ?? ""),
          notes: String(form.get("notes") ?? ""),
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setError(json.error ?? "Não consegui salvar.");
        setBusy(false);
        return;
      }

      setBusy(false);
      setOpen(false);
      (event.target as HTMLFormElement).reset();
      onCreated();
    } catch {
      setError("Sem conexão com o servidor.");
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="border-noir-5 text-ash hover:border-gold hover:text-gold inline-flex h-10 items-center gap-2 rounded-full border border-dashed px-5 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-300"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
        Novo compromisso
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border-noir-4 bg-noir-2/40 space-y-6 rounded-sm border p-6">
      <Field label="Título">
        <input
          name="title"
          required
          placeholder="Visita — Galpão Jardim Limoeiro"
          data-cursor="text"
          autoFocus
          className={fieldClass}
        />
      </Field>

      <Field label="Hora" className="max-w-[10rem]">
        <input name="hora" type="time" required defaultValue="09:00" data-cursor="text" className={fieldClass} />
      </Field>

      <Field label="Local (opcional)">
        <input
          name="location"
          placeholder="Endereço ou ponto de referência"
          data-cursor="text"
          className={fieldClass}
        />
      </Field>

      <Field label="Notas (opcional)">
        <textarea
          name="notes"
          rows={3}
          placeholder="Levar chave, telefone de contato…"
          data-cursor="text"
          className={cn(fieldClass, "resize-y")}
        />
      </Field>

      {error && (
        <p className="text-ember text-sm" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="bg-gold text-noir hover:bg-gold-lit inline-flex h-11 items-center gap-2 rounded-full px-6 font-mono text-[10px] font-medium tracking-[0.18em] uppercase transition-colors duration-400 disabled:opacity-50"
        >
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />}
          {busy ? "Salvando…" : "Salvar compromisso"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-smoke hover:text-bone font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
