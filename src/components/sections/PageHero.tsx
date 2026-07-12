import Image from "next/image";
import { Container } from "@/components/ui/Container";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  image: { src: string; alt: string };
}

/**
 * Bandeau d'en-tête pour les pages secondaires (Menu, Galerie, Réservation,
 * Contact...). Même grammaire visuelle que le Hero de l'accueil, mais plus
 * court, pour garder une identité cohérente sans répéter le grand hero.
 */
export function PageHero({ eyebrow, title, description, image }: PageHeroProps) {
  return (
    <section className="relative flex h-[46vh] min-h-[320px] items-end overflow-hidden bg-ink text-linen">
      <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20"
      />
      <Container className="relative pb-14 pt-32">
        <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-wheat">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-display-lg italic text-balance">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-base text-linen/75">{description}</p>
        )}
      </Container>
    </section>
  );
}
