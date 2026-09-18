import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F6F1E9",
        sand: "#EAE1D2",
        charcoal: "#2B2622",
        walnut: "#4A3B31",
        walnutDark: "#3A2E26",
        gold: "#9C7A46",
        goldLight: "#B79A67",
      },
      fontFamily: {
        vazir: ["var(--font-vazir)", "Tahoma", "sans-serif"],
      },
      maxWidth: {
        content: "1320px",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s ease-out both",
        fadeIn: "fadeIn 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
