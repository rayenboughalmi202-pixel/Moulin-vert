import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine des classes conditionnelles (clsx) et résout les conflits
 * d'utilitaires Tailwind (tailwind-merge). Utilisé dans tous les
 * composants pour garder des variantes de style propres et prévisibles.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formate un prix en dinars tunisiens, ex: 45 -> "45 DT", 3.5 -> "3,5 DT" */
export function formatPrice(price: number, currency: string = "DT") {
  const formatted = Number.isInteger(price) ? String(price) : price.toString().replace(".", ",");
  return `${formatted} ${currency}`;
}
