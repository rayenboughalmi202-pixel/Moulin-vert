import { MenuManager } from "@/components/admin/MenuManager";

export default function AdminMenuPage() {
  return (
    <div>
      <h1 className="font-display text-3xl italic text-ink">Menu</h1>
      <p className="mt-1 text-sm text-ink/60">
        Ajoutez, modifiez ou retirez des plats de la carte affichée sur la page publique.
      </p>
      <div className="mt-8">
        <MenuManager />
      </div>
    </div>
  );
}
