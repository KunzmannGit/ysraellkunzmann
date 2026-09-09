"use client";

import { useState } from "react";
import { Check, ChevronDown, ExternalLink } from "lucide-react";
import type { AdminLeadRow } from "@/lib/admin";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/** Um contato na caixa de entrada: expande para ler, marca como atendido. */
export function LeadRow({
  lead,
  kindLabel,
  tone,
}: {
  lead: AdminLeadRow;
  kindLabel: string;
  tone: string;
}) {
  const [open, setOpen] = useState(false);
  const [handled, setHandled] = useState(lead.handled);
  const [busy, setBusy] = useState(false);

  const when = new Date(lead.created_at).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  // O contato pode ser e-mail ou telefone: o link muda conforme.
  const isEmail = lead.contact.includes("@");
  const contactHref = isEmail
    ? `mailto:${lead.contact}`
    : `https://wa.me/${lead.contact.replace(/\D/g, "")}`;

  async function toggleHandled(event: React.MouseEvent) {
    event.stopPropagation();
    const supabase = getBrowserSupabase();
    if (!supabase) return;

    const next = !handled;
    setBusy(true);
    // Atualiza a tela antes da rede: se falhar, volta atrás.
    setHandled(next);

    const { error } = await supabase.from("leads").update({ handled: next }).eq("id", lead.id);
    if (error) setHandled(!next);
    setBusy(false);
  }

  return (
    <li>
      <div
        className={cn(
          "border-noir-4 bg-noir-2/40 rounded-sm border transition-colors duration-400",
          handled && "opacity-55",
        )}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-4 p-4 text-left"
          aria-expanded={open}
        >
          <button
            onClick={toggleHandled}
            disabled={busy}
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
              handled
                ? "border-jade bg-jade/15 text-jade"
                : "border-noir-5 text-smoke hover:border-gold hover:text-gold",
            )}
            aria-label={handled ? "Marcar como não atendido" : "Marcar como atendido"}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className={cn("font-display text-bone text-lg", handled && "line-through")}>
                {lead.name}
              </p>
              <span className={cn("font-mono text-[9px] tracking-[0.18em] uppercase", tone)}>
                {kindLabel}
              </span>
            </div>
            <p className="text-smoke mt-1 truncate font-mono text-[10px] tracking-[0.12em]">
              {lead.contact}
              {lead.property_title ? ` · ${lead.property_title}` : ""}
            </p>
          </div>

          <span className="text-smoke shrink-0 font-mono text-[10px] tracking-[0.14em] tabular-nums">
            {when}
          </span>

          <ChevronDown
            className={cn(
              "text-smoke h-4 w-4 shrink-0 transition-transform duration-400",
              open && "rotate-180",
            )}
            strokeWidth={1.5}
          />
        </button>

        {open && (
          <div className="border-noir-4 space-y-4 border-t px-4 pt-5 pb-5 sm:px-[4.25rem]">
            {lead.message && (
              <p className="text-mist leading-relaxed whitespace-pre-wrap">{lead.message}</p>
            )}

            {(lead.owner_kind || lead.owner_address || lead.owner_price) && (
              <dl className="text-ash grid gap-2 font-mono text-[11px] sm:grid-cols-3">
                {lead.owner_kind && (
                  <div>
                    <dt className="text-smoke text-[9px] tracking-[0.18em] uppercase">Tipo</dt>
                    <dd className="mt-1">{lead.owner_kind}</dd>
                  </div>
                )}
                {lead.owner_address && (
                  <div>
                    <dt className="text-smoke text-[9px] tracking-[0.18em] uppercase">Onde</dt>
                    <dd className="mt-1">{lead.owner_address}</dd>
                  </div>
                )}
                {lead.owner_price && (
                  <div>
                    <dt className="text-smoke text-[9px] tracking-[0.18em] uppercase">Pretendido</dt>
                    <dd className="mt-1">{lead.owner_price}</dd>
                  </div>
                )}
              </dl>
            )}

            <div className="flex flex-wrap gap-4 pt-1">
              <a
                href={contactHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-lit inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase"
              >
                <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                {isEmail ? "Responder por e-mail" : "Abrir no WhatsApp"}
              </a>
              {lead.property_slug && (
                <a
                  href={`/imoveis/${lead.property_slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ash hover:text-bone inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase"
                >
                  <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                  Ver o imóvel
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
