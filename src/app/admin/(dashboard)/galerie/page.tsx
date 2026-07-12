import { GalleryManager } from "@/components/admin/GalleryManager";

export default function AdminGaleriePage() {
  return (
    <div>
      <h1 className="font-display text-3xl italic text-ink">Galerie</h1>
      <p className="mt-1 text-sm text-ink/60">
        Gérez les photos affichées sur la page Galerie et dans le hero du site.
      </p>
      <div className="mt-8">
        <GalleryManager />
      </div>
    </div>
  );
}
