import { NextResponse } from "next/server";
import { leadSchema, leadToWhatsappText } from "@/lib/leads";
import { getServerSupabase } from "@/lib/supabase/server";
import { notifyNewLead } from "@/lib/notify";
import { site, waLink } from "@/lib/site";

/**
 * Recebe um lead.
 *
 * Tres caminhos, em ordem de importancia:
 *   1. Grava no banco.
 *   2. Avisa por e-mail (best-effort, nunca derruba o pedido).
 *   3. Devolve um link de WhatsApp ja preenchido como rede de seguranca.
 *
 * Se o banco estiver fora, responde `stored: false` e o formulario
 * vira um atalho para a conversa em vez de engolir o contato. Lead
 * perdido e o unico bug caro num site de corretor.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Corpo invalido." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: first?.message ?? "Confira os campos." },
      { status: 422 },
    );
  }

  const lead = parsed.data;

  // Honeypot preenchido: robo. Responde 200 para nao ensinar o robo a errar menos.
  if (lead.website) {
    return NextResponse.json({ ok: true, stored: false, whatsappUrl: waLink() });
  }

  const whatsappUrl = waLink(leadToWhatsappText(lead, site.domain));

  /* ── 1. Gravar ── */
  let stored = false;
  const supabase = await getServerSupabase();

  if (supabase) {
    const { error } = await supabase.from("leads").insert({
      kind: lead.kind,
      name: lead.name,
      contact: lead.contact,
      message: lead.message || null,
      property_slug: lead.propertySlug ?? null,
      property_title: lead.propertyTitle ?? null,
      owner_address: lead.ownerAddress ?? null,
      owner_kind: lead.ownerKind ?? null,
      owner_price: lead.ownerPrice ?? null,
      source: "site",
    });

    if (error) console.error("[leads] falha ao gravar:", error.message);
    else stored = true;
  }

  /* ── 2. Avisar ──
     Awaited de proposito: na Vercel a funcao pode ser congelada assim
     que a resposta sai, e uma promessa solta seria morta no meio. O
     custo sao ~300 ms; o beneficio e o aviso chegar de verdade.
     Repare que `stored` vai junto: quando o banco falha, o e-mail
     avisa que ELE e o unico registro daquele contato. */
  await notifyNewLead(lead, stored);

  /* ── 3. Responder ── */
  return NextResponse.json({ ok: true, stored, whatsappUrl });
}
