"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { restaurant } from "@/config/site";
import { media } from "@/config/media";

export function About() {
  return (
    <section className="bg-linen py-24 sm:py-32">
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-lg shadow-soft"
        >
          <Image
            src={media.exterior.src}
            alt={media.exterior.alt}
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeading
            eyebrow="L'auberge"
            title="Une ferme-auberge nichée dans la campagne de Béja"
            description={restaurant.description}
          />

          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-moss/10 px-5 py-3 text-sm font-medium text-moss">
            <Clock className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            {restaurant.hours.label} — {restaurant.type}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
