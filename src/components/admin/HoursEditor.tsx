"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { FormField, fieldStyles } from "@/components/reservation/FormField";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { subscribeRestaurantHours, updateRestaurantHours } from "@/lib/admin/settings-admin";
import type { DaySchedule, RestaurantHours } from "@/types";

/**
 * Édite les horaires affichés publiquement (Navbar, Footer, page
 * Réservation) : la mention courte (« Ouvert 24h/24 ») et le détail
 * jour par jour utilisé dans le pied de page.
 */
export function HoursEditor() {
  const { notify } = useToast();
  const [hours, setHours] = useState<RestaurantHours | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeRestaurantHours(
      (next) => setHours(next),
      (message) => notify("error", message)
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateDay(index: number, patch: Partial<DaySchedule>) {
    if (!hours) return;
    const schedule = hours.schedule.map((entry, entryIndex) =>
      entryIndex === index ? { ...entry, ...patch } : entry
    );
    setHours({ ...hours, schedule });
  }

  function addDay() {
    if (!hours) return;
    setHours({ ...hours, schedule: [...hours.schedule, { day: "", hours: "" }] });
  }

  function removeDay(index: number) {
    if (!hours) return;
    setHours({ ...hours, schedule: hours.schedule.filter((_, entryIndex) => entryIndex !== index) });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!hours) return;
    setIsSaving(true);
    try {
      await updateRestaurantHours(hours);
      notify("success", "Horaires mis à jour.");
    } catch {
      notify("error", "Les horaires n'ont pas pu être enregistrés.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!hours) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-white/60 py-16 text-ink/50">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        Chargement des horaires…
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-ink/10 bg-white/60 p-6 sm:p-8">
      <FormField
        label="Mention courte"
        htmlFor="hours-label"
        hint="Affichée dans le header et le footer (ex : « Ouvert 24h/24 »)"
        required
      >
        <input
          id="hours-label"
          value={hours.label}
          onChange={(event) => setHours({ ...hours, label: event.target.value })}
          className={fieldStyles()}
        />
      </FormField>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">Détail jour par jour</p>
          <button
            type="button"
            onClick={addDay}
            className="flex items-center gap-1.5 text-sm font-medium text-moss hover:opacity-70"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Ajouter une ligne
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {hours.schedule.map((entry, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                value={entry.day}
                onChange={(event) => updateDay(index, { day: event.target.value })}
                className={fieldStyles()}
                placeholder="Ex : Lundi — Dimanche"
              />
              <input
                value={entry.hours}
                onChange={(event) => updateDay(index, { hours: event.target.value })}
                className={fieldStyles()}
                placeholder="Ex : Ouvert 24h/24"
              />
              <button
                type="button"
                onClick={() => removeDay(index)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-rust/10 hover:text-rust"
                aria-label="Supprimer cette ligne"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          ))}
          {hours.schedule.length === 0 && (
            <p className="text-sm text-ink/50">Aucune ligne — ajoutez au moins un horaire détaillé.</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? "Enregistrement…" : "Enregistrer les horaires"}
        </Button>
      </div>
    </form>
  );
}
