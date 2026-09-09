import Link from "next/link";
import { AlertTriangle, Home, MessageSquare, User } from "lucide-react";

import { listAdminLeads } from "@/lib/admin";
import { LeadRow } from "@/components/admin/LeadRow";

export const dynamic = "force-dynamic";

const KIND_META: Record<string, { label: string; icon: typeof User; tone: string }> = {
  interesse: { label: "Interesse em imóvel", icon: Home, tone: "text-gold" },
  anuncio: { label: "Quer anunciar", icon: Home, tone: "text-jade" },
  contato: { label: "Contato geral", icon: MessageSquare, tone: "text-ash" },
};

export default async function LeadsPage() {
  const result = await listAdminLeads();

  if (!result.ok) {
    return (
      <div className="border-noir-4 bg-noir-2/60 rounded-sm border p-8">
        <AlertTriangle className="text-ember mb-5 h-6 w-6" strokeWidth={1.25} />
        <h1 className="font-display text-bone text-2xl">Não consegui ler os contatos.</h1>
        <p className="text-ash mt-3 max-w-xl leading-relaxed">
          {result.reason === "sem-supabase"
            ? "O Supabase ainda não está conectado. Sem ele, os formulários do site mandam a pessoa direto para o WhatsApp — nenhum contato se perde, mas nada fica registrado aqui."
            : `O banco respondeu com erro: ${result.reason}`}
        </p>
      </div>
    );
  }

  const rows = result.rows;
  const pending = rows.filter((r) => !r.handled);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="kicker text-gold mb-3">Caixa de entrada</p>
          <h1 className="font-display text-bone text-4xl md:text-5xl">Contatos</h1>
        </div>
        <p className="text-ash font-mono text-[11px] tracking-[0.18em] uppercase">
          <span className="text-bone">{pending.length}</span> por atender ·{" "}
          <span className="text-smoke">{rows.length} no total</span>
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="border-noir-4 mt-12 rounded-sm border border-dashed p-14 text-center">
          <p className="font-display text-bone text-2xl">Nenhum contato ainda.</p>
          <p className="text-ash mt-3">
            Assim que alguém preencher um formulário do site, ele aparece aqui.
          </p>
          <Link
            href="/"
            target="_blank"
            className="text-gold hover:text-gold-lit mt-6 inline-block font-mono text-[10px] tracking-[0.18em] uppercase"
          >
            Abrir o site
          </Link>
        </div>
      ) : (
        <ul className="mt-12 space-y-3">
          {rows.map((lead) => {
            const meta = KIND_META[lead.kind] ?? KIND_META.contato;
            return <LeadRow key={lead.id} lead={lead} kindLabel={meta.label} tone={meta.tone} />;
          })}
        </ul>
      )}
    </>
  );
}
