import type { Config } from "tailwindcss";

/**
 * SAITM design tokens — LOCKED palette (see CLAUDE.md).
 * Colors are literal hex so they render exactly on-brand and still support
 * Tailwind opacity modifiers (e.g. bg-primary/10).
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // Brand
        primary: {
          DEFAULT: "#18305F", // SAITM Navy
          foreground: "#FFFFFF",
          light: "#23488A", // gradient end
        },
        gold: {
          DEFAULT: "#D8AE3E", // SAITM Gold
          foreground: "#18305F",
          light: "#E7C15C",
        },
        // Surfaces
        background: "#F8F7F4",
        section: "#F5F6F8",
        card: { DEFAULT: "#FFFFFF", foreground: "#374151" },
        popover: { DEFAULT: "#FFFFFF", foreground: "#374151" },
        // Text
        heading: "#172554",
        foreground: "#374151",
        muted: { DEFAULT: "#F5F6F8", foreground: "#6B7280" },
        // shadcn semantic aliases mapped to SAITM
        secondary: { DEFAULT: "#F5F6F8", foreground: "#18305F" },
        accent: { DEFAULT: "#EEF1F6", foreground: "#18305F" },
        destructive: { DEFAULT: "#EF4444", foreground: "#FFFFFF" },
        // Lines / focus
        border: "#E5E7EB",
        input: "#E5E7EB",
        ring: "#18305F",
        // Status
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(23,37,84,0.04), 0 4px 16px rgba(23,37,84,0.06)",
        card: "0 2px 8px rgba(23,37,84,0.06), 0 12px 32px rgba(23,37,84,0.08)",
        gold: "0 6px 20px rgba(216,174,62,0.28)",
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(135deg, #18305F 0%, #23488A 100%)",
        "gold-gradient": "linear-gradient(135deg, #D8AE3E 0%, #E7C15C 100%)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
