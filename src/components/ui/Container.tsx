import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

/**
 * Enveloppe de largeur commune à toutes les sections du site, pour garder
 * une grille cohérente entre le Navbar, le Footer et le contenu des pages.
 */
export function Container({ as: Tag = "div", children, className }: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12", className)}>
      {children}
    </Tag>
  );
}
