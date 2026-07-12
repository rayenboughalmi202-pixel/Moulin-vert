"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modale de confirmation générique, utilisée avant toute suppression
 * (réservation, plat, photo) : ces actions sont irréversibles côté
 * Firestore, mieux vaut un clic de plus qu'une carte perdue par erreur.
 */
export function ConfirmDialog({ open, title, description, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/60 p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-linen p-6 shadow-soft"
            role="alertdialog"
            aria-modal="true"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rust/15 text-rust-dark">
              <TriangleAlert className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-display text-lg italic text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{description}</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={onCancel}>
                Annuler
              </Button>
              <Button variant="primary" className="bg-rust text-linen hover:bg-rust-dark" onClick={onConfirm}>
                {confirmLabel ?? "Supprimer"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
