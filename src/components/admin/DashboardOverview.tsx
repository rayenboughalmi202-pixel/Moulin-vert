"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, CalendarClock, ImageIcon, UtensilsCrossed } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { subscribeReservations } from "@/lib/admin/reservations-admin";
import { subscribeMenuItems } from "@/lib/admin/menu-admin";
import { subscribeGalleryImages } from "@/lib/admin/gallery-admin";
import { todayISO } from "@/lib/reservation-utils";
import { useAuth } from "@/context/AuthContext";
import type { Reservation } from "@/types";

export function DashboardOverview() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menuCount, setMenuCount] = useState<number | null>(null);
  const [galleryCount, setGalleryCount] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribeReservations = subscribeReservations((next) => setReservations(next));
    const unsubscribeMenu = subscribeMenuItems((next) => setMenuCount(next.length));
    const unsubscribeGallery = subscribeGalleryImages((next) => setGalleryCount(next.length));
    return () => {
      unsubscribeReservations();
      unsubscribeMenu();
      unsubscribeGallery();
    };
  }, []);

  const pendingCount = reservations.filter((reservation) => reservation.status === "pending").length;
  const today = todayISO();
  const todayCount = reservations.filter(
    (reservation) => reservation.date === today && reservation.status !== "cancelled"
  ).length;
  const upcoming = reservations
    .filter((reservation) => reservation.status !== "cancelled" && reservation.date >= today)
    .sort((a, b) => (a.date + a.timeSlot).localeCompare(b.date + b.timeSlot))
    .slice(0, 5);

  return (
    <div>
      <p className="text-sm text-ink/50">Bonjour{user?.email ? `, ${user.email}` : ""}</p>
      <h1 className="mt-1 font-display text-3xl italic text-ink">Tableau de bord</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarClock} label="En attente de confirmation" value={pendingCount} tone="warning" />
        <StatCard icon={CalendarCheck} label="Réservations aujourd'hui" value={todayCount} />
        <StatCard icon={UtensilsCrossed} label="Plats sur la carte" value={menuCount ?? "—"} />
        <StatCard icon={ImageIcon} label="Photos dans la galerie" value={galleryCount ?? "—"} />
      </div>

      <div className="mt-10 rounded-2xl border border-ink/10 bg-white/60 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg italic text-ink">Prochaines réservations</h2>
          <Link href="/admin/reservations" className="text-sm font-medium text-moss hover:opacity-70">
            Tout voir →
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <p className="mt-6 text-sm text-ink/50">Aucune réservation à venir pour le moment.</p>
        ) : (
          <ul className="mt-6 divide-y divide-ink/10">
            {upcoming.map((reservation) => (
              <li key={reservation.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{reservation.fullName}</p>
                  <p className="text-sm text-ink/50">
                    {reservation.date} à {reservation.timeSlot} · {reservation.partySize} pers.
                  </p>
                </div>
                <StatusBadge status={reservation.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
