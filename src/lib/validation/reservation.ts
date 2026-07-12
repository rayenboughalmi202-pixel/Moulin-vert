import { z } from "zod";
import { reservationSettings, timeSlots } from "@/config/reservation";
import { isSlotBookable, maxBookableDateISO, todayISO } from "@/lib/reservation-utils";

/** Numéros tunisiens mobiles/fixes, avec ou sans indicatif +216, espaces tolérés. */
const PHONE_REGEX = /^(\+216\s?)?[2459]\d{1}([ ]?\d{2}){3}$/;

const slotIds = timeSlots.map((slot) => slot.id) as [string, ...string[]];

/**
 * Schéma unique de validation, partagé par le formulaire (retour immédiat
 * à l'utilisateur) et par la fonction `createReservation` (dernier
 * rempart avant écriture Firestore). Les règles numériques (tailles de
 * groupe, fenêtre de réservation) viennent de config/reservation.ts pour
 * ne jamais diverger entre l'UI et la validation.
 */
export const reservationSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Le nom complet doit contenir au moins 3 caractères.")
      .max(80, "80 caractères maximum."),
    phone: z
      .string()
      .trim()
      .regex(PHONE_REGEX, "Numéro tunisien invalide (ex : 92 012 859)."),
    email: z
      .union([z.string().trim().email("Adresse e-mail invalide."), z.literal("")])
      .optional(),
    date: z
      .string()
      .min(1, "Choisissez une date.")
      .refine((value) => value >= todayISO(), "La date ne peut pas être dans le passé.")
      .refine(
        (value) => value <= maxBookableDateISO(),
        `Réservation possible jusqu'à ${reservationSettings.bookingWindowDays} jours à l'avance.`
      ),
    timeSlot: z.enum(slotIds, { errorMap: () => ({ message: "Choisissez un créneau." }) }),
    partySize: z
      .number({ invalid_type_error: "Indiquez un nombre de personnes." })
      .int("Nombre de personnes invalide.")
      .min(reservationSettings.minPartySize, `Minimum ${reservationSettings.minPartySize} personne.`)
      .max(
        reservationSettings.maxPartySize,
        `Pour plus de ${reservationSettings.maxPartySize} personnes, contactez-nous par téléphone.`
      ),
    message: z.string().max(500, "500 caractères maximum.").optional(),
  })
  .refine((data) => isSlotBookable(data.date, data.timeSlot), {
    message: `Ce créneau est trop proche (minimum ${reservationSettings.minNoticeHours} h à l'avance). Choisissez un autre horaire.`,
    path: ["timeSlot"],
  });

export type ReservationFormValues = z.infer<typeof reservationSchema>;

/** Formate les erreurs Zod en dictionnaire { champ: message }, pour un affichage simple sous chaque input. */
export function formatFieldErrors(error: z.ZodError): Partial<Record<keyof ReservationFormValues, string>> {
  const fieldErrors: Partial<Record<keyof ReservationFormValues, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ReservationFormValues | undefined;
    if (key && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}
