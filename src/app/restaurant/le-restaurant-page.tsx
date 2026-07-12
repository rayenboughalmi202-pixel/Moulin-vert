import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Testimonials } from "@/components/sections/Testimonials";
import { siteConfig } from "@/config/site";
import { media } from "@/config/media";

export const metadata: Metadata = {
  title: "Le Restaurant",
  description:
    "Découvrez le Moulin Vert Béja : une ferme-auberge au cadre naturel, entre terrasse verdoyante et cuisine tunisienne authentique.",
  alternates: { canonical: "/le-restaurant" },
  openGraph: {
    title: `Le Restaurant — ${siteConfig.name}`,
    description: "Une ferme-auberge au cadre naturel, entre terrasse verdoyante et cuisine tunisienne authentique.",
    url: `${siteConfig.url}/le-restaurant`,
  },
};

export default function LeRestaurantPage() {
  return (
    <>
      <PageHero
        eyebrow="Le Restaurant"
        title="Notre histoire, notre cadre"
        description="Une ferme-auberge nichée dans la nature, où l'on prend le temps de bien manger et de profiter de la vue."
        image={media.exterior}
      />

      <About />
      <Experience />
      <Testimonials />
    </>
  );
}
