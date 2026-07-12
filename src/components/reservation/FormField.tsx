import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Enveloppe label + champ + erreur, utilisée pour tous les inputs du
 * formulaire de réservation afin de garder un espacement et un traitement
 * d'erreur identiques partout (nom, téléphone, e-mail, message...).
 */
export function FormField({ label, htmlFor, error, hint, required, children, className }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-1 text-rust">*</span>}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-sm text-rust">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-ink/50">{hint}</p>
      ) : null}
    </div>
  );
}

/** Classes Tailwind communes aux inputs / textarea / select du formulaire. */
export const fieldStyles = (hasError?: boolean) =>
  cn(
    "w-full rounded-lg border bg-white px-4 py-3 text-base text-ink placeholder:text-ink/35 transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-wheat/50",
    hasError ? "border-rust/60" : "border-ink/15 focus:border-wheat"
  );
