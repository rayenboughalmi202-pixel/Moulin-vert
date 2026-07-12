import type { Metadata } from "next";
import { Clock, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { ReservationForm } from "@/components/reservation/ReservationForm";
import { restaurant, siteConfig } from "@/config/site";
import { media } from "@/config/media";

export const metadata: Metadata = {
  title: "Réservation",
  description:
    "Réservez votre table au Moulin Vert Béja : choisissez votre date, votre créneau et le nombre de convives, en quelques secondes.",
  alternates: { canonical: "/reservation" },
  openGraph: {
    title: `Réservation — ${siteConfig.name}`,
    description: "Réservez votre table au Moulin Vert Béja en quelques secondes.",
    url: `${siteConfig.url}/reservation`,
  },
};

const practicalInfo = [
  { icon: MapPin, label: "Adresse", value: restaurant.address, href: restaurant.googleMapsUrl, external: true },
  { icon: Phone, label: "Téléphone", value: restaurant.phone, href: restaurant.phoneHref },
  { icon: Clock, label: "Horaires", value: restaurant.hours.label },
];

export default function ReservationPage() {
  return (
    <>
      <PageHero
        eyebrow="Réservation"
        title="Réservez votre table"
        description="Un déjeuner en famille, un dîner entre amis ou un événement particulier : dites-nous quand vous arrivez, nous préparons le reste."
        image={media.exterior}
      />

      <section className="bg-linen py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="rounded-2xl border border-ink/10 bg-white/60 p-6 shadow-card sm:p-10">
            <ReservationForm />
          </div>

          <aside className="space-y-8">
            <div className="rounded-2xl bg-moss-dark p-8 text-linen">
              <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-wheat">
                Informations pratiques
              </p>
              <dl className="mt-6 space-y-6">
                {practicalInfo.map(({ icon: Icon, label, value, href, external }) => (
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
            </div>

            <div className="rounded-2xl border border-ink/10 bg-white/60 p-8">
              <h3 className="font-display text-lg italic text-ink">Bon à savoir</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/70">
                <li>Votre demande est confirmée par notre équipe par téléphone.</li>
                <li>Pour un groupe de plus de 20 personnes, contactez-nous directement.</li>
                <li>Une table peut être annulée jusqu&apos;à 2h avant le créneau.</li>
              </ul>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
