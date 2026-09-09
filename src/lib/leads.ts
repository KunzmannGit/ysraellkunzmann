import { z } from "zod";

/** Contato pode ser e-mail OU telefone — exigir os dois espanta lead. */
const contactSchema = z
  .string()
  .trim()
  .min(6, "Deixe um e-mail ou telefone para eu responder.")
  .max(120, "Contato muito longo — deixe só o e-mail ou o telefone.");

export const leadSchema = z.object({
  kind: z.enum(["interesse", "anuncio", "contato"]),
  name: z.string().trim().min(2, "Como posso te chamar?").max(120, "Nome muito longo."),
  contact: contactSchema,
  message: z
    .string()
    .trim()
    .max(2000, "Mensagem muito longa — resuma e me conte o resto na conversa.")
    .optional()
    .default(""),

  /** Slug do imóvel quando o lead vem de uma página de imóvel. */
  propertySlug: z.string().trim().max(160).optional(),
  propertyTitle: z.string().trim().max(200).optional(),

  /** Campos extras do fluxo "quero anunciar meu imóvel". */
  ownerAddress: z.string().trim().max(240).optional(),
  ownerKind: z.string().trim().max(60).optional(),
  ownerPrice: z.string().trim().max(60).optional(),

  /**
   * Armadilha para robô: campo escondido que humano não vê.
   *
   * Repare que ele NÃO é validado como "tem que estar vazio". Se fosse,
   * a validação barraria antes de o handler decidir o que fazer — e
   * devolveria um erro sobre um campo que a pessoa não consegue ver.
   * Gerenciador de senhas também preenche campo oculto de vez em quando;
   * o preço desse falso positivo é um cliente real perdido. Quem decide
   * é o handler, e ele responde 200 sem gravar.
   */
  website: z.string().max(500).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Monta a mensagem de WhatsApp a partir do lead — usada como rede de segurança. */
export function leadToWhatsappText(lead: LeadInput, domain: string) {
  const lines: string[] = [`Olá Ysraell, vim pelo ${domain}.`, ""];

  if (lead.kind === "interesse" && lead.propertyTitle) {
    lines.push(`Tenho interesse no imóvel: ${lead.propertyTitle}`);
  }
  if (lead.kind === "anuncio") {
    lines.push("Quero anunciar meu imóvel para locação.");
    if (lead.ownerKind) lines.push(`Tipo: ${lead.ownerKind}`);
    if (lead.ownerAddress) lines.push(`Onde fica: ${lead.ownerAddress}`);
    if (lead.ownerPrice) lines.push(`Valor pretendido: ${lead.ownerPrice}`);
  }

  lines.push("", `Nome: ${lead.name}`, `Contato: ${lead.contact}`);
  if (lead.message) lines.push("", lead.message);

  return lines.join("\n");
}
