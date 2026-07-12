/**
 * Source unique de vérité pour les visuels du restaurant.
 *
 * Toutes les URLs proviennent des photos Google fournies pour le projet.
 * `next.config.ts` autorise déjà le domaine `lh3.googleusercontent.com`.
 * À partir de l'Étape 5, le dashboard admin permettra de gérer la galerie
 * depuis Firestore/Storage — cette structure est prête pour ça.
 */
export const media = {
  hero: {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAECxEWdaeb00wL0GfDe_x--X1VfEvmnte2tOcf7QXc6qoiYOL5k-fcvLDzc0PS4jgyYqZLwaZPVkN0JWmc0R1Bf2KC9ikm6JJEJnuB4-_2d9qv76eAWDkKrL0vVO00r66nhzR8ShBsydBj_=w1024-h1536-k-no",
    alt: "Terrasse et ambiance naturelle du Moulin Vert Béja",
  },
  exterior: {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAF9lj4pDhoZtIYX7rb9VNiuV9RXKycXvrQC2P3C-gbLDIHfWdIOY0SeEXAMXimCLe2UU1UCpD2_RewarWBw_ip3I6p8a8fWGnX5RjsqTopkY1eXKr2k2hgryR-lFGVeH0r3v6Xg8Q=w1024-h1536-k-no",
    alt: "Vue extérieure de la ferme-auberge Moulin Vert Béja sur les champs",
  },
  grillades: {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGlDpqqVJMlimLF6-rDJwldmPGkI0NESa2ploFtrOYKyYbQvrrxSTinzqYGDTF1k9Xr_TZqMakAC9upaMTxYLflAfC2r7VVz_BBla-sRGgY-YFSoiIy4j48icbZZL3jXMk7xVyx=w1024-h1536-k-no",
    alt: "Grillade mixte du Moulin Vert Béja",
  },
  menu: [
    {
      src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEYchKPptpEWgn8VcY_APsUe4A-l9yRqdf3NuX-5SXpLUtsbt6B4lQmuKwuERrGgBNs-6KBS9Vg1XdBP3hzjePJwRUdgQCaU3egSgThsOo7qB4_6_3eqUYpgxfTpB25vV_4DpZBumvqA-LP=w1024-h1536-k-no",
      alt: "Carte du menu du Moulin Vert Béja",
    },
    {
      src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAH5hENS-5ylJBddZlG5aVkOlUCv3i2efavw6hXwsNEs25hgFQbHZgW1FOFAv_LUSkykg5tGpUKnTBHXtYS5okyfEtbRjS_Z-c9_mxR3nvkwZjbaYOCrRRZ9MVuII7Q0xPPOZ2KIA8KXYkY=w1024-h1536-k-no",
      alt: "Carte du menu du Moulin Vert Béja, page boissons et plats",
    },
  ],
} as const;
