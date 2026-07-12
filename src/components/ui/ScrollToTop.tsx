"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

/**
 * Apparaît une fois que la page a suffisamment défilé (pages Menu et
 * Galerie notamment, plus longues à parcourir). Discret, ne s'affiche
 * jamais au-dessus du contenu du Hero.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-moss text-linen shadow-soft"
          aria-label="Retour en haut de page"
        >
          <ArrowUp className="h-5 w-5" strokeWidth={1.75} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
