"use client";

import { useEffect } from "react";

/**
 * Web Vitals Analytics — Étape 6
 *
 * Envoie les Core Web Vitals (LCP, CLS, FCP, TTFB, INP/FID) à un endpoint
 * interne pour monitoring en production.
 *
 * Note : selon la version de la librairie "web-vitals" installée, les noms
 * de fonctions exportées changent (onFID a été remplacé par onINP dans les
 * versions récentes). Le code ci-dessous appelle uniquement les fonctions
 * réellement présentes dans le module, pour rester compatible quelle que
 * soit la version installée.
 */
export function WebVitals() {
  useEffect(() => {
    // Only track in production
    if (process.env.NODE_ENV !== "production") return;

    const reportWebVitals = async (metric: any) => {
      const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics", body);
      } else {
        fetch("/api/analytics", {
          method: "POST",
          body,
          keepalive: true,
        }).catch(() => {
          // Silencieusement échouer si l'endpoint n'existe pas
        });
      }
    };

    import("web-vitals")
      .then((webVitals: Record<string, any>) => {
        webVitals.onCLS?.(reportWebVitals);
        webVitals.onFCP?.(reportWebVitals);
        webVitals.onLCP?.(reportWebVitals);
        webVitals.onTTFB?.(reportWebVitals);
        // onFID est obsolète depuis web-vitals v4, remplacé par onINP.
        // On tente les deux, un seul des deux existera selon la version.
        webVitals.onINP?.(reportWebVitals);
        webVitals.onFID?.(reportWebVitals);
      })
      .catch(() => {
        // web-vitals n'est pas installé, c'est OK
      });
  }, []);

  return null;
}
