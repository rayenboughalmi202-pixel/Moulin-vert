import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { media } from "@/config/media";
import type { GalleryImage } from "@/types";

export const GALLERY_COLLECTION = "gallery";

export class GalleryAdminError extends Error {}

function assertReady() {
  if (!isFirebaseConfigured) {
    throw new GalleryAdminError("Firebase n'est pas configuré.");
  }
}

function fromDoc(id: string, data: Record<string, unknown>): GalleryImage {
  const createdAt = data.createdAt;
  return {
    id,
    src: String(data.src ?? ""),
    alt: String(data.alt ?? ""),
    order: Number(data.order ?? 0),
    createdAt: createdAt instanceof Timestamp ? createdAt.toDate().toISOString() : new Date().toISOString(),
  };
}

/** Écoute en temps réel la galerie, triée par ordre d'affichage. */
export function subscribeGalleryImages(
  onChange: (images: GalleryImage[]) => void,
  onError?: (message: string) => void
): () => void {
  if (!isFirebaseConfigured) {
    onChange([]);
    return () => {};
  }

  const galleryQuery = query(collection(db, GALLERY_COLLECTION), orderBy("order", "asc"));

  return onSnapshot(
    galleryQuery,
    (snapshot) => onChange(snapshot.docs.map((docSnapshot) => fromDoc(docSnapshot.id, docSnapshot.data()))),
    () => onError?.("Impossible de charger la galerie. Vérifiez votre connexion ou vos droits d'accès.")
  );
}

/** Ajoute une photo à la galerie (par URL — pas d'upload de fichier en Étape 5). */
export async function addGalleryImage(input: { src: string; alt: string; order: number }): Promise<void> {
  assertReady();
  try {
    await addDoc(collection(db, GALLERY_COLLECTION), {
      src: input.src.trim(),
      alt: input.alt.trim(),
      order: input.order,
      createdAt: serverTimestamp(),
    });
  } catch {
    throw new GalleryAdminError("La photo n'a pas pu être ajoutée.");
  }
}

/** Retire une photo de la galerie. */
export async function deleteGalleryImage(id: string): Promise<void> {
  assertReady();
  try {
    await deleteDoc(doc(db, GALLERY_COLLECTION, id));
  } catch {
    throw new GalleryAdminError("La photo n'a pas pu être supprimée.");
  }
}

/** Importe les visuels statiques (`src/config/media.ts`) dans Firestore. */
export async function seedGalleryFromConfig(): Promise<void> {
  assertReady();
  try {
    const existing = await getDocs(collection(db, GALLERY_COLLECTION));
    if (!existing.empty) {
      throw new GalleryAdminError("La galerie contient déjà des photos : import annulé.");
    }

    const staticImages = [media.hero, media.exterior, media.grillades, ...media.menu];
    const batch = writeBatch(db);
    staticImages.forEach((image, index) => {
      const ref = doc(collection(db, GALLERY_COLLECTION));
      batch.set(ref, {
        src: image.src,
        alt: image.alt,
        order: index,
        createdAt: serverTimestamp(),
      });
    });
    await batch.commit();
  } catch (error) {
    if (error instanceof GalleryAdminError) throw error;
    throw new GalleryAdminError("L'import de la galerie a échoué.");
  }
}
