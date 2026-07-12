import type { MenuItem } from "@/types";

/**
 * Carte du restaurant. Statique pour l'Étape 3 — à partir de l'Étape 5,
 * le dashboard admin lira/écrira ces mêmes champs depuis la collection
 * Firestore `menu`, d'où la forme déjà pensée en `MenuItem[]`.
 */
export const menuItems: MenuItem[] = [
  // Boissons & Thés
  { id: "eau-minerale", name: "Eau Minérale", price: 2.5, currency: "DT", category: "boissons" },
  { id: "boissons-gazeuses", name: "Boissons Gazeuses", price: 3, currency: "DT", category: "boissons" },
  { id: "citronnade", name: "Citronnade", price: 4, currency: "DT", category: "boissons" },
  { id: "jus-de-fraise", name: "Jus de Fraise", price: 7, currency: "DT", category: "boissons" },
  { id: "the-vert", name: "Thé Vert", price: 3, currency: "DT", category: "boissons" },
  { id: "the-aux-amandes", name: "Thé aux Amandes", price: 7, currency: "DT", category: "boissons" },
  { id: "the-aux-noisettes", name: "Thé aux Noisettes", price: 10, currency: "DT", category: "boissons" },
  { id: "cafe-turc", name: "Café Turc", price: 3.5, currency: "DT", category: "boissons" },

  // Plats Principaux
  { id: "ftat", name: "Ftat", price: 45, currency: "DT", category: "plats" },
  { id: "berzguen", name: "Berzguen", price: 50, currency: "DT", category: "plats" },
  { id: "grillade-mixte", name: "Grillade Mixte", price: 35, currency: "DT", category: "plats" },
  { id: "foie-allaouche", name: "Foie Allaouche", price: 35, currency: "DT", category: "plats" },
  { id: "merguez-el-moulin", name: "Merguez El Moulin", price: 25, currency: "DT", category: "plats" },
  { id: "escalope-grillee", name: "Escalope Grillée", price: 20, currency: "DT", category: "plats" },
  { id: "escalope-panee", name: "Escalope Panée", price: 20, currency: "DT", category: "plats" },
  { id: "rafissa-bajiya", name: "Rafissa Bajiya", price: 7, currency: "DT", category: "plats" },
  { id: "abrigot-mabesss", name: "Abrigot Mabesss", price: 4, currency: "DT", category: "plats" },
];

export const menuCategories = [
  { id: "plats", label: "Plats Principaux" },
  { id: "boissons", label: "Boissons & Thés" },
] as const;
