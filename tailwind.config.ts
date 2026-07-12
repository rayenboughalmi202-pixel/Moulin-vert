import type { Config } from "tailwindcss";

/**
 * Système de design — Moulin Vert Béja
 * -------------------------------------
 * Palette inspirée du lieu réel : le vert sombre des oliviers et des champs
 * au crépuscule, le lin naturel des nappes de la ferme-auberge, l'or du blé
 * mûr, et une pointe d'épice tunisienne (harissa) utilisée avec parcimonie.
 *
 * Volontairement à l'écart des couples "fond crème + serif + terracotta"
 * ou "fond noir + accent acide" trop vus dans les sites générés par IA :
 * ici le vert olive profond porte l'identité, le lin sert de respiration,
 * et l'or du blé est la seule vraie touche de lumière.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "2rem",
        lg: "3rem",
        xl: "4rem",
      },
    },
    extend: {
      colors: {
        ink: "#171B13",
        moss: {
          DEFAULT: "#3F4A2C",
          dark: "#232A18",
          light: "#5B6A3C",
        },
        linen: {
          DEFAULT: "#F1ECDD",
          dark: "#E4DCC5",
        },
        wheat: {
          DEFAULT: "#C99A3D",
          dark: "#A97F2E",
          light: "#E1BE73",
        },
        rust: {
          DEFAULT: "#9C4A2E",
          dark: "#7C3A23",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 6vw, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.01em" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 3.75rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.1" }],
      },
      letterSpacing: {
        widest: "0.28em",
      },
      boxShadow: {
        soft: "0 20px 60px -15px rgba(23, 27, 19, 0.35)",
        card: "0 10px 30px -10px rgba(23, 27, 19, 0.25)",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
      transitionTimingFunction: {
        organic: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
