import "server-only";

/* ═══════════════════════════════════════════════════════════
   ENVIO DE E-MAIL — CAMADA COMUM

   Usado tanto pelo aviso de novo contato (notify.ts) quanto pela
   agenda (notify-agenda.ts). Um lugar só para a chave do Resend,
   o tratamento de erro e a regra de ouro: envio de e-mail é
   conveniência e NUNCA pode derrubar o que estava sendo feito
   quando ele foi chamado. Por isso `sendEmail` nunca lança —
   registra o erro no log e devolve `false`.
   ═══════════════════════════════════════════════════════════ */

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
export const emailEnabled = Boolean(RESEND_API_KEY);

export interface EmailInput {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(input: EmailInput): Promise<boolean> {
  if (!emailEnabled || input.to.length === 0) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: input.from,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      console.error("[email] Resend recusou:", res.status, (await res.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (error) {
    console.error("[email] falha ao enviar:", error);
    return false;
  }
}

export function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
