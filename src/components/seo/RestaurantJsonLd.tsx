import { restaurant, siteConfig } from "@/config/site";
import { media } from "@/config/media";

/**
 * Données structurées schema.org/Restaurant, injectées dans la page
 * d'accueil pour améliorer la compréhension du site par les moteurs de
 * recherche (rich snippets : horaires, adresse, téléphone, cuisine).
 */
export function RestaurantJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    description: restaurant.description,
    image: [media.hero.src, media.exterior.src],
    url: siteConfig.url,
    telephone: restaurant.phone,
    servesCuisine: "Tunisienne",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address,
      addressLocality: "Béja",
      addressCountry: "TN",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    sameAs: [restaurant.facebook],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
