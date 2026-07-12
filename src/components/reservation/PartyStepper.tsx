"use client";

import { Minus, Plus, Users } from "lucide-react";
import { reservationSettings } from "@/config/reservation";

interface PartyStepperProps {
  value: number;
  onChange: (value: number) => void;
}

/**
 * Compteur +/- pour le nombre de convives, borné par les réglages métier
 * (config/reservation.ts). Reste utilisable au clavier via les boutons
 * (pas seulement à la souris), important pour l'accessibilité.
 */
export function PartyStepper({ value, onChange }: PartyStepperProps) {
  const { minPartySize, maxPartySize } = reservationSettings;

  const decrement = () => onChange(Math.max(minPartySize, value - 1));
  const increment = () => onChange(Math.min(maxPartySize, value + 1));

  return (
    <div className="flex items-center gap-4 rounded-lg border border-ink/15 bg-white px-4 py-3">
      <Users className="h-5 w-5 shrink-0 text-moss" strokeWidth={1.75} aria-hidden="true" />
      <div className="flex flex-1 items-center justify-between">
        <span className="text-base text-ink/70">
          {value} {value > 1 ? "personnes" : "personne"}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={decrement}
            disabled={value <= minPartySize}
            aria-label="Retirer une personne"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-wheat hover:bg-wheat/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Minus className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={increment}
            disabled={value >= maxPartySize}
            aria-label="Ajouter une personne"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-wheat hover:bg-wheat/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
