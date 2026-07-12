"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { subscribeToAuthState } from "@/lib/auth";
import type { AdminUser } from "@/types";

interface AuthContextValue {
  /** `null` tant que l'état de connexion n'est pas encore connu. */
  user: AdminUser | null;
  /** `true` le temps de la toute première vérification côté Firebase. */
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true });

/**
 * Fournit l'état de connexion admin à tout le sous-arbre `/admin`. Un seul
 * abonnement Firebase Auth est ouvert ici (dans le layout admin), plutôt
 * que dans chaque page, pour éviter les écrans de chargement en cascade
 * lors de la navigation entre les sections du dashboard.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
