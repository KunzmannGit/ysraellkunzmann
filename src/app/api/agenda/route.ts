import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSupabase } from "@/lib/supabase/server";
import { notifyAppointmentCreated } from "@/lib/notify-agenda";

/**
 * Cria um compromisso e dispara a confirmação por e-mail.
 *
 * O e-mail sai por aqui (rota de servidor) e não pelo cliente
 * Supabase do navegador, porque a chave do Resend é secreta —
 * o mesmo motivo pelo qual /api/leads existe em vez de o formulário
 * escrever direto no banco.
 */
const bodySchema = z.object({
  title: z.string().trim().min(1, "Dê um título ao compromisso.").max(200),
  startsAt: z.string().datetime({ message: "Data e hora inválidas." }),
  location: z.string().trim().max(240).optional(),
  notes: z.string().trim().max(2000).optional(),
  propertySlug: z.string().trim().max(160).optional(),
  propertyTitle: z.string().trim().max(200).optional(),
});

export async function POST(request: Request) {
  const supabase = await getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Banco não conectado." }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Corpo inválido." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Confira os campos." },
      { status: 422 },
    );
  }

  const a = parsed.data;

  const { data: row, error } = await supabase
    .from("appointments")
    .insert({
      title: a.title,
      starts_at: a.startsAt,
      location: a.location || null,
      notes: a.notes || null,
      property_slug: a.propertySlug || null,
      property_title: a.propertyTitle || null,
    })
    .select("*")
    .single();

  if (error || !row) {
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Falha ao salvar." },
      { status: 500 },
    );
  }

  // Confirmação por e-mail é best-effort: o compromisso já está
  // salvo, o aviso é conveniência e não pode atrasar a resposta
  // nem derrubar a criação se o Resend estiver fora do ar.
  const notified = await notifyAppointmentCreated({
    title: row.title,
    startsAt: row.starts_at,
    location: row.location,
    notes: row.notes,
    propertyTitle: row.property_title,
  });

  return NextResponse.json({ ok: true, appointment: row, notified });
}
