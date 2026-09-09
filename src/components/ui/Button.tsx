import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "gold" | "ghost" | "quiet";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden " +
  "font-mono uppercase tracking-[0.18em] whitespace-nowrap select-none " +
  "transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold " +
  "disabled:pointer-events-none disabled:opacity-40";

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[10px]",
  md: "h-12 px-6 text-[11px]",
  lg: "h-14 px-9 text-xs",
};

const variants: Record<Variant, string> = {
  // Ouro sólido: usado uma vez por tela, no ato principal.
  gold: "bg-gold text-noir hover:bg-gold-lit rounded-full font-medium",
  // Contorno: o ouro entra por baixo no hover.
  ghost:
    "rounded-full border border-smoke/60 text-mist hover:text-noir hover:border-gold " +
    "before:absolute before:inset-0 before:-z-0 before:translate-y-full before:bg-gold " +
    "before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.16,1,0.3,1)] " +
    "hover:before:translate-y-0",
  // Sem caixa: para ações terciárias.
  quiet: "text-ash hover:text-gold px-0",
};

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Mostra a seta diagonal que desliza no hover */
  arrow?: boolean;
}

function Inner({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
        {arrow && (
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
            strokeWidth={1.5}
          />
        )}
      </span>
      {/* Brilho que varre a superfície uma vez no hover */}
      <span
        aria-hidden
        className="absolute inset-0 z-[5] -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-full"
      />
    </>
  );
}

export function Button({
  variant = "gold",
  size = "md",
  className,
  children,
  arrow,
  ...props
}: ButtonBaseProps & Omit<ComponentProps<"button">, "children" | "className">) {
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...props}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
}

export function ButtonLink({
  variant = "gold",
  size = "md",
  className,
  children,
  arrow,
  href,
  ...props
}: ButtonBaseProps & { href: string } & Omit<ComponentProps<typeof Link>, "children" | "className" | "href">) {
  const external = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, sizes[size], variants[variant], className)}
      >
        <Inner arrow={arrow}>{children}</Inner>
      </a>
    );
  }

  return (
    <Link href={href} className={cn(base, sizes[size], variants[variant], className)} {...props}>
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  );
}

/** Link de texto com sublinhado que cresce da esquerda. */
export function UnderLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/u text-mist hover:text-gold relative inline-block transition-colors duration-400",
        className,
      )}
    >
      {children}
      <span className="bg-gold absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/u:origin-left group-hover/u:scale-x-100" />
    </Link>
  );
}
