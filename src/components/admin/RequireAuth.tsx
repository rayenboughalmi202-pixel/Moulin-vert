"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * Protège l'ensemble des pages du dashboard (`/admin/(dashboard)/*`).
 * Redirige vers `/admin/login` dès que l'état de connexion Firebase est
 * connu et qu'aucun utilisateur n'est authentifié — jamais avant, pour ne
 * pas rediriger par erreur pendant la vérification initiale.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-linen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-wheat" aria-hidden="true" />
          <p className="text-sm text-linen/60">Vérification de la session…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
