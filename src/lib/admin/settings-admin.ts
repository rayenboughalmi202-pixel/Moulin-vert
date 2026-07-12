import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { restaurant } from "@/config/site";
import { timeSlots as staticTimeSlots } from "@/config/reservation";
import type { RestaurantHours, TimeSlot } from "@/types";

const SETTINGS_COLLECTION = "settings";
const HOURS_DOC = "restaurant";
const SLOTS_DOC = "timeSlots";

export class SettingsAdminError extends Error {}

function assertReady() {
  if (!isFirebaseConfigured) {
    throw new SettingsAdminError("Firebase n'est pas configuré.");
  }
}

/**
 * Écoute en temps réel les horaires publics du restaurant, stockés dans
 * `settings/restaurant`. Tant que le document n'existe pas encore, on
 * retombe sur les horaires statiques de `config/site.ts` pour que le
 * dashboard affiche toujours quelque chose de cohérent.
 */
export function subscribeRestaurantHours(
  onChange: (hours: RestaurantHours) => void,
  onError?: (message: string) => void
): () => void {
  if (!isFirebaseConfigured) {
    onChange(restaurant.hours);
    return () => {};
  }

  return onSnapshot(
    doc(db, SETTINGS_COLLECTION, HOURS_DOC),
    (snapshot) => {
      const data = snapshot.data();
      if (!data) {
        onChange(restaurant.hours);
        return;
      }
      onChange({
        label: String(data.label ?? restaurant.hours.label),
        schedule: Array.isArray(data.schedule) ? (data.schedule as RestaurantHours["schedule"]) : [],
      });
    },
    () => onError?.("Impossible de charger les horaires.")
  );
}

/** Enregistre les horaires publics du restaurant. */
export async function updateRestaurantHours(hours: RestaurantHours): Promise<void> {
  assertReady();
  try {
    await setDoc(doc(db, SETTINGS_COLLECTION, HOURS_DOC), hours);
  } catch {
    throw new SettingsAdminError("Les horaires n'ont pas pu être enregistrés.");
  }
}

/** Écoute en temps réel les créneaux de réservation. */
export function subscribeTimeSlots(
  onChange: (slots: TimeSlot[]) => void,
  onError?: (message: string) => void
): () => void {
  if (!isFirebaseConfigured) {
    onChange(staticTimeSlots);
    return () => {};
  }

  return onSnapshot(
    doc(db, SETTINGS_COLLECTION, SLOTS_DOC),
    (snapshot) => {
      const data = snapshot.data();
      const slots = data && Array.isArray(data.slots) ? (data.slots as TimeSlot[]) : staticTimeSlots;
      onChange(slots);
    },
    () => onError?.("Impossible de charger les créneaux.")
  );
}

/** Enregistre la liste complète des créneaux de réservation proposés. */
export async function updateTimeSlots(slots: TimeSlot[]): Promise<void> {
  assertReady();
  try {
    await setDoc(doc(db, SETTINGS_COLLECTION, SLOTS_DOC), { slots });
  } catch {
    throw new SettingsAdminError("Les créneaux n'ont pas pu être enregistrés.");
  }
}

/** Indique si `settings/restaurant` existe déjà (pour proposer l'import une seule fois). */
export async function restaurantHoursDocExists(): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  const snapshot = await getDoc(doc(db, SETTINGS_COLLECTION, HOURS_DOC));
  return snapshot.exists();
}

/** Indique si `settings/timeSlots` existe déjà (pour proposer l'import une seule fois). */
export async function timeSlotsDocExists(): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  const snapshot = await getDoc(doc(db, SETTINGS_COLLECTION, SLOTS_DOC));
  return snapshot.exists();
}
