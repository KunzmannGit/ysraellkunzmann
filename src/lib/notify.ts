import "server-only";
import type { LeadInput } from "@/lib/leads";
import { site } from "@/lib/site";

/* ═══════════════════════════════════════════════════════════
   AVISO POR E-MAIL DE NOVO CONTATO

   Regra de ouro: isto NUNCA pode derrubar o recebimento do
   lead. O contato ja esta salvo quando chegamos aqui; o e-mail
   e conveniencia. Se o servico de envio estiver fora, o pior
   que acontece e voce descobrir o contato pelo painel em vez
   de pelo celular.

   Por isso tudo aqui e best-effort: sem chave configurada,
   sai calado; com erro, registra no log e devolve false.
   ═══════════════════════════════════════════════════════════ */

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";

/** Remetente. Precisa ser um dominio verificado no Resend. */
const FROM = process.env.LEAD_NOTIFY_FROM ?? `Site ${site.name} <site@send.${site.domain}>`;

/** Para quem avisar. Por padrao, os dois e-mails do site. */
const TO = (process.env.LEAD_NOTIFY_TO ?? `${site.email},${site.emailAlt}`)
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

export const notifyEnabled = Boolean(RESEND_API_KEY);

const KIND_LABEL: Record<LeadInput["kind"], string> = {
  interesse: "Interesse em imóvel",
  anuncio: "Quer anunciar um imóvel",
  contato: "Contato pelo site",
};

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmail(lead: LeadInput, stored: boolean) {
  const label = KIND_LABEL[lead.kind];

  const subject =
    lead.kind === "interesse" && lead.propertyTitle
      ? `Novo interesse: ${lead.propertyTitle} — ${lead.name}`
      : lead.kind === "anuncio"
        ? `Novo imóvel para captar — ${lead.name}`
        : `Novo contato pelo site — ${lead.name}`;

  const linhas: Array<[string, string | undefined]> = [
    ["Tipo", label],
    ["Nome", lead.name],
    ["Contato", lead.contact],
    ["Imóvel", lead.propertyTitle],
    ["Tipo do imóvel", lead.ownerKind],
    ["Onde fica", lead.ownerAddress],
    ["Valor pretendido", lead.ownerPrice],
  ];

  const preenchidas = linhas.filter(([, v]) => v);

  const texto = [
    subject,
    "",
    ...preenchidas.map(([k, v]) => `${k}: ${v}`),
    "",
    lead.message ? `Mensagem:\n${lead.message}` : "(sem mensagem)",
    "",
    stored
      ? `Ver no painel: ${site.url}/admin/leads`
      : "ATENÇÃO: não foi possível gravar no banco. Este e-mail é o único registro deste contato.",
  ].join("\n");

  // HTML claro e sem firula: cliente de e-mail no celular precisa ser
  // legivel de relance, nao bonito. Tema escuro em e-mail costuma ser
  // invertido pelo proprio aplicativo e sair pior do que saiu daqui.
  const html = `
<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#18161c">
  <p style="margin:0 0 4px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8a8494">${esc(label)}</p>
  <h1 style="margin:0 0 20px;font-size:22px;font-weight:600;line-height:1.25">${esc(lead.name)}</h1>

  <table style="width:100%;border-collapse:collapse;font-size:14px">
    ${preenchidas
      .slice(1)
      .map(
        ([k, v]) => `<tr>
      <td style="padding:8px 12px 8px 0;color:#8a8494;white-space:nowrap;vertical-align:top;border-bottom:1px solid #ece9f0">${esc(k)}</td>
      <td style="padding:8px 0;border-bottom:1px solid #ece9f0">${esc(v!)}</td>
    </tr>`,
      )
      .join("")}
  </table>

  ${
    lead.message
      ? `<div style="margin:20px 0;padding:14px 16px;background:#f6f4f9;border-left:3px solid #c9a227;border-radius:2px">
    <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap">${esc(lead.message)}</p>
  </div>`
      : ""
  }

  ${
    stored
      ? `<p style="margin:24px 0 0"><a href="${site.url}/admin/leads" style="display:inline-block;background:#18161c;color:#fff;text-decoration:none;padding:11px 20px;border-radius:99px;font-size:12px;letter-spacing:.12em;text-transform:uppercase">Abrir no painel</a></p>`
      : `<p style="margin:24px 0 0;padding:12px 14px;background:#fff4ed;border:1px solid #f0c9ae;border-radius:4px;font-size:13px;color:#9a3412">
      Não foi possível gravar no banco. <strong>Este e-mail é o único registro deste contato.</strong>
    </p>`
  }

  <p style="margin:28px 0 0;font-size:11px;color:#a9a3b2">Enviado automaticamente por ${esc(site.domain)}</p>
</div>`.trim();

  return { subject, texto, html };
}

/**
 * Dispara o aviso. Devolve `true` se o servico aceitou.
 * Nunca lanca: quem chama nao deve nem precisar de try/catch.
 */
export async function notifyNewLead(lead: LeadInput, stored: boolean): Promise<boolean> {
  if (!notifyEnabled || TO.length === 0) return false;

  const { subject, texto, html } = buildEmail(lead, stored);

  // Se a pessoa deixou e-mail, responder na caixa ja vai direto
  // para ela — sem copiar e colar endereco.
  const replyTo = lead.contact.includes("@") ? lead.contact : undefined;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: TO,
        subject,
        text: texto,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!res.ok) {
      console.error("[notify] Resend recusou:", res.status, (await res.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (error) {
    console.error("[notify] falha ao avisar:", error);
    return false;
  }
}
