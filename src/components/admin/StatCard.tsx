import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone?: "default" | "warning";
  className?: string;
}

/** Carte compacte utilisée en grille sur la page d'accueil du dashboard. */
export function StatCard({ icon: Icon, label, value, tone = "default", className }: StatCardProps) {
  return (
    <div className={cn("rounded-2xl border border-ink/10 bg-white/60 p-6", className)}>
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          tone === "warning" ? "bg-wheat/25 text-wheat-dark" : "bg-moss/10 text-moss"
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <p className="mt-4 text-3xl font-display italic">{value}</p>
      <p className="mt-1 text-sm text-ink/60">{label}</p>
    </div>
  );
}
