"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GalleryPhoto {
  src: string;
  alt: string;
}

interface PhotoLightboxProps {
  photos: GalleryPhoto[];
  /** Classes Tailwind pour la grille de vignettes (nombre de colonnes, gap...) */
  gridClassName?: string;
  /** Hauteurs de vignette alternées pour un rendu "mur de photos" (mode galerie) */
  masonry?: boolean;
}

/**
 * Grille de vignettes cliquables + visionneuse plein écran (précédent /
 * suivant / échap). Un seul composant partagé entre la mini-galerie de la
 * page Menu et la page Galerie complète, pour garder le même comportement
 * partout où une photo peut s'agrandir.
 */
export function PhotoLightbox({ photos, gridClassName, masonry = false }: PhotoLightboxProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = () => setOpenIndex(null);
  const showPrev = () =>
    setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  const showNext = () => setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length));

  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  return (
    <>
      <div className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3", gridClassName)}>
        {photos.map((photo, index) => (
          <button
            key={photo.src + index}
            type="button"
            onClick={() => setOpenIndex(index)}
            className={cn(
              "group relative overflow-hidden rounded-lg bg-ink/5 shadow-card",
              masonry && index % 3 === 1 ? "row-span-2 aspect-[3/4]" : "aspect-square"
            )}
            aria-label={`Agrandir la photo : ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 30vw, 45vw"
              className="object-cover transition-transform duration-700 ease-organic group-hover:scale-105"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 sm:p-10"
            role="dialog"
            aria-modal="true"
            aria-label="Visionneuse photo"
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full text-linen/80 hover:text-linen"
              aria-label="Fermer la visionneuse"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={showPrev}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-linen/80 hover:text-linen sm:left-6"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>

            <motion.div
              key={openIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full max-h-[85vh] w-full max-w-3xl"
            >
              <Image
                src={photos[openIndex].src}
                alt={photos[openIndex].alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </motion.div>

            <button
              type="button"
              onClick={showNext}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-linen/80 hover:text-linen sm:right-6"
              aria-label="Photo suivante"
            >
              <ChevronRight className="h-7 w-7" />
            </button>

            <p className="absolute bottom-6 left-1/2 max-w-md -translate-x-1/2 text-center text-sm text-linen/70">
              {photos[openIndex].alt}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
