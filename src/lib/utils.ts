import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** R$ 4.200 — sem centavos, que e como corretor fala. */
export function brl(value: number | null | undefined) {
  if (value == null) return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Numero de 0 a 1 recortado — usado o tempo todo em scroll math. */
export function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  if (inMax === inMin) return outMin;
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/** "3 quartos · 2 vagas · 96 m²" */
export function specLine(parts: Array<string | null | undefined | false>) {
  return parts.filter(Boolean).join(" · ");
}

/**
 * Converte um instante (ISO, UTC) para a data-calendário em
 * horário de Brasília, no formato "AAAA-MM-DD".
 *
 * Existe porque "que dia é" depende do fuso de quem pergunta: um
 * compromisso às 23h de Brasília já é outro dia em UTC. `en-CA` é
 * só um truque de formatação — é o locale que o `Intl` devolve
 * pronto em AAAA-MM-DD, sem precisar remontar a string na mão.
 */
export function dataChaveSP(iso: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}
