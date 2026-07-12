import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { MenuList } from "@/components/menu/MenuList";
import { PhotoLightbox } from "@/components/gallery/PhotoLightbox";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import { media } from "@/config/media";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Découvrez la carte du Moulin Vert Béja : grillades, plats tunisiens traditionnels, thés et boissons, dans une ferme-auberge au cadre naturel exceptionnel.",
  alternates: { canonical: "/menu" },
  openGraph: {
    title: `Menu — ${siteConfig.name}`,
    description:
      "La carte du Moulin Vert Béja : Ftat, Berzguen, grillades, thés aux amandes et aux noisettes, et bien plus.",
    url: `${siteConfig.url}/menu`,
  },
};

export default function MenuPage() {
  return (
    <>
      <PageHero
        eyebrow="La carte"
        title="Notre Menu"
        description="Une cuisine tunisienne authentique, des grillades généreuses et des boissons chaudes préparées avec soin."
        image={media.grillades}
      />

      <section className="bg-linen py-20 sm:py-28">
        <Container>
          <MenuList />
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-linen py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="La carte, telle quelle"
            title="Envie de la feuilleter directement ?"
            description="Les photos de notre carte, telle qu'elle est affichée en salle."
          />
          <div className="mt-10 max-w-2xl">
            <PhotoLightbox photos={[...media.menu]} gridClassName="grid-cols-2 sm:grid-cols-2" />
          </div>
        </Container>
      </section>
    </>
  );
}
