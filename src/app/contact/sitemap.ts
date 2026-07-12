import type { MetadataRoute } from "next";
import { restaurant } from "@/config/site";

/**
 * Sitemap XML généré dynamiquement pour SEO.
 * Inclut toutes les routes publiques avec priorités et fréquences de mise à jour.
 *
 * Accessible sur /sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://moulinvertbeja.tn"; // À personnaliser
  const now = new Date().toISOString().split("T")[0];

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/galerie`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reservation`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
