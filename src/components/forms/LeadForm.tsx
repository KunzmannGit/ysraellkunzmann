"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Check, MessageCircle, Send } from "lucide-react";
import type { LeadInput } from "@/lib/leads";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Variant = "interesse" | "anuncio" | "contato";

const EASE = [0.16, 1, 0.3, 1] as const;

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  textarea,
  rows = 4,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
  /** Deixa o celular oferecer o preenchimento salvo. */
  autoComplete?: string;
}) {
  const shared =
    "peer w-full border-b border-noir-5 bg-transparent pt-6 pb-2.5 text-bone " +
    "placeholder:text-transparent outline-none transition-colors duration-400 " +
    "focus:border-gold";

  return (
    <div className="relative">
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          required={required}
          placeholder={placeholder ?? label}
          data-cursor="text"
          className={cn(shared, "resize-none")}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder ?? label}
          data-cursor="text"
          className={shared}
        />
      )}
      <label
        htmlFor={name}
        className={cn(
          "text-smoke pointer-events-none absolute top-6 left-0 font-mono text-[11px] tracking-[0.16em] uppercase",
          "transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "peer-focus:text-gold peer-focus:top-0 peer-focus:text-[10px]",
          "peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px]",
        )}
      >
        {label}
        {required && <span className="text-gold-deep ml-1">*</span>}
      </label>
    </div>
  );
}

export function LeadForm({
  variant,
  propertySlug,
  propertyTitle,
  className,
}: {
  variant: Variant;
  propertySlug?: string;
  propertyTitle?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [stored, setStored] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload: LeadInput = {
      kind: variant,
      name: String(form.get("name") ?? ""),
      contact: String(form.get("contact") ?? ""),
      message: String(form.get("message") ?? ""),
      website: String(form.get("website") ?? ""),
      propertySlug,
      propertyTitle,
      ownerAddress: form.get("ownerAddress") ? String(form.get("ownerAddress")) : undefined,
      ownerKind: form.get("ownerKind") ? String(form.get("ownerKind")) : undefined,
      ownerPrice: form.get("ownerPrice") ? String(form.get("ownerPrice")) : undefined,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Não consegui enviar. Tenta pelo WhatsApp?");
        setStatus("error");
        if (data.whatsappUrl) setWhatsappUrl(data.whatsappUrl);
        return;
      }

      setWhatsappUrl(data.whatsappUrl ?? null);
      setStored(Boolean(data.stored));
      setStatus("done");
    } catch {
      setError("Sem conexão com o servidor. O WhatsApp resolve agora.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className={cn("border-gold-deep/40 bg-noir-2/60 rounded-sm border p-8 md:p-10", className)}
      >
        <div className="border-gold/40 text-gold mb-6 flex h-11 w-11 items-center justify-center rounded-full border">
          <Check className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <p className="font-display text-bone text-2xl">
          {stored ? "Recebi. Já está comigo." : "Quase lá — falta um toque."}
        </p>
        <p className="text-ash mt-3 leading-relaxed">
          {stored
            ? "Respondo hoje mesmo, pelo canal que você deixou. Se preferir adiantar, o WhatsApp está logo abaixo com tudo já preenchido."
            : "O cadastro on-line não está ativo neste momento. Toque no botão abaixo e sua mensagem vai para o WhatsApp já escrita — é só apertar enviar."}
        </p>
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold text-noir hover:bg-gold-lit mt-7 inline-flex h-12 items-center gap-2.5 rounded-full px-6 font-mono text-[11px] font-medium tracking-[0.18em] uppercase transition-colors duration-400"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
            {stored ? "Adiantar no WhatsApp" : "Enviar pelo WhatsApp"}
          </a>
        )}
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-7", className)} noValidate={false}>
      {/* Honeypot: invisível para gente, irresistível para robô */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />

      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="Seu nome" name="name" required autoComplete="name" />
        <Field label="E-mail ou WhatsApp" name="contact" required autoComplete="email" />
      </div>

      {variant === "anuncio" && (
        <div className="grid gap-7 sm:grid-cols-3">
          <Field label="Tipo do imóvel" name="ownerKind" placeholder="Galpão" />
          <Field label="Bairro / endereço" name="ownerAddress" placeholder="Bairro ou rodovia" />
          <Field label="Valor pretendido" name="ownerPrice" placeholder="R$" />
        </div>
      )}

      <Field
        label={
          variant === "interesse"
            ? "O que você quer saber?"
            : variant === "anuncio"
              ? "Conte sobre o imóvel"
              : "Sua mensagem"
        }
        name="message"
        textarea
        rows={variant === "interesse" ? 3 : 5}
      />

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-ember text-sm"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <Button type="submit" variant="gold" size="lg" disabled={status === "sending"}>
          {status === "sending" ? (
            "Enviando…"
          ) : (
            <>
              <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
              Enviar
            </>
          )}
        </Button>
        <p className="text-smoke max-w-xs text-xs leading-relaxed">
          Seus dados vão só para mim. Sem lista, sem disparo em massa.
        </p>
      </div>

      {whatsappUrl && status === "error" && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold hover:text-gold-lit inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
          Enviar pelo WhatsApp
        </a>
      )}
    </form>
  );
}
