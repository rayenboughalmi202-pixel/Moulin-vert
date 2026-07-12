"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, PhoneCall, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField, fieldStyles } from "@/components/reservation/FormField";
import { PartyStepper } from "@/components/reservation/PartyStepper";
import { SlotPicker } from "@/components/reservation/SlotPicker";
import { timeSlots } from "@/config/reservation";
import { restaurant } from "@/config/site";
import { maxBookableDateISO, todayISO } from "@/lib/reservation-utils";
import { ReservationServiceError, createReservation, getSlotAvailability } from "@/lib/reservations";
import { formatFieldErrors, reservationSchema } from "@/lib/validation/reservation";
import type { SlotAvailability } from "@/types";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * État "brut" du formulaire, tel que tapé par l'utilisateur. Volontairement
 * plus permissif que `ReservationFormValues` (ex : `timeSlot` reste une
 * simple chaîne ici, pas l'union stricte des créneaux) : la validation
 * stricte n'intervient qu'au submit, via `reservationSchema.safeParse`.
 */
interface FormState {
  fullName: string;
  phone: string;
  email: string;
  date: string;
  timeSlot: string;
  partySize: number;
  message: string;
}

const initialValues: FormState = {
  fullName: "",
  phone: "",
  email: "",
  date: "",
  timeSlot: "",
  partySize: 2,
  message: "",
};

export function ReservationForm() {
  const [values, setValues] = useState<FormState>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [availability, setAvailability] = useState<Record<string, SlotAvailability> | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const minDate = todayISO();
  const maxDate = useMemo(() => maxBookableDateISO(), []);

  // Recalcule les créneaux complets à chaque changement de date, pour
  // griser immédiatement les horaires déjà pleins avant la sélection.
  useEffect(() => {
    if (!values.date) {
      setAvailability(null);
      return;
    }
    let cancelled = false;
    setIsCheckingAvailability(true);
    getSlotAvailability(values.date)
      .then((result) => {
        if (!cancelled) setAvailability(result);
      })
      .finally(() => {
        if (!cancelled) setIsCheckingAvailability(false);
      });
    return () => {
      cancelled = true;
    };
  }, [values.date]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function resetForm() {
    setValues(initialValues);
    setErrors({});
    setStatus("idle");
    setStatusMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = reservationSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(formatFieldErrors(parsed.error));
      const firstError = parsed.error.issues[0];
      setStatus("error");
      setStatusMessage(firstError?.message ?? "Merci de corriger les champs indiqués.");
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    try {
      await createReservation(parsed.data);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof ReservationServiceError
          ? error.message
          : "Une erreur inattendue est survenue. Merci de réessayer ou de nous appeler."
      );
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-start gap-4 rounded-xl border border-moss/20 bg-moss/5 p-8"
      >
        <CheckCircle2 className="h-10 w-10 text-moss" strokeWidth={1.5} aria-hidden="true" />
        <div>
          <h3 className="font-display text-xl italic text-ink">Demande envoyée avec succès</h3>
          <p className="mt-2 max-w-md text-ink/70">
            Merci {values.fullName.split(" ")[0]} ! Votre demande de réservation pour{" "}
            {values.partySize} {values.partySize > 1 ? "personnes" : "personne"} le {values.date} à{" "}
            {values.timeSlot} a bien été reçue. Notre équipe vous confirmera par téléphone très
            prochainement.
          </p>
        </div>
        <Button variant="outline" onClick={resetForm}>
          Faire une nouvelle demande
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Date" htmlFor="date" required error={errors.date}>
          <input
            id="date"
            type="date"
            min={minDate}
            max={maxDate}
            value={values.date}
            onChange={(event) => updateField("date", event.target.value)}
            className={fieldStyles(Boolean(errors.date))}
          />
        </FormField>

        <FormField label="Nombre de personnes" htmlFor="partySize" required error={errors.partySize}>
          <PartyStepper value={values.partySize} onChange={(value) => updateField("partySize", value)} />
        </FormField>
      </div>

      <FormField
        label="Créneau horaire"
        htmlFor="timeSlot"
        required
        error={errors.timeSlot}
        hint={!values.date ? "Choisissez d'abord une date." : undefined}
      >
        {values.date ? (
          <SlotPicker
            date={values.date}
            value={values.timeSlot}
            onChange={(slotId) => updateField("timeSlot", slotId)}
            availability={availability}
            isLoading={isCheckingAvailability}
          />
        ) : (
          <div className="flex flex-wrap gap-2 opacity-40">
            {timeSlots.slice(0, 4).map((slot) => (
              <span key={slot.id} className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm">
                {slot.label}
              </span>
            ))}
          </div>
        )}
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Nom complet" htmlFor="fullName" required error={errors.fullName}>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Votre nom et prénom"
            value={values.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            className={fieldStyles(Boolean(errors.fullName))}
          />
        </FormField>

        <FormField label="Téléphone" htmlFor="phone" required error={errors.phone}>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="92 012 859"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className={fieldStyles(Boolean(errors.phone))}
          />
        </FormField>
      </div>

      <FormField label="E-mail (optionnel)" htmlFor="email" error={errors.email}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="vous@exemple.com"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          className={fieldStyles(Boolean(errors.email))}
        />
      </FormField>

      <FormField
        label="Message (optionnel)"
        htmlFor="message"
        error={errors.message}
        hint="Allergie, occasion spéciale, table en extérieur..."
      >
        <textarea
          id="message"
          rows={4}
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          className={fieldStyles(Boolean(errors.message))}
        />
      </FormField>

      <AnimatePresence>
        {status === "error" && statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-rust/30 bg-rust/5 p-4 text-sm text-rust"
          >
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            <div>
              <p>{statusMessage}</p>
              <a
                href={restaurant.phoneHref}
                className="mt-2 inline-flex items-center gap-2 font-semibold underline underline-offset-2"
              >
                <PhoneCall className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                Nous appeler : {restaurant.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto">
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden="true" />
            Envoi en cours…
          </>
        ) : (
          "Confirmer la demande de réservation"
        )}
      </Button>
    </form>
  );
}
