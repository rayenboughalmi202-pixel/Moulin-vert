import { HoursEditor } from "@/components/admin/HoursEditor";
import { SlotsEditor } from "@/components/admin/SlotsEditor";

export default function AdminHorairesPage() {
  return (
    <div>
      <h1 className="font-display text-3xl italic text-ink">Horaires</h1>
      <p className="mt-1 text-sm text-ink/60">
        Modifiez les horaires affichés publiquement et les créneaux proposés à la réservation.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-[0.7rem] font-semibold uppercase tracking-widest text-moss">
            Horaires d&apos;ouverture
          </h2>
          <HoursEditor />
        </div>
        <div>
          <h2 className="mb-3 text-[0.7rem] font-semibold uppercase tracking-widest text-moss">
            Créneaux de réservation
          </h2>
          <SlotsEditor />
        </div>
      </div>
    </div>
  );
}
