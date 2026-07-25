/**
 * Demo / Mock Authentication Mode — the single on/off switch.
 *
 * Enabled when ANY holds:
 *   • `NEXT_PUBLIC_DEMO_MODE=true` — the public "live demo" switch. Set this on
 *     the deployed (Vercel) environment to open the portal for exploration.
 *   • `NEXT_PUBLIC_DEV_MODE=true`  — legacy alias, identical effect. Kept so
 *     existing configs keep working; both names are accepted.
 *   • `NODE_ENV=development`       — implicit; the local `next dev` default.
 *
 * Set the flag to `"false"` to force the real Firebase stack even while running
 * `next dev`. That is the switch to flip the day real credentials land: no code
 * changes, no imports to unwind. `NEXT_PUBLIC_DEMO_MODE` wins when both names
 * are present.
 *
 * ── Why a plain constant and not a function ──
 * Next inlines `process.env.NEXT_PUBLIC_DEMO_MODE`, `process.env.NEXT_PUBLIC_DEV_MODE`
 * and `process.env.NODE_ENV` at build time, so with the flag off this whole
 * expression folds to a literal `false`. Every `IS_DEV_MODE ? mock : real`
 * selector then folds to `real`, and the mock modules — services, fixtures, the
 * mock session, the demo card — are dropped by tree-shaking. The production
 * bundle is byte-identical to one written without this layer.
 *
 * The exported name stays `IS_DEV_MODE` so the ~16 call sites are untouched; it
 * now answers "is demo/mock mode on", by either variable name.
 */

// Read each name as its own direct process.env lookup so Next can inline both
// as build-time literals (a computed key would defeat that).
const DEMO = process.env.NEXT_PUBLIC_DEMO_MODE;
const DEV = process.env.NEXT_PUBLIC_DEV_MODE;

// DEMO takes precedence; fall back to the legacy DEV name when DEMO is unset.
const EXPLICIT = DEMO ?? DEV;

export const IS_DEV_MODE: boolean =
  EXPLICIT === "true" ||
  (EXPLICIT !== "false" && process.env.NODE_ENV === "development");

/**
 * True when dev mode was force-enabled inside a production build. Legitimate
 * for a UI-only preview deploy, dangerous anywhere else — the app will accept
 * the seeded credentials and serve fabricated data. Surfaced loudly rather than
 * silently blocked, because blocking it would break the preview use case the
 * flag exists for.
 */
export const IS_DEV_MODE_IN_PRODUCTION_BUILD: boolean =
  IS_DEV_MODE && process.env.NODE_ENV === "production";

/** Short human explanation of why demo mode is on — shown in the dev toolbar. */
export const DEV_MODE_REASON: string =
  DEMO === "true"
    ? "NEXT_PUBLIC_DEMO_MODE=true"
    : DEV === "true"
      ? "NEXT_PUBLIC_DEV_MODE=true"
      : "NODE_ENV=development";
