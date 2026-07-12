"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { restaurant } from "@/config/site";

const items = [
  {
    icon: MapPin,
    label: "Adresse",
    value: restaurant.address,
    href: restaurant.googleMapsUrl,
    external: true,
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: restaurant.phone,
    href: restaurant.phoneHref,
    external: false,
  },
  {
    icon: Clock,
    label: "Horaires",
    value: restaurant.hours.label,
    href: undefined,
    external: false,
  },
];

export function QuickContact() {
  return (
    <section className="bg-moss-dark py-24 text-linen sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Nous trouver"
            title="Venez nous rendre visite"
            description="Le Moulin Vert vous accueille dans la campagne de Béja, pour un déjeuner en famille, un dîner entre amis ou simplement un café face aux champs."
            tone="light"
          />
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/reservation" variant="primary">
              Réserver une table
            </Button>
            <Button href={restaurant.googleMapsUrl} variant="outline" className="border-linen/40 text-linen" external>
              Voir sur Google Maps
            </Button>
          </div>
        </div>

        <motion.dl
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="grid gap-6 rounded-lg bg-linen/5 p-8"
        >
          {items.map(({ icon: Icon, label, value, href, external }) => (
            <div key={label} className="flex items-start gap-4 border-b border-linen/10 pb-6 last:border-b-0 last:pb-0">
              <Icon className="mt-1 h-5 w-5 shrink-0 text-wheat" strokeWidth={1.75} aria-hidden="true" />
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-widest text-linen/50">
                  {label}
                </dt>
                <dd className="mt-1 text-base">
                  {href ? (
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="transition-colors hover:text-wheat"
                    >
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            </div>
          ))}
        </motion.dl>
      </Container>
    </section>
  );
}
