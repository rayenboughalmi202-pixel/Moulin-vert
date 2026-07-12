import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { PhotoLightbox } from "@/components/gallery/PhotoLightbox";
import { siteConfig } from "@/config/site";
import { media } from "@/config/media";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Découvrez en images le cadre naturel, la terrasse et les grillades du Moulin Vert Béja, ferme-auberge avec vue panoramique sur les champs.",
  alternates: { canonical: "/galerie" },
  openGraph: {
    title: `Galerie — ${siteConfig.name}`,
    description: "Le cadre, l'ambiance et les plats du Moulin Vert Béja, en photos.",
    url: `${siteConfig.url}/galerie`,
  },
};

const galleryPhotos = [media.hero, media.exterior, media.grillades, ...media.menu];

export default function GaleriePage() {
  return (
    <>
      <PageHero
        eyebrow="En images"
        title="Galerie"
        description="Le cadre, l'ambiance et les plats du Moulin Vert, tels qu'on les découvre sur place."
        image={media.exterior}
      />

      <section className="bg-linen py-20 sm:py-28">
        <Container>
          <PhotoLightbox
            photos={[...galleryPhotos]}
            masonry
            gridClassName="grid-cols-2 sm:grid-cols-3 auto-rows-[180px] sm:auto-rows-[220px]"
          />
        </Container>
      </section>
    </>
  );
}
