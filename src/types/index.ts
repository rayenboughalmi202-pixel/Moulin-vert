export interface NavLink {
  label: string;
  href: string;
}

export interface DaySchedule {
  day: string;
  hours: string;
}

export interface RestaurantHours {
  /** Mention courte affichée dans le header/footer, ex: "Ouvert 24h/24" */
  label: string;
  /** Détail éditable jour par jour depuis le futur dashboard admin */
  schedule: DaySchedule[];
}

export interface RestaurantInfo {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  type: string;
  address: string;
  phone: string;
  phoneHref: string;
  facebook: string;
  facebookLabel: string;
  googleMapsUrl: string;
  hours: RestaurantHours;
  highlights: string[];
  services: string[];
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  context: string;
}

/** Un plat du menu — utilisé à partir de l'Étape 3 (page Menu). */
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  currency: "DT";
  category: "boissons" | "plats";
  description?: string;
  image?: string;
}

/* -------------------------------------------------------------------- */
/*  Réservations — utilisés à partir de l'Étape 4                       */
/* -------------------------------------------------------------------- */

/** Un créneau horaire proposé à la réservation. */
export interface TimeSlot {
  /** Identifiant unique, au format "HH:mm" (ex: "19:30"). */
  id: string;
  /** Libellé affiché, identique à l'id pour l'instant. */
  label: string;
  period: "journee" | "midi" | "soir";
}

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

/** Données saisies par le client dans le formulaire de réservation. */
export interface ReservationInput {
  fullName: string;
  phone: string;
  email?: string;
  /** Date au format ISO "yyyy-MM-dd". */
  date: string;
  /** Référence à `TimeSlot.id`. */
  timeSlot: string;
  partySize: number;
  message?: string;
}

/** Document Firestore tel que stocké dans la collection `reservations`. */
export interface Reservation extends ReservationInput {
  id: string;
  status: ReservationStatus;
  /** Date de création, au format ISO. */
  createdAt: string;
}

/** Disponibilité calculée d'un créneau pour une date donnée. */
export interface SlotAvailability {
  slotId: string;
  bookedCovers: number;
  remaining: number;
  isFull: boolean;
}

/* -------------------------------------------------------------------- */
/*  Dashboard administrateur — utilisés à partir de l'Étape 5            */
/* -------------------------------------------------------------------- */

/** Utilisateur admin authentifié (sous-ensemble de `User` de Firebase Auth). */
export interface AdminUser {
  uid: string;
  email: string | null;
}

/**
 * Plat du menu tel que stocké dans Firestore (collection `menu`) et géré
 * depuis le dashboard admin. Reprend la forme de `MenuItem` en ajoutant
 * un ordre d'affichage éditable.
 */
export interface MenuItemRecord extends MenuItem {
  order: number;
}

/** Photo de la galerie telle que stockée dans Firestore (collection `gallery`). */
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  order: number;
  createdAt: string;
}
