"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { navLinks, restaurant } from "@/config/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Le header passe d'un fond transparent (posé sur le hero) à un fond
  // plein une fois que la page défile, pour rester lisible partout.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ferme le menu mobile automatiquement lors d'un changement de page.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Empêche le scroll du fond quand le menu plein écran est ouvert.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-organic",
        isScrolled || isMenuOpen
          ? "bg-ink/95 text-linen shadow-soft backdrop-blur"
          : "bg-transparent text-linen"
      )}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" aria-label={`${restaurant.name} — Accueil`} className="text-linen">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Navigation principale">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium tracking-wide transition-opacity hover:opacity-100",
                  isActive ? "opacity-100" : "opacity-75"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={restaurant.phoneHref}
            className="flex items-center gap-2 text-sm font-medium opacity-90 transition-opacity hover:opacity-100"
          >
            <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            {restaurant.phone}
          </a>
          <Button href="/reservation" variant="primary">
            Réserver
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-linen lg:hidden"
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-ink/98 lg:hidden"
          >
            <Container className="flex flex-col gap-1 pb-8 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border-b border-linen/10 py-4 text-lg font-display italic"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={restaurant.phoneHref}
                className="flex items-center gap-2 py-4 text-sm font-medium opacity-90"
              >
                <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                {restaurant.phone}
              </a>
              <Button href="/reservation" variant="primary" className="mt-2 w-full">
                Réserver une table
              </Button>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
