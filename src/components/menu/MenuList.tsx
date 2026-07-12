"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn, formatPrice } from "@/lib/utils";
import { menuCategories, menuItems } from "@/config/menu";

/**
 * Onglets de catégories + liste de plats. Un seul état actif (pas de
 * scroll-spy ni de sous-catégories) car la carte réelle n'a que deux
 * familles de produits — pas besoin d'un mécanisme plus complexe.
 */
export function MenuList() {
  const [active, setActive] = useState<(typeof menuCategories)[number]["id"]>("plats");
  const items = menuItems.filter((item) => item.category === active);

  return (
    <div>
      <div
        className="inline-flex gap-1 rounded-full border border-ink/10 bg-white/50 p-1"
        role="tablist"
        aria-label="Catégories du menu"
      >
        {menuCategories.map((category) => (
          <button
            key={category.id}
            role="tab"
            type="button"
            aria-selected={active === category.id}
            onClick={() => setActive(category.id)}
            className={cn(
              "rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-300",
              active === category.id
                ? "bg-moss text-linen shadow-card"
                : "text-ink/60 hover:text-ink"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.ul
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 grid gap-x-10 gap-y-1 sm:grid-cols-2"
          role="tabpanel"
        >
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-4"
            >
              <span className="font-display text-lg italic">{item.name}</span>
              <span
                className="flex-1 border-b border-dotted border-ink/25 translate-y-[-4px]"
                aria-hidden="true"
              />
              <span className="shrink-0 text-sm font-semibold text-moss">
                {formatPrice(item.price, item.currency)}
              </span>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}
