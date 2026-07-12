"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Pencil, Plus, Trash2, UtensilsCrossed, X } from "lucide-react";
import { FormField, fieldStyles } from "@/components/reservation/FormField";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { useToast } from "@/context/ToastContext";
import {
  deleteMenuItem,
  seedMenuFromConfig,
  subscribeMenuItems,
  upsertMenuItem,
} from "@/lib/admin/menu-admin";
import { menuCategories } from "@/config/menu";
import { cn, formatPrice } from "@/lib/utils";
import type { MenuItemRecord } from "@/types";

type FormState = {
  id: string;
  name: string;
  price: string;
  category: MenuItemRecord["category"];
  description: string;
};

const emptyForm: FormState = { id: "", name: "", price: "", category: "plats", description: "" };

/** Transforme un nom de plat en identifiant de document stable (slug). */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function MenuManager() {
  const { notify } = useToast();
  const [items, setItems] = useState<MenuItemRecord[] | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MenuItemRecord | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeMenuItems(
      (next) => setItems(next),
      (message) => notify("error", message)
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreateForm() {
    setFormError(null);
    setForm({ ...emptyForm });
  }

  function openEditForm(item: MenuItemRecord) {
    setFormError(null);
    setForm({
      id: item.id,
      name: item.name,
      price: String(item.price),
      category: item.category,
      description: item.description ?? "",
    });
  }

  async function handleSeed() {
    setIsSeeding(true);
    try {
      await seedMenuFromConfig();
      notify("success", "Menu importé depuis la carte existante.");
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "L'import a échoué.");
    } finally {
      setIsSeeding(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form) return;
    setFormError(null);

    const priceValue = Number(form.price.replace(",", "."));
    if (!form.name.trim()) {
      setFormError("Le nom du plat est obligatoire.");
      return;
    }
    if (!Number.isFinite(priceValue) || priceValue < 0) {
      setFormError("Indiquez un prix valide.");
      return;
    }

    const id = form.id || slugify(form.name) || `plat-${Date.now()}`;
    const isNew = !form.id;
    const existingOrder = items?.find((item) => item.id === id)?.order;
    const order = existingOrder ?? items?.length ?? 0;

    setIsSaving(true);
    try {
      await upsertMenuItem({
        id,
        name: form.name.trim(),
        price: priceValue,
        currency: "DT",
        category: form.category,
        description: form.description.trim() || undefined,
        order,
      });
      notify("success", isNew ? "Plat ajouté à la carte." : "Plat mis à jour.");
      setForm(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "L'enregistrement a échoué.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await deleteMenuItem(target.id);
      notify("success", "Plat retiré de la carte.");
    } catch {
      notify("error", "Le plat n'a pas pu être supprimé.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-ink/60">
          {items === null ? "Chargement…" : `${items.length} plat${items.length > 1 ? "s" : ""} sur la carte`}
        </p>
        {items !== null && items.length > 0 && (
          <Button variant="primary" onClick={openCreateForm}>
            <Plus className="h-4 w-4" strokeWidth={2} />
            Ajouter un plat
          </Button>
        )}
      </div>

      <div className="mt-6">
        {items === null ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-white/60 py-16 text-ink/50">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Chargement du menu…
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="Le menu est vide"
            description="Importez la carte déjà définie pour le site (18 plats et boissons), ou ajoutez vos plats un par un."
            actionLabel="Importer la carte existante"
            onAction={handleSeed}
            actionLoading={isSeeding}
          />
        ) : (
          <div className="space-y-10">
            {menuCategories.map((category) => {
              const categoryItems = items
                .filter((item) => item.category === category.id)
                .sort((a, b) => a.order - b.order);
              if (categoryItems.length === 0) return null;
              return (
                <div key={category.id}>
                  <h3 className="text-[0.7rem] font-semibold uppercase tracking-widest text-moss">
                    {category.label}
                  </h3>
                  <ul className="mt-4 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white/60">
                    {categoryItems.map((item) => (
                      <li key={item.id} className="flex items-center justify-between gap-4 p-4">
                        <div className="min-w-0">
                          <p className="font-display text-base italic text-ink">{item.name}</p>
                          {item.description && (
                            <p className="mt-0.5 truncate text-sm text-ink/50">{item.description}</p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-4">
                          <span className="text-sm font-semibold text-ink/70">
                            {formatPrice(item.price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => openEditForm(item)}
                            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
                            aria-label={`Modifier ${item.name}`}
                          >
                            <Pencil className="h-4 w-4" strokeWidth={1.75} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-rust/10 hover:text-rust"
                            aria-label={`Supprimer ${item.name}`}
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {form && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/60 p-4" onClick={() => setForm(null)}>
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-linen p-6 shadow-soft sm:p-8"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl italic text-ink">
                {form.id ? "Modifier le plat" : "Nouveau plat"}
              </h3>
              <button
                type="button"
                onClick={() => setForm(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink/50 hover:bg-ink/5"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <FormField label="Nom du plat" htmlFor="menu-name" required>
                <input
                  id="menu-name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className={fieldStyles()}
                  placeholder="Ex : Grillade Mixte"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Prix (DT)" htmlFor="menu-price" required>
                  <input
                    id="menu-price"
                    inputMode="decimal"
                    value={form.price}
                    onChange={(event) => setForm({ ...form, price: event.target.value })}
                    className={fieldStyles()}
                    placeholder="35"
                  />
                </FormField>

                <FormField label="Catégorie" htmlFor="menu-category" required>
                  <select
                    id="menu-category"
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value as MenuItemRecord["category"] })
                    }
                    className={cn(fieldStyles(), "appearance-none")}
                  >
                    {menuCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField label="Description (optionnelle)" htmlFor="menu-description">
                <textarea
                  id="menu-description"
                  rows={2}
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  className={fieldStyles()}
                  placeholder="Court descriptif affiché sous le nom du plat"
                />
              </FormField>

              {formError && <p className="text-sm text-rust">{formError}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setForm(null)}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary" disabled={isSaving}>
                  {isSaving ? "Enregistrement…" : "Enregistrer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Retirer ce plat de la carte ?"
        description={`« ${deleteTarget?.name ?? ""} » sera retiré définitivement du menu public.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
