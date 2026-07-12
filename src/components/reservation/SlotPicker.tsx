"use client";

import { cn } from "@/lib/utils";
import { periodLabels, timeSlots } from "@/config/reservation";
import { isSlotBookable } from "@/lib/reservation-utils";
import type { SlotAvailability } from "@/types";

interface SlotPickerProps {
  date: string;
  value: string;
  onChange: (slotId: string) => void;
  availability: Record<string, SlotAvailability> | null;
  isLoading: boolean;
}

const periodOrder: Array<keyof typeof periodLabels> = ["journee", "midi", "soir"];

/**
 * Regroupe les créneaux par moment de la journée et grise ceux qui sont
 * trop proches dans le temps (isSlotBookable) ou déjà complets
 * (availability). La disponibilité est recalculée à chaque changement de
 * date par le parent (ReservationForm), via getSlotAvailability.
 */
export function SlotPicker({ date, value, onChange, availability, isLoading }: SlotPickerProps) {
  return (
    <div className="space-y-5">
      {periodOrder.map((period) => {
        const slotsForPeriod = timeSlots.filter((slot) => slot.period === period);
        if (slotsForPeriod.length === 0) return null;

        return (
          <div key={period}>
            <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-widest text-ink/45">
              {periodLabels[period]}
            </p>
            <div className="flex flex-wrap gap-2">
              {slotsForPeriod.map((slot) => {
                const bookable = date ? isSlotBookable(date, slot.id) : true;
                const slotAvailability = availability?.[slot.id];
                const isFull = Boolean(slotAvailability?.isFull);
                const disabled = !bookable || isFull;
                const isSelected = value === slot.id;

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(slot.id)}
                    aria-pressed={isSelected}
                    title={
                      !bookable
                        ? "Trop proche : choisissez un autre créneau"
                        : isFull
                          ? "Complet à cette date"
                          : undefined
                    }
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
                      isSelected
                        ? "border-wheat bg-wheat text-ink shadow-card"
                        : "border-ink/15 bg-white text-ink/70 hover:border-wheat/60 hover:text-ink",
                      disabled && "cursor-not-allowed border-ink/10 bg-ink/5 text-ink/30 line-through hover:border-ink/10 hover:text-ink/30"
                    )}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {isLoading && <p className="text-sm text-ink/45">Vérification des disponibilités…</p>}
    </div>
  );
}
