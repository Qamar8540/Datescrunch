import type { Config } from "tailwindcss";

// DatesCrunch design tokens
// Palette drawn from the product itself: date-skin mahogany, toffee gold,
// and a warm ivory background — not the generic cream/terracotta combo.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#FBF6EC",       // page background
        coffee: "#2B1B12",      // primary text / ink
        mahogany: "#7A3E1D",    // primary brand accent (date-skin brown)
        "mahogany-dark": "#5C2E15",
        toffee: "#C9A227",      // secondary accent (gold, dates/dry fruits)
        olive: "#6B7A4F",       // stock / success states
        rust: "#A83B32",        // errors / destructive actions
        sand: "#EFE6D6",        // card / section background
        stone: "#8A7B6C",       // muted text
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-work-sans)", "Helvetica", "Arial", "sans-serif"],
      },
      borderRadius: {
        card: "0.375rem",
      },
    },
  },
  plugins: [],
};

export default config;
