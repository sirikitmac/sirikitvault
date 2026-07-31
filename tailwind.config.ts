import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        charcoal: {
          950: "#0F0C0A",
          900: "#16120F",
          850: "#1C1713",
          800: "#241E18",
        },
        cream: {
          50: "#FCF9F4",
          100: "#F6EFE5",
        },
        accent: {
          50: "#FFFCEB",
          100: "#FFF6C2",
          200: "#FFEC85",
          300: "#FFE04D",
          400: "#FFD60A",
          500: "#E6B800",
          600: "#C79A00",
          700: "#A47D00",
          800: "#7A5D00",
          900: "#544000",
        },
      },
      borderRadius: {
        "2.5xl": "1.25rem",
        "3.5xl": "1.75rem",
      },
      boxShadow: {
        "glass-light":
          "0 1px 2px rgba(38,28,18,0.04), 0 8px 24px -8px rgba(38,28,18,0.10)",
        "glass-light-hover":
          "0 2px 4px rgba(38,28,18,0.05), 0 20px 44px -12px rgba(38,28,18,0.16)",
        "glass-dark":
          "0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 32px -12px rgba(0,0,0,0.6)",
        "glass-dark-hover":
          "0 1px 0 rgba(255,255,255,0.07) inset, 0 24px 56px -16px rgba(0,0,0,0.75)",
        "accent-glow": "0 8px 20px -6px rgba(255,214,10,0.45)",
        "accent-glow-hover": "0 12px 28px -6px rgba(255,214,10,0.55)",
      },
    },
  },
  plugins: [],
};

export default config;
