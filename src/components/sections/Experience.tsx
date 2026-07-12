"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Accessibility,
  Coffee,
  Cookie,
  Mountain,
  ShoppingBag,
  Sparkles,
  UserCheck,
  UtensilsCrossed,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { restaurant } from "@/config/site";

const highlightIcons: LucideIcon[] = [Coffee, Cookie, Mountain, UtensilsCrossed, Sparkles, UserCheck];

const serviceIcons: Record<string, LucideIcon> = {
  "Dîner sur place": UtensilsCrossed,
  "Vente à emporter": ShoppingBag,
  "Service à table": UserCheck,
  "Accessible aux personnes à mobilité réduite": Accessibility,
};

export function Experience() {
  return (
    <section className="bg-ink py-24 text-linen sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="L'expérience"
          title="Ce qui fait la réputation du Moulin Vert"
          tone="light"
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg bg-linen/10 sm:grid-cols-2 lg:grid-cols-3">
          {restaurant.highlights.map((item, index) => {
            const Icon = highlightIcons[index % highlightIcons.length];
            return (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="flex flex-col gap-4 bg-ink p-8"
              >
                <Icon className="h-6 w-6 text-wheat" strokeWidth={1.5} aria-hidden="true" />
                <p className="font-display text-lg italic text-balance">{item}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 flex flex-wrap gap-x-10 gap-y-6 border-t border-linen/10 pt-10">
          {restaurant.services.map((service) => {
            const Icon = serviceIcons[service] ?? UtensilsCrossed;
            return (
              <div key={service} className="flex items-center gap-3 text-sm text-linen/75">
                <Icon className="h-4 w-4 shrink-0 text-wheat" strokeWidth={1.75} aria-hidden="true" />
                {service}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
