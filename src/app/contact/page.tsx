import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { restaurant, siteConfig } from "@/config/site";
import { media } from "@/config/media";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez le Moulin Vert Béja : adresse, téléphone, horaires et localisation pour venir nous rendre visite.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact — ${siteConfig.name}`,
    description: "Contactez le Moulin Vert Béja : adresse, téléphone, horaires.",
    url: `${siteConfig.url}/contact`,
  },
};

const contactInfo = [
  { icon: MapPin, label: "Adresse", value: restaurant.address, href: restaurant.googleMapsUrl, external: true },
  { icon: Phone, label: "Téléphone", value: restaurant.phone, href: restaurant.phoneHref },
  { icon: Clock, label: "Horaires", value: restaurant.hours.label },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Parlons de votre visite"
        description="Une question, une demande spéciale, ou simplement envie de nous dire bonjour : nous sommes disponibles par téléphone ou sur place."
        image={media.exterior}
      />

      <section className="bg-linen py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-2xl bg-moss-dark p-8 text-linen sm:p-10">
            <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-wheat">
              Coordonnées
            </p>
            <dl className="mt-6 space-y-6">
              {contactInfo.map(({ icon: Icon, label, value, href, external }) => (
                <div key={label} className="flex items-start gap-4">
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
            </dl>

            <div className="mt-8 flex items-start gap-4 border-t border-linen/10 pt-6">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-wheat" strokeWidth={1.75} aria-hidden="true" />
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-widest text-linen/50">
                  Réservation en ligne
                </dt>
                <dd className="mt-1 text-base">
                  <a href="/reservation" className="transition-colors hover:text-wheat">
                    Réservez votre table en quelques secondes
                  </a>
                </dd>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-ink/10 shadow-card">
            <iframe
              title="Localisation du Moulin Vert Béja"
              src={`https://www.google.com/maps?q=${encodeURIComponent(restaurant.address)}&output=embed`}
              className="h-full min-h-[320px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
