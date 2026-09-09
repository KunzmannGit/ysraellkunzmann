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
