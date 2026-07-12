import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}

/**
 * En-tête de section réutilisé partout : un eyebrow tracé large en
 * majuscules (même traitement que le Footer), puis un titre en Fraunces.
 * Garde la hiérarchie typographique identique d'une section à l'autre.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p
        className={cn(
          "text-[0.7rem] font-semibold uppercase tracking-widest",
          tone === "dark" ? "text-moss" : "text-wheat/90"
        )}
      >
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-display-md italic text-balance">{title}</h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            tone === "dark" ? "text-ink/70" : "text-linen/75"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
