"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Testimonial } from "@/types";

/**
 * ⚠️ Contenu d'exemple — à remplacer par de vrais avis clients
 * (Google, Facebook…) avant mise en ligne, idéalement depuis le futur
 * dashboard admin (gestion des témoignages, Étape 5).
 */
const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Un cadre magnifique sur les champs, une cuisine tunisienne généreuse et un service très attentionné. On y retourne à chaque passage à Béja.",
    author: "Amine B.",
    context: "Client régulier",
  },
  {
    id: "t2",
    quote:
      "Le café est excellent et les pâtisseries maison valent le détour. L'endroit est calme, idéal pour se poser en famille.",
    author: "Salma T.",
    context: "Visite en famille",
  },
  {
    id: "t3",
    quote:
      "La grillade mixte et le Ftat sont incontournables. Un vrai coup de cœur pour le cadre naturel et l'accueil.",
    author: "Karim H.",
    context: "Dîner entre amis",
  },
];

export function Testimonials() {
  return (
    <section className="bg-linen py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Avis" title="Ce qu'en disent nos visiteurs" align="center" />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.figure
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex flex-col justify-between rounded-lg bg-white/60 p-8 shadow-card"
            >
              <div>
                <Quote className="h-6 w-6 text-wheat" strokeWidth={1.5} aria-hidden="true" />
                <blockquote className="mt-5 text-[0.95rem] leading-relaxed text-ink/85">
                  {testimonial.quote}
                </blockquote>
              </div>
              <figcaption className="mt-6 text-sm">
                <span className="font-semibold text-ink">{testimonial.author}</span>
                <span className="text-ink/50"> — {testimonial.context}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
