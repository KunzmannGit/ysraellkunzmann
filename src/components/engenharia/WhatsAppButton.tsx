import { MessageCircle } from "lucide-react";
import { waEng, type OrigemWhatsApp } from "@/lib/engenharia";
import { cn } from "@/lib/utils";

/**
 * O botão que importa nesta página. Verde do WhatsApp de propósito:
 * quem chega por anúncio reconhece a cor antes de ler o texto.
 * `data-cta` deixa cada botão rastreável no GTM sem mexer no código.
 */
export function WhatsAppButton({
  origem,
  children = "Falar no WhatsApp",
  size = "lg",
  className,
}: {
  origem: OrigemWhatsApp;
  children?: React.ReactNode;
  size?: "sm" | "lg";
  className?: string;
}) {
  return (
    <a
      href={waEng(origem)}
      target="_blank"
      rel="noopener noreferrer"
      data-cta={`whatsapp-${origem}`}
      className={cn(
        "group bg-wa hover:bg-wa-lit relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl font-semibold text-[#04210f] transition-all duration-300",
        "shadow-[0_0_0_1px_rgb(37_211_102/0.35),0_12px_40px_-12px_rgb(37_211_102/0.55)] hover:-translate-y-0.5",
        size === "lg" ? "h-14 px-7 text-base" : "h-10 px-4 text-sm",
        className,
      )}
    >
      <MessageCircle className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} strokeWidth={2.2} />
      <span>{children}</span>
      {/* Brilho que atravessa o botão no hover */}
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />
    </a>
  );
}
