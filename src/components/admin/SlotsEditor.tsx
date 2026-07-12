"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fieldStyles } from "@/components/reservation/FormField";
import { useToast } from "@/context/ToastContext";
import { subscribeTimeSlots, updateTimeSlots } from "@/lib/admin/settings-admin";
import { periodLabels } from "@/config/reservation";
import { cn } from "@/lib/utils";
import type { TimeSlot } from "@/types";

const periodOptions: TimeSlot["period"][] = ["journee", "midi", "soir"];

/**
 * Édite la liste des créneaux proposés dans le formulaire de réservation
 * public. Un créneau = une heure (`HH:mm`) rattachée à une période, utilisée
 * pour le regroupement visuel (Journée / Déjeuner / Dîner).
 */
export function SlotsEditor() {
  const { notify } = useToast();
  const [slots, setSlots] = useState<TimeSlot[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeTimeSlots(
      (next) => setSlots(next),
      (message) => notify("error", message)
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateSlot(index: number, patch: Partial<TimeSlot>) {
    if (!slots) return;
    setSlots(slots.map((slot, slotIndex) => (slotIndex === index ? { ...slot, ...patch } : slot)));
  }

  function addSlot() {
    if (!slots) return;
    setSlots([...slots, { id: "", label: "", period: "soir" }]);
  }

  function removeSlot(index: number) {
    if (!slots) return;
    setSlots(slots.filter((_, slotIndex) => slotIndex !== index));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!slots) return;

    const normalized = slots
      .filter((slot) => slot.id.trim())
      .map((slot) => ({ ...slot, label: slot.label.trim() || slot.id.trim() }));

    const ids = normalized.map((slot) => slot.id.trim());
    if (new Set(ids).size !== ids.length) {
      notify("error", "Deux créneaux ne peuvent pas avoir le même horaire.");
      return;
    }

    setIsSaving(true);
    try {
      await updateTimeSlots(normalized);
      setSlots(normalized);
      notify("success", "Créneaux mis à jour.");
    } catch {
      notify("error", "Les créneaux n'ont pas pu être enregistrés.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!slots) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-white/60 py-16 text-ink/50">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        Chargement des créneaux…
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-ink/10 bg-white/60 p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">Créneaux proposés à la réservation</p>
        <button
          type="button"
          onClick={addSlot}
          className="flex items-center gap-1.5 text-sm font-medium text-moss hover:opacity-70"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Ajouter un créneau
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {slots.map((slot, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="time"
              value={slot.id}
              onChange={(event) => updateSlot(index, { id: event.target.value, label: event.target.value })}
              className={cn(fieldStyles(), "w-32 shrink-0")}
              required
            />
            <select
              value={slot.period}
              onChange={(event) => updateSlot(index, { period: event.target.value as TimeSlot["period"] })}
              className={cn(fieldStyles(), "appearance-none")}
            >
              {periodOptions.map((period) => (
                <option key={period} value={period}>
                  {periodLabels[period]}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeSlot(index)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-rust/10 hover:text-rust"
              aria-label="Supprimer ce créneau"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        ))}
        {slots.length === 0 && <p className="text-sm text-ink/50">Aucun créneau — le formulaire public n&apos;en proposera aucun.</p>}
      </div>

      <div className="mt-8 flex justify-end">
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? "Enregistrement…" : "Enregistrer les créneaux"}
        </Button>
      </div>
    </form>
  );
}
