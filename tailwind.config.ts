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
      borderRadius: {
        "2.5xl": "1.25rem",
        "3.5xl": "1.75rem",
      },
      boxShadow: {
        // Gray-tinted ambient shadows — Cosmos is flat, so elevation reads
        // through soft diffuse shadow rather than borders or glow.
        soft: "0 1px 2px rgba(18,18,16,0.04), 0 10px 24px -10px rgba(18,18,16,0.10)",
        "soft-hover": "0 2px 6px rgba(18,18,16,0.05), 0 22px 44px -12px rgba(18,18,16,0.14)",
        "soft-dark": "0 1px 0 rgba(255,255,255,0.03) inset, 0 10px 28px -10px rgba(0,0,0,0.55)",
        "soft-dark-hover": "0 1px 0 rgba(255,255,255,0.05) inset, 0 22px 48px -14px rgba(0,0,0,0.65)",
      },
    },
  },
  plugins: [],
};

export default config;
