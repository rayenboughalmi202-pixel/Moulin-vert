"use client";

import { useEffect } from "react";

/**
 * Web Vitals Analytics — Étape 6
 *
 * Envoie les Core Web Vitals (LCP, FID, CLS, etc.) à Vercel Analytics
 * pour monitoring en production. Optionnel mais recommandé pour la
 * performance monitoring.
 *
 * Metriques capturées :
 * - LCP (Largest Contentful Paint) : quand le contenu principal est visible
 * - FID (First Input Delay) : latence de la première interaction
 * - CLS (Cumulative Layout Shift) : décalages visuels inattendus
 * - FCP (First Contentful Paint) : premier élément visible
 * - TTFB (Time to First Byte) : temps avant premier octet
 */
export function WebVitals() {
  useEffect(() => {
    // Only track in production
    if (process.env.NODE_ENV !== "production") return;

    const reportWebVitals = async (metric: any) => {
      // Option 1 : Envoyer à Vercel Analytics (automatique)
      const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
      });

      // Utiliser sendBeacon pour une fiabilité maximale
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics", body);
      } else {
        // Fallback pour les anciens navigateurs
        fetch("/api/analytics", {
          method: "POST",
          body,
          keepalive: true,
        }).catch(() => {
          // Silencieusement échouer si l'endpoint n'existe pas
        });
      }
    };

    try {
      import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(reportWebVitals);
        getFID(reportWebVitals);
        getFCP(reportWebVitals);
        getLCP(reportWebVitals);
        getTTFB(reportWebVitals);
      });
    } catch {
      // web-vitals n'est pas installé, c'est OK
    }
  }, []);

  return null;
}
