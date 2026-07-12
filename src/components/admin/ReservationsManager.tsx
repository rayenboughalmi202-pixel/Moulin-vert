"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Phone, Trash2, X } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import {
  deleteReservation,
  subscribeReservations,
  updateReservationStatus,
} from "@/lib/admin/reservations-admin";
import { periodLabels, timeSlots } from "@/config/reservation";
import { cn } from "@/lib/utils";
import type { Reservation, ReservationStatus } from "@/types";

type StatusFilter = "all" | ReservationStatus;

const filterOptions: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "pending", label: "En attente" },
  { id: "confirmed", label: "Confirmées" },
  { id: "cancelled", label: "Annulées" },
];

function slotPeriodLabel(slotId: string): string {
  const slot = timeSlots.find((candidate) => candidate.id === slotId);
  return slot ? periodLabels[slot.period] : "";
}

function formatDateFR(iso: string): string {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

export function ReservationsManager() {
  const { notify } = useToast();
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Reservation | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeReservations(
      (next) => setReservations(next),
      (message) => notify("error", message)
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!reservations) return [];
    if (filter === "all") return reservations;
    return reservations.filter((reservation) => reservation.status === filter);
  }, [reservations, filter]);

  async function handleStatusChange(reservation: Reservation, status: ReservationStatus) {
    setPendingActionId(reservation.id);
    try {
      await updateReservationStatus(reservation.id, status);
      notify("success", status === "confirmed" ? "Réservation confirmée." : "Réservation annulée.");
    } catch {
      notify("error", "Le statut n'a pas pu être mis à jour.");
    } finally {
      setPendingActionId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    setPendingActionId(target.id);
    try {
      await deleteReservation(target.id);
      notify("success", "Réservation supprimée.");
    } catch {
      notify("error", "La réservation n'a pas pu être supprimée.");
    } finally {
      setPendingActionId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFilter(option.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              filter === option.id ? "bg-moss text-linen" : "bg-white/60 text-ink/60 hover:text-ink"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white/60">
        {reservations === null ? (
          <div className="flex items-center justify-center gap-2 py-16 text-ink/50">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Chargement des réservations…
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-ink/50">
            Aucune réservation {filter !== "all" ? "dans cette catégorie" : "pour le moment"}.
          </p>
        ) : (
          <ul className="divide-y divide-ink/10">
            {filtered.map((reservation) => (
              <li key={reservation.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-display text-lg italic text-ink">{reservation.fullName}</p>
                    <StatusBadge status={reservation.status} />
                  </div>
                  <p className="mt-1 text-sm text-ink/60">
                    {formatDateFR(reservation.date)} à {reservation.timeSlot}
                    {" · "}
                    {slotPeriodLabel(reservation.timeSlot)}
                    {" · "}
                    {reservation.partySize} pers.
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink/50">
                    <a href={`tel:${reservation.phone}`} className="flex items-center gap-1.5 hover:text-ink">
                      <Phone className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                      {reservation.phone}
                    </a>
                    {reservation.email && <span>{reservation.email}</span>}
                  </div>
                  {reservation.message && (
                    <p className="mt-2 text-sm italic text-ink/60">« {reservation.message} »</p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {pendingActionId === reservation.id ? (
                    <Loader2 className="h-5 w-5 animate-spin text-ink/40" aria-hidden="true" />
                  ) : (
                    <>
                      {reservation.status !== "confirmed" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(reservation, "confirmed")}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-moss/10 text-moss transition-colors hover:bg-moss hover:text-linen"
                          aria-label="Confirmer la réservation"
                          title="Confirmer"
                        >
                          <Check className="h-4 w-4" strokeWidth={2} />
                        </button>
                      )}
                      {reservation.status !== "cancelled" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(reservation, "cancelled")}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-rust/10 text-rust transition-colors hover:bg-rust hover:text-linen"
                          aria-label="Annuler la réservation"
                          title="Annuler"
                        >
                          <X className="h-4 w-4" strokeWidth={2} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(reservation)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
                        aria-label="Supprimer la réservation"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Supprimer cette réservation ?"
        description={`La réservation de ${deleteTarget?.fullName ?? ""} sera définitivement supprimée.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
