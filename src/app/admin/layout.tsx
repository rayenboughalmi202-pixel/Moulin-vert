import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

/**
 * Layout racine de tout le sous-arbre `/admin`. Fournit uniquement le
 * contexte d'authentification : la protection des pages (redirection si
 * non connecté) et l'habillage visuel (sidebar, topbar) sont gérés plus
 * bas, dans `admin/(dashboard)/layout.tsx`, pour laisser `/admin/login`
 * totalement libre d'accès.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
