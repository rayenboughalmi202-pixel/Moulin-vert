import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionLoading?: boolean;
}

/**
 * Affiché tant qu'une collection Firestore (menu, galerie, horaires) est
 * vide. Propose de l'initialiser à partir des données déjà présentes dans
 * `src/config/*`, pour ne jamais repartir d'un dashboard totalement vide.
 */
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, actionLoading }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-ink/15 bg-white/40 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-moss/10 text-moss">
        <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <div>
        <h3 className="font-display text-lg italic text-ink">{title}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink/60">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} disabled={actionLoading}>
          {actionLoading ? "Import en cours…" : actionLabel}
        </Button>
      )}
    </div>
  );
}
