import "server-only";
import { site } from "@/lib/site";
import { escapeHtml as esc, sendEmail } from "@/lib/email";

/* ═══════════════════════════════════════════════════════════
   AVISO POR E-MAIL DA AGENDA

   Dois momentos, dois formatos:
     · confirmação  — ao cadastrar, "você acabou de marcar isto"
     · lembrete     — 1h30 antes, "já vai começar"

   O destino é fixo no seu Gmail pessoal, não nos e-mails do site:
   agenda é rotina sua, não canal de atendimento ao cliente.
   ═══════════════════════════════════════════════════════════ */

const FROM = process.env.LEAD_NOTIFY_FROM ?? `Site ${site.name} <site@send.${site.domain}>`;

const TO = (process.env.AGENDA_NOTIFY_TO ?? "ysraellffkunzmann13@gmail.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

/** Timezone de Brasília: -03:00 fixo, sem horário de verão desde 2019. */
const OFFSET_BR = "-03:00";

export interface AppointmentForEmail {
  title: string;
  startsAt: string; // ISO, em UTC
  location: string | null;
  notes: string | null;
  propertyTitle: string | null;
}

function formatarDataHora(iso: string) {
  const d = new Date(iso);
  const data = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(d);
  const hora = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return { data, hora };
}

function corpo(a: AppointmentForEmail, kicker: string) {
  const { data, hora } = formatarDataHora(a.startsAt);

  const linhas: Array<[string, string | null]> = [
    ["Quando", `${data}, ${hora}`],
    ["Onde", a.location],
    ["Imóvel", a.propertyTitle],
  ];
  const preenchidas = linhas.filter((l): l is [string, string] => Boolean(l[1]));

  const texto = [
    `${kicker}: ${a.title}`,
    "",
    ...preenchidas.map(([k, v]) => `${k}: ${v}`),
    "",
    a.notes ? `Notas:\n${a.notes}` : "",
    "",
    `Ver a agenda: ${site.url}/admin/agenda`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#18161c">
  <p style="margin:0 0 4px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8a8496">${esc(kicker)}</p>
  <h1 style="margin:0 0 20px;font-size:22px;font-weight:600;line-height:1.25">${esc(a.title)}</h1>

  <table style="width:100%;border-collapse:collapse;font-size:14px">
    ${preenchidas
      .map(
        ([k, v]) => `<tr>
      <td style="padding:8px 12px 8px 0;color:#8a8496;white-space:nowrap;vertical-align:top;border-bottom:1px solid #ece9f0">${esc(k)}</td>
      <td style="padding:8px 0;border-bottom:1px solid #ece9f0">${esc(v)}</td>
    </tr>`,
      )
      .join("")}
  </table>

  ${
    a.notes
      ? `<div style="margin:20px 0;padding:14px 16px;background:#f6f4f9;border-left:3px solid #c9a227;border-radius:2px">
    <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap">${esc(a.notes)}</p>
  </div>`
      : ""
  }

  <p style="margin:24px 0 0"><a href="${site.url}/admin/agenda" style="display:inline-block;background:#18161c;color:#fff;text-decoration:none;padding:11px 20px;border-radius:99px;font-size:12px;letter-spacing:.12em;text-transform:uppercase">Abrir a agenda</a></p>

  <p style="margin:28px 0 0;font-size:11px;color:#a9a3b2">Enviado automaticamente por ${esc(site.domain)}</p>
</div>`.trim();

  return { texto, html };
}

/** Ao cadastrar um compromisso: confirma que ficou salvo, com os dados certos. */
export async function notifyAppointmentCreated(a: AppointmentForEmail): Promise<boolean> {
  const { data } = formatarDataHora(a.startsAt);
  const { texto, html } = corpo(a, "Compromisso agendado");
  return sendEmail({
    from: FROM,
    to: TO,
    subject: `Agendado: ${a.title} — ${data}`,
    text: texto,
    html,
  });
}

/** 1h30 antes do horário: lembrete de que já está de saída. */
export async function notifyAppointmentReminder(a: AppointmentForEmail): Promise<boolean> {
  const { hora } = formatarDataHora(a.startsAt);
  const { texto, html } = corpo(a, "Em 1h30");
  return sendEmail({
    from: FROM,
    to: TO,
    subject: `Às ${hora} (daqui a 1h30): ${a.title}`,
    text: texto,
    html,
  });
}

export { OFFSET_BR };
