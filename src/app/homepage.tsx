import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Testimonials } from "@/components/sections/Testimonials";
import { QuickContact } from "@/components/sections/QuickContact";
import { RestaurantJsonLd } from "@/components/seo/RestaurantJsonLd";
import { siteConfig } from "@/config/site";
import { media } from "@/config/media";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: media.hero.src, width: 1024, height: 1536, alt: media.hero.alt }],
  },
};

export default function HomePage() {
  return (
    <>
      <RestaurantJsonLd />
      <Hero />
      <About />
      <Experience />
      <Testimonials />
      <QuickContact />
    </>
  );
}
