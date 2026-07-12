"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { restaurant } from "@/config/site";
import { media } from "@/config/media";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink text-linen">
      <Image
        src={media.hero.src}
        alt={media.hero.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Voile pour garantir la lisibilité du texte sur toute image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-transparent"
      />

      <Container className="relative pb-16 pt-40 sm:pb-20">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="text-[0.7rem] font-semibold uppercase tracking-widest text-wheat"
        >
          {restaurant.type}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.1}
          className="mt-6 max-w-3xl font-display text-display-xl italic text-balance"
        >
          {restaurant.name}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.2}
          className="mt-6 max-w-xl text-lg text-linen/80"
        >
          {restaurant.tagline}
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.3}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Button href="/reservation" variant="primary">
            Réserver une table
          </Button>
          <Button href="/menu" variant="outline" className="border-linen/40 text-linen">
            Découvrir le menu
          </Button>
        </motion.div>

        <motion.ul
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.4}
          className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-linen/15 pt-6 text-xs font-medium uppercase tracking-wide text-linen/60"
        >
          {restaurant.highlights.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-wheat" aria-hidden="true" />
              {item}
            </li>
          ))}
        </motion.ul>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute inset-x-0 bottom-6 flex justify-center"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6 text-linen/60" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
