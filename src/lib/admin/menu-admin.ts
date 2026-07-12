import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { menuItems as staticMenuItems } from "@/config/menu";
import type { MenuItemRecord } from "@/types";

export const MENU_COLLECTION = "menu";

export class MenuAdminError extends Error {}

function assertReady() {
  if (!isFirebaseConfigured) {
    throw new MenuAdminError("Firebase n'est pas configuré.");
  }
}

function fromDoc(id: string, data: Record<string, unknown>): MenuItemRecord {
  return {
    id,
    name: String(data.name ?? ""),
    price: Number(data.price ?? 0),
    currency: "DT",
    category: (data.category as MenuItemRecord["category"]) ?? "plats",
    description: typeof data.description === "string" ? data.description : undefined,
    image: typeof data.image === "string" ? data.image : undefined,
    order: Number(data.order ?? 0),
  };
}

/** Écoute en temps réel la carte, triée par ordre d'affichage. */
export function subscribeMenuItems(
  onChange: (items: MenuItemRecord[]) => void,
  onError?: (message: string) => void
): () => void {
  if (!isFirebaseConfigured) {
    onChange([]);
    return () => {};
  }

  const menuQuery = query(collection(db, MENU_COLLECTION), orderBy("order", "asc"));

  return onSnapshot(
    menuQuery,
    (snapshot) => onChange(snapshot.docs.map((docSnapshot) => fromDoc(docSnapshot.id, docSnapshot.data()))),
    () => onError?.("Impossible de charger le menu. Vérifiez votre connexion ou vos droits d'accès.")
  );
}

/** Crée ou met à jour un plat. `id` doit être un slug stable (ex: "ftat"). */
export async function upsertMenuItem(item: MenuItemRecord): Promise<void> {
  assertReady();
  try {
    await setDoc(doc(db, MENU_COLLECTION, item.id), {
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description ?? null,
      image: item.image ?? null,
      order: item.order,
    });
  } catch {
    throw new MenuAdminError("Le plat n'a pas pu être enregistré.");
  }
}

/** Supprime un plat de la carte. */
export async function deleteMenuItem(id: string): Promise<void> {
  assertReady();
  try {
    await deleteDoc(doc(db, MENU_COLLECTION, id));
  } catch {
    throw new MenuAdminError("Le plat n'a pas pu être supprimé.");
  }
}

/**
 * Importe la carte statique (`src/config/menu.ts`) dans Firestore en une
 * seule opération groupée. Proposé depuis le dashboard tant que la
 * collection `menu` est vide, pour ne pas ressaisir les 17 plats à la main.
 */
export async function seedMenuFromConfig(): Promise<void> {
  assertReady();
  try {
    const existing = await getDocs(collection(db, MENU_COLLECTION));
    if (!existing.empty) {
      throw new MenuAdminError("Le menu contient déjà des plats : import annulé.");
    }

    const batch = writeBatch(db);
    staticMenuItems.forEach((item, index) => {
      batch.set(doc(db, MENU_COLLECTION, item.id), {
        name: item.name,
        price: item.price,
        category: item.category,
        description: item.description ?? null,
        image: item.image ?? null,
        order: index,
      });
    });
    await batch.commit();
  } catch (error) {
    if (error instanceof MenuAdminError) throw error;
    throw new MenuAdminError("L'import du menu a échoué.");
  }
}
