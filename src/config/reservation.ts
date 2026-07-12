import type { TimeSlot } from "@/types";

/**
 * Créneaux de réservation proposés.
 *
 * Le Moulin Vert est "ouvert 24h/24" (café + ferme-auberge), mais les
 * réservations de table sont organisées par créneaux pour garder une
 * capacité de service confortable en cuisine et en salle. Cette liste est
 * volontairement statique en Étape 4 ; elle est structurée pour être reprise
 * telle quelle par le dashboard admin (Étape 5), qui permettra de l'éditer
 * depuis Firestore (`settings/timeSlots`).
 */
export const timeSlots: TimeSlot[] = [
  { id: "09:00", label: "09:00", period: "journee" },
  { id: "10:30", label: "10:30", period: "journee" },
  { id: "12:00", label: "12:00", period: "midi" },
  { id: "13:30", label: "13:30", period: "midi" },
  { id: "15:00", label: "15:00", period: "journee" },
  { id: "16:30", label: "16:30", period: "journee" },
  { id: "18:00", label: "18:00", period: "soir" },
  { id: "19:30", label: "19:30", period: "soir" },
  { id: "21:00", label: "21:00", period: "soir" },
  { id: "22:30", label: "22:30", period: "soir" },
];

export const periodLabels: Record<TimeSlot["period"], string> = {
  journee: "Journée",
  midi: "Déjeuner",
  soir: "Dîner",
};

/**
 * Règles métier de la réservation. Regroupées ici pour que la validation
 * (src/lib/validation/reservation.ts), le calcul de disponibilité
 * (src/lib/reservations.ts) et l'UI (ReservationForm) restent synchronisés
 * sur les mêmes limites.
 */
export const reservationSettings = {
  /** Taille minimale d'une table réservable en ligne. */
  minPartySize: 1,
  /** Au-delà, on oriente vers un appel téléphonique (groupes, événements). */
  maxPartySize: 20,
  /** Couverts maximum acceptés simultanément sur un même créneau. */
  maxCapacityPerSlot: 40,
  /** Nombre de jours à l'avance pendant lesquels réserver est possible. */
  bookingWindowDays: 60,
  /** Délai minimum avant un créneau pour qu'il reste réservable. */
  minNoticeHours: 2,
} as const;
