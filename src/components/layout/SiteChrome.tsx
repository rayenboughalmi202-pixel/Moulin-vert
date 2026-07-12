"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

/**
 * Le dashboard admin (`/admin/*`) a sa propre ossature (sidebar, topbar —
 * voir `AdminShell`) et ne doit jamais afficher le Navbar/Footer publics.
 * Centralisé ici plutôt que dans chaque composant, pour que le layout
 * racine reste inchangé pour le reste du site.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
