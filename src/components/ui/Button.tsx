import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";

const variantStyles: Record<Variant, string> = {
  primary: "bg-wheat text-ink hover:bg-wheat-light shadow-card",
  outline: "border border-current/30 text-inherit hover:border-current/60 hover:bg-current/5",
  ghost: "text-inherit hover:opacity-70",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 ease-organic focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wheat";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  /** Si fourni, le bouton est rendu comme un lien (interne ou externe). */
  href?: string;
  /** Ouvre le lien dans un nouvel onglet (pages Facebook, Google Maps...). */
  external?: boolean;
}

/**
 * Bouton unique pour tout le site : même forme (pilule), même échelle de
 * tap-target, pour que "Réserver" garde le même poids visuel partout où
 * il apparaît (Navbar, Hero, Footer, page Réservation).
 */
export function Button({
  variant = "primary",
  className,
  children,
  href,
  external,
  type,
  ...rest
}: ButtonProps) {
  const styles = cn(baseStyles, variantStyles[variant], className);

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={styles}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} className={styles} {...rest}>
      {children}
    </button>
  );
}
