import type { NavLink, RestaurantInfo } from "@/types";

/**
 * Source unique de vérité pour les informations du restaurant.
 *
 * En Étape 1, ces valeurs sont statiques et centralisées ici pour que
 * l'ensemble du site (Navbar, Footer, pages, métadonnées SEO) s'appuie
 * sur les mêmes données. À partir de l'Étape 5, le dashboard administrateur
 * lira/écrira ces mêmes champs depuis Firestore : la forme de cet objet
 * est donc pensée pour correspondre au futur document `settings/restaurant`.
 */
export const restaurant: RestaurantInfo = {
  name: "Moulin Vert Béja",
  shortName: "Moulin Vert",
  tagline: "Saveurs authentiques dans un cadre naturel exceptionnel.",
  description:
    "Ferme-auberge et café niché dans la campagne de Béja, le Moulin Vert propose une cuisine tunisienne authentique, des pâtisseries artisanales et une vue panoramique sur les champs, dans un cadre luxueux, calme et naturel.",
  type: "Cuisine tunisienne traditionnelle — Ferme Auberge",
  address: "Q52X+QG, Béja, Tunisie",
  phone: "+216 92 012 859",
  phoneHref: "tel:+21692012859",
  facebook: "https://www.facebook.com/search/top?q=moulin%20vert%20b%C3%A9ja",
  facebookLabel: "Moulin Vert Béja",
  googleMapsUrl: "https://maps.app.goo.gl/UboYXXheWHZasukd7",
  // Horaires affichés publiquement. Pensé pour être remplacé facilement
  // par une liste jour-par-jour depuis le dashboard admin (Étape 5).
  hours: {
    label: "Ouvert 24h/24",
    schedule: [
      { day: "Lundi — Dimanche", hours: "Ouvert 24h/24" },
    ],
  },
  highlights: [
    "Café réputé",
    "Desserts artisanaux",
    "Vue panoramique sur les champs",
    "Cuisine tunisienne authentique",
    "Cadre naturel haut de gamme",
    "Service professionnel",
  ],
  services: [
    "Dîner sur place",
    "Vente à emporter",
    "Service à table",
    "Accessible aux personnes à mobilité réduite",
  ],
};

export const navLinks: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Le Restaurant", href: "/a-propos" },
  { label: "Menu", href: "/menu" },
  { label: "Galerie", href: "/galerie" },
  { label: "Réservation", href: "/reservation" },
  { label: "Contact", href: "/contact" },
];

export const siteConfig = {
  name: restaurant.name,
  title: `${restaurant.name} — ${restaurant.tagline}`,
  description: restaurant.description,
  url: "https://moulinvertbeja.tn",
  locale: "fr_TN",
  keywords: [
    "Moulin Vert Béja",
    "restaurant Béja",
    "ferme auberge Béja",
    "cuisine tunisienne",
    "restaurant Tunisie",
    "café Béja",
    "grillades Béja",
  ],
};
