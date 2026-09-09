import { NextResponse } from "next/server";
import { leadSchema, leadToWhatsappText } from "@/lib/leads";
import { getServerSupabase } from "@/lib/supabase/server";
import { site, waLink } from "@/lib/site";

/**
 * Recebe um lead.
 *
 * Se o Supabase estiver conectado, grava. Se nao estiver (ou falhar),
 * responde `stored: false` e devolve o link de WhatsApp ja preenchido —
 * o formulario vira um atalho para a conversa em vez de engolir o contato.
 * Lead perdido e o unico bug caro num site de corretor.
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
  const supabase = await getServerSupabase();

  if (!supabase) {
    return NextResponse.json({ ok: true, stored: false, whatsappUrl });
  }

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

  if (error) {
    console.error("[leads] falha ao gravar:", error.message);
    return NextResponse.json({ ok: true, stored: false, whatsappUrl });
  }

  return NextResponse.json({ ok: true, stored: true, whatsappUrl });
}
