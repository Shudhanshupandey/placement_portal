/**
 * Avatar images for the development fixtures.
 *
 * Inline SVG data URIs rather than remote photos: the CSP allows `img-src …
 * data:` with no third-party host, the marks render identically offline, and
 * they stay inside the locked colour palette. In production these fields hold
 * Cloudinary URLs (student photos are media) — same field, same string type.
 */

/** Locked-palette tints, deliberately the calm end of the scale for faces. */
const AVATAR_TINTS = ["#18305F", "#23488A", "#3B82F6", "#172554"] as const;

function initialsOf(name: string): string {
  const parts = name
    .replace(/^(dr|mr|mrs|ms|prof)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Deterministic circular initials avatar for a person. */
export function avatarFor(name: string): string {
  const seed = Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const bg = AVATAR_TINTS[seed % AVATAR_TINTS.length];
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96" role="img" aria-label="${name}">`,
    `<circle cx="48" cy="48" r="48" fill="${bg}"/>`,
    `<text x="48" y="61" text-anchor="middle" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="34" font-weight="600" fill="#FFFFFF">${initialsOf(name)}</text>`,
    `</svg>`,
  ].join("");
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
