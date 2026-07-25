/**
 * Company logos for the development fixtures.
 *
 * Two constraints shape this file:
 *   1. CLAUDE.md locks the colour palette — demo content may not smuggle in
 *      off-brand brand colours, so logos are tinted from the locked tokens only.
 *   2. The CSP in next.config.mjs allows `img-src ... data:` but no third-party
 *      logo CDN, and next.config's `images.remotePatterns` lists only Cloudinary
 *      / Firebase Storage. Inline SVG data URIs therefore need no config change,
 *      no network round-trip, and no Cloudinary account to develop against.
 *
 * In production these fields hold real Cloudinary URLs (logos are media — see
 * the locked storage split). The field name and shape are identical, so nothing
 * downstream changes when real logos arrive.
 */

/** Locked-palette tints used to differentiate demo company marks. */
const LOGO_TINTS = [
  "#18305F", // SAITM Navy (primary)
  "#23488A", // Primary gradient end
  "#D8AE3E", // SAITM Gold (secondary)
  "#3B82F6", // Info
  "#22C55E", // Success
  "#F59E0B", // Warning
] as const;

/** Gold reads poorly under white text; use the heading navy instead. */
const FOREGROUND_FOR: Record<string, string> = {
  "#D8AE3E": "#172554",
  "#F59E0B": "#172554",
};

/** "Tata Consultancy" → "TC", "Infosys" → "IN". */
function initialsOf(name: string): string {
  const words = name
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !/^(pvt|ltd|inc|llp|technologies|labs)$/i.test(w));
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Deterministic inline-SVG logo for a demo company. Deterministic matters:
 * the same company must render the same mark on every page and every reload.
 */
export function companyLogo(name: string, tintIndex?: number): string {
  const seed =
    tintIndex ??
    Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const bg = LOGO_TINTS[seed % LOGO_TINTS.length];
  const fg = FOREGROUND_FOR[bg] ?? "#FFFFFF";
  const initials = initialsOf(name);

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="${name}">`,
    `<rect width="64" height="64" rx="14" fill="${bg}"/>`,
    `<text x="32" y="41" text-anchor="middle" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="24" font-weight="700" fill="${fg}">${initials}</text>`,
    `</svg>`,
  ].join("");

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
