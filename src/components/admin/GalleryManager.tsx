"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { FormField, fieldStyles } from "@/components/reservation/FormField";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { useToast } from "@/context/ToastContext";
import {
  addGalleryImage,
  deleteGalleryImage,
  seedGalleryFromConfig,
  subscribeGalleryImages,
} from "@/lib/admin/gallery-admin";
import type { GalleryImage } from "@/types";

export function GalleryManager() {
  const { notify } = useToast();
  const [images, setImages] = useState<GalleryImage[] | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeGalleryImages(
      (next) => setImages(next),
      (message) => notify("error", message)
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSeed() {
    setIsSeeding(true);
    try {
      await seedGalleryFromConfig();
      notify("success", "Galerie importée depuis les photos existantes.");
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "L'import a échoué.");
    } finally {
      setIsSeeding(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    if (!src.trim() || !/^https?:\/\//.test(src.trim())) {
      setFormError("Indiquez une URL d'image valide (https://...).");
      return;
    }
    if (!alt.trim()) {
      setFormError("Ajoutez une description (texte alternatif) pour l'accessibilité et le SEO.");
      return;
    }

    setIsSaving(true);
    try {
      await addGalleryImage({ src: src.trim(), alt: alt.trim(), order: images?.length ?? 0 });
      notify("success", "Photo ajoutée à la galerie.");
      setSrc("");
      setAlt("");
      setIsFormOpen(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "L'ajout a échoué.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await deleteGalleryImage(target.id);
      notify("success", "Photo supprimée.");
    } catch {
      notify("error", "La photo n'a pas pu être supprimée.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-ink/60">
          {images === null ? "Chargement…" : `${images.length} photo${images.length > 1 ? "s" : ""}`}
        </p>
        {images !== null && images.length > 0 && (
          <Button variant="primary" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4" strokeWidth={2} />
            Ajouter une photo
          </Button>
        )}
      </div>

      <div className="mt-6">
        {images === null ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-white/60 py-16 text-ink/50">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Chargement de la galerie…
          </div>
        ) : images.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            title="La galerie est vide"
            description="Importez les photos déjà utilisées sur le site (terrasse, grillades, menu), ou ajoutez vos propres visuels par URL."
            actionLabel="Importer les photos existantes"
            onAction={handleSeed}
            actionLoading={isSeeding}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((image) => (
              <div key={image.id} className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-ink/5">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="line-clamp-2 text-xs text-linen">{image.alt}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(image)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-linen opacity-0 transition-opacity hover:bg-rust group-hover:opacity-100"
                  aria-label="Supprimer la photo"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/60 p-4"
          onClick={() => setIsFormOpen(false)}
        >
          <div onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl bg-linen p-6 shadow-soft sm:p-8">
            <h3 className="font-display text-xl italic text-ink">Ajouter une photo</h3>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <FormField label="URL de l'image" htmlFor="gallery-src" required hint="Lien direct vers l'image (https://...)">
                <input
                  id="gallery-src"
                  value={src}
                  onChange={(event) => setSrc(event.target.value)}
                  className={fieldStyles()}
                  placeholder="https://..."
                />
              </FormField>

              <FormField label="Description (texte alternatif)" htmlFor="gallery-alt" required>
                <input
                  id="gallery-alt"
                  value={alt}
                  onChange={(event) => setAlt(event.target.value)}
                  className={fieldStyles()}
                  placeholder="Ex : Terrasse du Moulin Vert au coucher du soleil"
                />
              </FormField>

              {formError && <p className="text-sm text-rust">{formError}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary" disabled={isSaving}>
                  {isSaving ? "Ajout…" : "Ajouter"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Supprimer cette photo ?"
        description="Elle sera retirée définitivement de la galerie publique."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
