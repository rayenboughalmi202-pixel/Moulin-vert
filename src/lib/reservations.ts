import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { reservationSettings, timeSlots } from "@/config/reservation";
import type { ReservationFormValues } from "@/lib/validation/reservation";
import type { SlotAvailability } from "@/types";

export const RESERVATIONS_COLLECTION = "reservations";

/**
 * Erreur levée quand Firebase n'est pas encore configuré (pas de
 * ".env.local", voir .env.local.example) ou quand Firestore refuse
 * l'opération. Le formulaire l'attrape pour afficher un message clair et
 * proposer l'appel téléphonique en repli.
 */
export class ReservationServiceError extends Error {}

function assertFirebaseReady() {
  if (!isFirebaseConfigured) {
    throw new ReservationServiceError(
      "La réservation en ligne est en cours de configuration. Merci de nous appeler directement pour réserver."
    );
  }
}

/**
 * Additionne les couverts déjà réservés pour une date donnée, regroupés par
 * créneau (les réservations annulées ne comptent pas), puis calcule la
 * capacité restante de chaque créneau. Utilisé pour griser les créneaux
 * complets avant même que le client ne clique dessus.
 */
export async function getSlotAvailability(date: string): Promise<Record<string, SlotAvailability>> {
  const baseline: Record<string, SlotAvailability> = {};
  for (const slot of timeSlots) {
    baseline[slot.id] = {
      slotId: slot.id,
      bookedCovers: 0,
      remaining: reservationSettings.maxCapacityPerSlot,
      isFull: false,
    };
  }

  if (!isFirebaseConfigured || !date) {
    return baseline;
  }

  try {
    const reservationsQuery = query(collection(db, RESERVATIONS_COLLECTION), where("date", "==", date));
    const snapshot = await getDocs(reservationsQuery);

    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data() as { timeSlot?: string; partySize?: number; status?: string };
      if (!data.timeSlot || data.status === "cancelled") return;
      const entry = baseline[data.timeSlot];
      if (!entry) return;
      entry.bookedCovers += data.partySize ?? 0;
    });

    for (const entry of Object.values(baseline)) {
      entry.remaining = Math.max(0, reservationSettings.maxCapacityPerSlot - entry.bookedCovers);
      entry.isFull = entry.remaining <= 0;
    }

    return baseline;
  } catch {
    // En cas d'erreur réseau/permissions, on renvoie une disponibilité
    // "optimiste" plutôt que de bloquer tout le formulaire : la vérification
    // finale de capacité reste de toute façon faite côté Firestore Rules /
    // futur traitement admin (Étape 5).
    return baseline;
  }
}

/** Crée une réservation dans Firestore, statut initial "pending" (à confirmer par le restaurant). */
export async function createReservation(values: ReservationFormValues): Promise<{ id: string }> {
  assertFirebaseReady();

  try {
    const docRef = await addDoc(collection(db, RESERVATIONS_COLLECTION), {
      fullName: values.fullName.trim(),
      phone: values.phone.trim(),
      email: values.email?.trim() || null,
      date: values.date,
      timeSlot: values.timeSlot,
      partySize: values.partySize,
      message: values.message?.trim() || null,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id };
  } catch (error) {
    if (error instanceof ReservationServiceError) throw error;
    throw new ReservationServiceError(
      "La réservation n'a pas pu être envoyée. Vérifiez votre connexion ou appelez-nous directement."
    );
  }
}
