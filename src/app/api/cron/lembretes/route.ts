import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/service";
import { notifyAppointmentReminder } from "@/lib/notify-agenda";

/**
 * Lembrete de compromisso, 1h30 antes do horário marcado — dá tempo
 * de se arrumar e ir, em vez de um resumo genérico de manhã.
 *
 * A Vercel chama isto a cada 5 minutos (ver vercel.json) e injeta
 * automaticamente `Authorization: Bearer ${CRON_SECRET}` na
 * requisição — é assim que se protege uma rota de cron sem exigir
 * login, e é a forma que a própria documentação da Vercel recomenda.
 * Sem o segredo batendo, a rota nem chega a tocar no banco.
 *
 * A janela de busca é de 85 a 95 minutos à frente — 10 minutos de
 * largura para um cron de 5 em 5 minutos, com folga para não perder
 * nenhum compromisso caso uma execução atrase ou falhe.
 * `reminder_sent` garante que, mesmo com a sobreposição das janelas,
 * cada compromisso só dispara um e-mail.
 *
 * Roda sem sessão de usuário (ninguém está logado o dia inteiro
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

  const agora = Date.now();
  const janelaInicio = new Date(agora + 85 * 60_000).toISOString();
  const janelaFim = new Date(agora + 95 * 60_000).toISOString();

  const { data: compromissos, error } = await supabase
    .from("appointments")
    .select("*")
    .gte("starts_at", janelaInicio)
    .lte("starts_at", janelaFim)
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
    // estiver fora agora, a próxima execução (5 min depois) ainda
    // está dentro da janela e tenta de novo — mas não mascaramos
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
