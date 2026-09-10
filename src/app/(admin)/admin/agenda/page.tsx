import { AlertTriangle } from "lucide-react";
import { listAdminAppointments } from "@/lib/admin";
import { AgendaList } from "@/components/admin/AgendaList";

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const result = await listAdminAppointments();

  if (!result.ok) {
    return (
      <div className="border-noir-4 bg-noir-2/60 rounded-sm border p-8">
        <AlertTriangle className="text-ember mb-5 h-6 w-6" strokeWidth={1.25} />
        <h1 className="font-display text-bone text-2xl">Não consegui ler a agenda.</h1>
        <p className="text-ash mt-3 max-w-xl leading-relaxed">
          {result.reason === "sem-supabase"
            ? "O Supabase ainda não está conectado."
            : `O banco respondeu com erro: ${result.reason}`}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10">
        <p className="kicker text-gold mb-3">Compromissos</p>
        <h1 className="font-display text-bone text-4xl md:text-5xl">Agenda</h1>
        <p className="text-ash mt-3 max-w-lg leading-relaxed">
          Cada compromisso novo manda uma confirmação para o seu e-mail. No dia,
          chega um lembrete pela manhã.
        </p>
      </div>

      <AgendaList initial={result.rows} />
    </>
  );
}
