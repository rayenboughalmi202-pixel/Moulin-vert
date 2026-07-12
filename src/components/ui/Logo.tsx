import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
}

/**
 * Élément signature du site : un moulin stylisé en ligne fine, réduit à
 * l'essentiel (base, ailes, un grain de blé). Sert de point d'ancrage
 * visuel répété dans le Navbar, le Footer, et plus tard les états de
 * chargement du dashboard — une seule forme, plusieurs échelles.
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22.5" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <path d="M24 24V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M24 24L35.5 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M24 24L33 33.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M24 24L13 32" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M24 9C26.2 9 28 11.5 28 14.5C28 15.6 27.7 16.6 27.2 17.4L24 24L20.8 17.4C20.3 16.6 20 15.6 20 14.5C20 11.5 21.8 9 24 9Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M35.5 15C37.1 16.4 37.4 19.5 35.6 22C34.9 22.9 34.1 23.5 33.2 23.8L24 24L30 18.4C30.5 17.6 31.2 16.9 32.1 16.3C33.6 15.3 34.7 15 35.5 15Z"
        fill="currentColor"
        opacity="0.75"
      />
      <path
        d="M33 33.5C31.8 35.3 28.7 36.2 25.9 34.9C24.9 34.4 24.1 33.7 23.6 32.9L24 24L28 30.9C28.6 31.6 29.1 32.4 29.4 33.4C29.9 35 29.9 35 33 33.5Z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M13 32C12.3 29.9 13.9 27.1 16.8 25.9C17.8 25.5 18.8 25.3 19.7 25.4L24 24L19.9 31.7C19.4 32.5 18.8 33.3 17.9 33.9C16.5 34.9 14.1 34.2 13 32Z"
        fill="currentColor"
        opacity="0.45"
      />
      <circle cx="24" cy="24" r="2.4" fill="currentColor" />
      <path d="M12 41H36" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/**
 * Bloc-marque complet : pictogramme + nom, utilisé dans le Navbar.
 */
export function Wordmark({ className }: LogoMarkProps) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8 shrink-0 text-wheat" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg italic tracking-tight">Moulin Vert</span>
        <span className="mt-1 text-[0.62rem] font-semibold uppercase tracking-widest opacity-70">
          Béja
        </span>
      </span>
    </span>
  );
}
