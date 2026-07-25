/**
 * Development Mock Authentication Mode — the single on/off switch.
 *
 * Enabled when EITHER holds:
 *   • `NEXT_PUBLIC_DEV_MODE=true`  — explicit; works in any NODE_ENV.
 *   • `NODE_ENV=development`       — implicit; the local `next dev` default.
 *
 * Set `NEXT_PUBLIC_DEV_MODE=false` to force the real Firebase stack even while
 * running `next dev`. That is the switch to flip the day real credentials land
 * in `.env.local`: no code changes, no imports to unwind.
 *
 * ── Why a plain constant and not a function ──
 * Next inlines both `process.env.NEXT_PUBLIC_DEV_MODE` and
 * `process.env.NODE_ENV` at build time, so in a production build this whole
 * expression folds to a literal `false`. Every `IS_DEV_MODE ? mock : real`
 * selector then folds to `real`, and the mock modules — services, fixtures, the
 * mock session — are dropped by tree-shaking. The production bundle is
 * byte-identical to one written without this layer.
 */

const EXPLICIT = process.env.NEXT_PUBLIC_DEV_MODE;

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

/** Short human explanation of why dev mode is on — shown in the dev toolbar. */
export const DEV_MODE_REASON: string =
  EXPLICIT === "true"
    ? "NEXT_PUBLIC_DEV_MODE=true"
    : "NODE_ENV=development";
