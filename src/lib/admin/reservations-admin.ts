import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { RESERVATIONS_COLLECTION } from "@/lib/reservations";
import type { Reservation, ReservationStatus } from "@/types";

/** Erreur levée par les opérations admin sur les réservations. */
export class ReservationsAdminError extends Error {}

/**
 * Convertit un document Firestore en `Reservation`. `createdAt` peut être
 * un `Timestamp` serveur (cas normal) ou, transitoirement, une valeur
 * absente juste après l'écriture optimiste côté client — on retombe alors
 * sur la date du jour plutôt que de planter l'affichage.
 */
function fromDoc(id: string, data: Record<string, unknown>): Reservation {
  const createdAt = data.createdAt;
  const createdAtISO =
    createdAt instanceof Timestamp ? createdAt.toDate().toISOString() : new Date().toISOString();

  return {
    id,
    fullName: String(data.fullName ?? ""),
    phone: String(data.phone ?? ""),
    email: typeof data.email === "string" ? data.email : undefined,
    date: String(data.date ?? ""),
    timeSlot: String(data.timeSlot ?? ""),
    partySize: Number(data.partySize ?? 0),
    message: typeof data.message === "string" ? data.message : undefined,
    status: (data.status as ReservationStatus) ?? "pending",
    createdAt: createdAtISO,
  };
}

/**
 * Écoute en temps réel l'ensemble des réservations (les plus récentes en
 * premier). Utilisé à la fois par la page `/admin/reservations` et par le
 * badge de notifications du dashboard, qui n'a besoin que du décompte des
 * réservations `pending`.
 */
export function subscribeReservations(
  onChange: (reservations: Reservation[]) => void,
  onError?: (message: string) => void
): () => void {
  if (!isFirebaseConfigured) {
    onChange([]);
    return () => {};
  }

  const reservationsQuery = query(collection(db, RESERVATIONS_COLLECTION), orderBy("createdAt", "desc"));

  return onSnapshot(
    reservationsQuery,
    (snapshot) => {
      const reservations = snapshot.docs.map((docSnapshot) => fromDoc(docSnapshot.id, docSnapshot.data()));
      onChange(reservations);
    },
    () => {
      onError?.(
        "Impossible de charger les réservations. Vérifiez votre connexion ou vos droits d'accès."
      );
    }
  );
}

/** Met à jour le statut d'une réservation (confirmation ou annulation). */
export async function updateReservationStatus(id: string, status: ReservationStatus): Promise<void> {
  if (!isFirebaseConfigured) {
    throw new ReservationsAdminError("Firebase n'est pas configuré.");
  }
  try {
    await updateDoc(doc(db, RESERVATIONS_COLLECTION, id), { status });
  } catch {
    throw new ReservationsAdminError("Le statut n'a pas pu être mis à jour.");
  }
}

/** Supprime définitivement une réservation (ex : doublon, test, spam). */
export async function deleteReservation(id: string): Promise<void> {
  if (!isFirebaseConfigured) {
    throw new ReservationsAdminError("Firebase n'est pas configuré.");
  }
  try {
    await deleteDoc(doc(db, RESERVATIONS_COLLECTION, id));
  } catch {
    throw new ReservationsAdminError("La réservation n'a pas pu être supprimée.");
  }
}
