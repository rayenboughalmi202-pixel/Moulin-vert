import { reservationSettings, timeSlots } from "@/config/reservation";

/** Date du jour au format ISO "yyyy-MM-dd", en heure locale. */
export function todayISO(): string {
  return toISODate(new Date());
}

/** Dernière date réservable (aujourd'hui + fenêtre de réservation), format ISO. */
export function maxBookableDateISO(): string {
  const date = new Date();
  date.setDate(date.getDate() + reservationSettings.bookingWindowDays);
  return toISODate(date);
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Combine une date ISO et un identifiant de créneau ("HH:mm") en objet Date locale. */
export function combineDateAndSlot(date: string, slotId: string): Date {
  return new Date(`${date}T${slotId}:00`);
}

/**
 * Un créneau reste réservable tant qu'il commence à au moins
 * `minNoticeHours` heures dans le futur — évite qu'un client réserve une
 * table dans 10 minutes alors que la cuisine n'a pas le temps de se
 * préparer.
 */
export function isSlotBookable(date: string, slotId: string): boolean {
  if (!date || !slotId) return false;
  const target = combineDateAndSlot(date, slotId);
  if (Number.isNaN(target.getTime())) return false;
  const minAllowed = Date.now() + reservationSettings.minNoticeHours * 60 * 60 * 1000;
  return target.getTime() >= minAllowed;
}

/** Liste des créneaux encore réservables pour une date donnée (avant vérification de capacité). */
export function bookableSlotsForDate(date: string) {
  if (!date) return [];
  return timeSlots.filter((slot) => isSlotBookable(date, slot.id));
}
