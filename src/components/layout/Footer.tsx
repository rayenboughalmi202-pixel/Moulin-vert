import Link from "next/link";
import { Facebook, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/Logo";
import { navLinks, restaurant } from "@/config/site";

/**
 * Frise décorative en épis de blé — le signature element du site.
 * Se répète en <use> pour rester légère et nette à toute largeur d'écran.
 */
function WheatDivider() {
  return (
    <svg
      viewBox="0 0 240 24"
      preserveAspectRatio="xMidYMid meet"
      className="h-5 w-full text-wheat/70"
      aria-hidden="true"
    >
      <defs>
        <g id="wheat-stalk">
          <path d="M0 24V4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <path d="M0 4C-2.5 3 -3.5 1 -3 -1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <path d="M0 4C2.5 3 3.5 1 3 -1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <path d="M0 9C-2.5 8 -3.5 6 -3 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <path d="M0 9C2.5 8 3.5 6 3 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <path d="M0 14C-2.5 13 -3.5 11 -3 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <path d="M0 14C2.5 13 3.5 11 3 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </g>
      </defs>
      {Array.from({ length: 20 }).map((_, i) => (
        <use key={i} href="#wheat-stalk" x={4 + i * 12.5} y={0} />
      ))}
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-linen">
      <Container className="pt-10">
        <WheatDivider />
      </Container>

      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5 text-linen">
            <LogoMark className="h-9 w-9 text-wheat" />
            <span className="font-display text-xl italic">Moulin Vert</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-linen/70">
            {restaurant.tagline}
          </p>
          <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-widest text-wheat/90">
            {restaurant.type}
          </p>
        </div>

        <div>
          <h3 className="text-[0.7rem] font-semibold uppercase tracking-widest text-wheat/90">
            Navigation
          </h3>
          <ul className="mt-5 space-y-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-linen/80 transition-colors hover:text-linen"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[0.7rem] font-semibold uppercase tracking-widest text-wheat/90">
            Contact
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-linen/80">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-wheat" strokeWidth={1.75} aria-hidden="true" />
              <a
                href={restaurant.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-linen"
              >
                {restaurant.address}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-wheat" strokeWidth={1.75} aria-hidden="true" />
              <a href={restaurant.phoneHref} className="transition-colors hover:text-linen">
                {restaurant.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Facebook className="h-4 w-4 shrink-0 text-wheat" strokeWidth={1.75} aria-hidden="true" />
              <a
                href={restaurant.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-linen"
              >
                {restaurant.facebookLabel}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[0.7rem] font-semibold uppercase tracking-widest text-wheat/90">
            Horaires
          </h3>
          <ul className="mt-5 space-y-2 text-sm text-linen/80">
            {restaurant.hours.schedule.map((entry) => (
              <li key={entry.day} className="flex justify-between gap-4">
                <span className="text-linen/60">{entry.day}</span>
                <span>{entry.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="flex flex-col gap-3 border-t border-linen/10 py-6 text-xs text-linen/50 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {restaurant.name}. Tous droits réservés.
        </p>
        <p>Béja, Tunisie</p>
      </Container>
    </footer>
  );
}
