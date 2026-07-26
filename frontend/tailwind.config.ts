import type { Config } from "tailwindcss";

/**
 * SAITM design tokens — LOCKED palette (see CLAUDE.md).
 *
 * Every colour resolves to a CSS variable declared in `styles/globals.css`,
 * which is the single source of truth. Channels are stored as `R G B` so the
 * `<alpha-value>` placeholder keeps Tailwind's opacity modifiers working
 * (`bg-primary/10`, `text-gold/80`, `ring-ring/25`, …).
 */
const rgb = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

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
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1400px" },
    },
    screens: {
      /** Large phones (iPhone 14/15 Pro Max, Pixel Pro). Below this we design
       *  for the 360px baseline — the narrowest Android still in real use. */
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      /** Ultra-wide / 27"+ monitors — lets layouts breathe instead of
       *  stranding content in a narrow column. */
      "3xl": "1800px",
    },
    extend: {
      colors: {
        // ── Brand ──────────────────────────────────────────────────────────
        primary: {
          DEFAULT: rgb("--primary"), // SAITM Navy  #18305F
          foreground: rgb("--primary-foreground"),
          light: rgb("--primary-light"), // gradient end #23488A
        },
        gold: {
          DEFAULT: rgb("--gold"), // SAITM Gold  #D8AE3E
          foreground: rgb("--gold-foreground"),
          light: rgb("--gold-light"), // gradient end #E7C15C
          /** AA-legible gold for TEXT on light/tinted surfaces. */
          ink: rgb("--gold-ink"),
        },
        // ── Surfaces ───────────────────────────────────────────────────────
        background: rgb("--background"),
        section: rgb("--section"),
        card: { DEFAULT: rgb("--card"), foreground: rgb("--foreground") },
        popover: { DEFAULT: rgb("--popover"), foreground: rgb("--foreground") },
        // ── Text ───────────────────────────────────────────────────────────
        heading: rgb("--heading"),
        foreground: rgb("--foreground"),
        muted: { DEFAULT: rgb("--section"), foreground: rgb("--muted-foreground") },
        // ── shadcn semantic aliases mapped to SAITM ────────────────────────
        secondary: { DEFAULT: rgb("--section"), foreground: rgb("--primary") },
        accent: { DEFAULT: "#EEF1F6", foreground: rgb("--primary") },
        destructive: { DEFAULT: rgb("--error"), foreground: "#FFFFFF" },
        // ── Lines / focus ──────────────────────────────────────────────────
        border: rgb("--border"),
        input: rgb("--input"),
        ring: rgb("--ring"),
        // ── Status (tint) + matching AA ink for text on that tint ──────────
        success: { DEFAULT: rgb("--success"), ink: rgb("--success-ink") },
        warning: { DEFAULT: rgb("--warning"), ink: rgb("--warning-ink") },
        error: { DEFAULT: rgb("--error"), ink: rgb("--error-ink") },
        info: { DEFAULT: rgb("--info"), ink: rgb("--info-ink") },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        /** Hairline lift for controls that must not compete with cards. */
        xs: "0 1px 2px rgba(23,37,84,0.05)",
        soft: "0 1px 2px rgba(23,37,84,0.04), 0 4px 16px rgba(23,37,84,0.06)",
        card: "0 2px 8px rgba(23,37,84,0.06), 0 12px 32px rgba(23,37,84,0.08)",
        /** Hover state for interactive cards. */
        lift: "0 4px 12px rgba(23,37,84,0.08), 0 20px 44px rgba(23,37,84,0.10)",
        gold: "0 6px 20px rgba(216,174,62,0.28)",
        /** Off-canvas drawer / bottom sheet. */
        drawer: "0 0 0 1px rgba(23,37,84,0.05), 24px 0 64px rgba(23,37,84,0.24)",
      },
      backgroundImage: {
        "primary-gradient":
          "linear-gradient(135deg, rgb(var(--primary)) 0%, rgb(var(--primary-light)) 100%)",
        "gold-gradient":
          "linear-gradient(135deg, rgb(var(--gold)) 0%, rgb(var(--gold-light)) 100%)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        /** Fluid display sizes — scale with the viewport instead of stepping
         *  at breakpoints, so headings never wrap awkwardly on a 360px phone
         *  nor look undersized on a 27" monitor. */
        "display-sm": ["clamp(1.375rem, 1.15rem + 1.1vw, 1.75rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.625rem, 1.25rem + 1.8vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 1.4rem + 2.8vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        /** Tabular metric readout used on KPI tiles. */
        metric: ["clamp(1.5rem, 1.25rem + 1.1vw, 2rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
      },
      spacing: {
        /** Minimum comfortable touch target (WCAG 2.2 AA target size). */
        touch: "2.75rem", // 44px
        "safe-b": "env(safe-area-inset-bottom)",
      },
      minWidth: { touch: "2.75rem" },
      minHeight: { touch: "2.75rem" },
      maxWidth: {
        /** Reading measure for prose blocks and empty-state copy. */
        prose: "68ch",
        /** Main content column at very large viewports. */
        content: "96rem",
      },
      transitionTimingFunction: {
        premium: "var(--ease-premium)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
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
        "fade-in": "fade-in 0.3s var(--ease-premium)",
        "fade-up": "fade-up 0.4s var(--ease-premium)",
        "scale-in": "scale-in 0.2s var(--ease-premium)",
        shimmer: "shimmer 1.8s infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
