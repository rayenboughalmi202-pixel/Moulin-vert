import { cn } from "@/lib/utils";
import type { ReservationStatus } from "@/types";

const statusStyles: Record<ReservationStatus, string> = {
  pending: "bg-wheat/25 text-wheat-dark",
  confirmed: "bg-moss/15 text-moss-dark",
  cancelled: "bg-rust/15 text-rust-dark",
};

const statusLabels: Record<ReservationStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
};

export function StatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
