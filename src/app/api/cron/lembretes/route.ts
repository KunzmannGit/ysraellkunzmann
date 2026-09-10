import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/service";
import { notifyAppointmentReminder } from "@/lib/notify-agenda";

/**
 * Lembrete diário de compromissos.
 *
 * A Vercel chama isto uma vez por dia (ver vercel.json) e injeta
 * automaticamente `Authorization: Bearer ${CRON_SECRET}` na
 * requisição — é assim que se protege uma rota de cron sem exigir
 * login, e é a forma que a própria documentação da Vercel recomenda.
 * Sem o segredo batendo, a rota nem chega a tocar no banco.
 *
 * Roda sem sessão de usuário (ninguém está logado às 8h da manhã
 * automaticamente), por isso usa o cliente de serviço em vez do
 * cliente de servidor comum.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Banco não conectado." }, { status: 503 });
  }

  // "Hoje" em horário de Brasília, não no fuso do servidor (a Vercel
  // roda em UTC). O Brasil aboliu o horário de verão em 2019, então
  // o deslocamento -03:00 é fixo o ano inteiro — não há cálculo de
  // DST a fazer aqui.
  const hojeSP = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const inicioDoDia = new Date(`${hojeSP}T00:00:00-03:00`).toISOString();
  const fimDoDia = new Date(`${hojeSP}T23:59:59.999-03:00`).toISOString();

  const { data: compromissos, error } = await supabase
    .from("appointments")
    .select("*")
    .gte("starts_at", inicioDoDia)
    .lte("starts_at", fimDoDia)
    .eq("reminder_sent", false);

  if (error) {
    console.error("[cron/lembretes] falha ao consultar:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  let enviados = 0;
  for (const a of compromissos ?? []) {
    const ok = await notifyAppointmentReminder({
      title: a.title,
      startsAt: a.starts_at,
      location: a.location,
      notes: a.notes,
      propertyTitle: a.property_title,
    });

    // Só marca como enviado se o e-mail realmente saiu. Se o Resend
    // estiver fora agora, tentar de novo amanhã não ajudaria — o
    // compromisso já teria passado — mas ao menos não mascaramos
    // uma falha real como sucesso.
    if (ok) {
      await supabase.from("appointments").update({ reminder_sent: true }).eq("id", a.id);
      enviados++;
    } else {
      console.error("[cron/lembretes] falha ao enviar para:", a.id, a.title);
    }
  }

  return NextResponse.json({ ok: true, encontrados: compromissos?.length ?? 0, enviados });
}
