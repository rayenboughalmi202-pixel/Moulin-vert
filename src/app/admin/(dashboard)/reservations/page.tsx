import { ReservationsManager } from "@/components/admin/ReservationsManager";

export default function AdminReservationsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl italic text-ink">Réservations</h1>
      <p className="mt-1 text-sm text-ink/60">
        Confirmez, annulez ou supprimez les demandes de réservation reçues depuis le site.
      </p>
      <div className="mt-8">
        <ReservationsManager />
      </div>
    </div>
  );
}
