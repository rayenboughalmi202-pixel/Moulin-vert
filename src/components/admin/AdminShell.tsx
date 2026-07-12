"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarCheck,
  Clock,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { adminSignOut } from "@/lib/auth";
import { subscribeReservations } from "@/lib/admin/reservations-admin";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/reservations", label: "Réservations", icon: CalendarCheck },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/galerie", label: "Galerie", icon: ImageIcon },
  { href: "/admin/horaires", label: "Horaires", icon: Clock },
];

/**
 * Ossature commune à toutes les pages du dashboard : sidebar de navigation
 * (repliable en mobile), barre supérieure avec l'e-mail de l'admin connecté
 * et le bouton de déconnexion, et un badge de notifications qui compte les
 * réservations `pending` en temps réel — c'est la seule alerte dont un
 * petit restaurant a vraiment besoin au quotidien.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeReservations((reservations) => {
      setPendingCount(reservations.filter((reservation) => reservation.status === "pending").length);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    await adminSignOut();
    router.replace("/admin/login");
  }

  const navContent = (
    <>
      <Link href="/admin" className="flex items-center gap-2.5 px-1 text-linen">
        <LogoMark className="h-7 w-7 text-wheat" />
        <span className="flex flex-col leading-none">
          <span className="font-display text-base italic">Moulin Vert</span>
          <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-widest opacity-60">
            Administration
          </span>
        </span>
      </Link>

      <nav className="mt-10 flex flex-1 flex-col gap-1" aria-label="Navigation admin">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          const isReservations = href === "/admin/reservations";
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive ? "bg-linen/10 text-linen" : "text-linen/60 hover:bg-linen/5 hover:text-linen"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                {label}
              </span>
              {isReservations && pendingCount > 0 && (
                <span
                  className="flex h-5 min-w-5 items-center justify-center rounded-full bg-wheat px-1.5 text-[0.7rem] font-semibold text-ink"
                  aria-label={`${pendingCount} réservation(s) en attente`}
                >
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 border-t border-linen/10 pt-4">
        <p className="truncate px-4 text-xs text-linen/50">{user?.email}</p>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-linen/70 transition-colors hover:bg-linen/5 hover:text-linen"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          Se déconnecter
        </button>
        <Link
          href="/"
          className="block px-4 pb-1 text-xs text-linen/40 underline-offset-4 transition-colors hover:text-linen/70 hover:underline"
        >
          ← Retour au site public
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-linen">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 flex-col bg-ink px-4 py-6 lg:flex">{navContent}</aside>

      {/* Topbar mobile */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-ink/10 bg-linen px-4 lg:hidden">
          <span className="font-display text-lg italic text-ink">Administration</span>
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink"
            aria-label="Ouvrir le menu"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
      </div>

      {/* Sidebar mobile (plein écran) */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink px-4 py-6 lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(false)}
            className="mb-6 flex h-10 w-10 items-center justify-center self-end rounded-full text-linen"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
          {navContent}
        </div>
      )}
    </div>
  );
}
