/**
 * POST /api/analytics
 *
 * Endpoint optionnel pour logger les Web Vitals en production.
 * Useful for monitoring performance sur le long terme.
 *
 * Étape 6 — Performance Monitoring
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // En production, envoyer à un service comme PostHog, Sentry, etc.
    // Pour cette étape, on log simplement
    console.log("[Web Vitals]", data);

    // Optionnel : envoyer à Vercel Analytics
    // await fetch("https://vitals.vercel-analytics.com/v1/vitals", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // });

    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[Analytics Error]", error);
    return Response.json({ error: "Failed to log analytics" }, { status: 500 });
  }
}
