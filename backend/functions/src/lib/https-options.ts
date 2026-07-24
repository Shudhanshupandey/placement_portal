import { logger } from "firebase-functions/v2";
import type { CallableOptions } from "firebase-functions/v2/https";

/**
 * Shared HTTPS/callable options — region, CORS allowlist, scaling cap.
 *
 * A browser only accepts a cross-origin response when the endpoint echoes an
 * `Access-Control-Allow-Origin` header matching the calling page's origin, and
 * only sends the real request after an OPTIONS preflight gets those headers
 * back. `firebase-functions` defaults callables to `cors: true`, which reflects
 * *any* origin; we pin an explicit allowlist instead so only the portal's own
 * frontends can invoke the API from a browser.
 *
 * Every HTTPS-facing function MUST spread `CALLABLE_OPTIONS` (or, for raw
 * `onRequest` endpoints, pass `cors: ALLOWED_ORIGINS`) so no endpoint can drift
 * back to the permissive default.
 */

const REGION = process.env.FUNCTIONS_REGION ?? "asia-south1";

/** Local Next.js dev server origins (`next dev` binds both hostnames). */
const DEV_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"];

/**
 * Normalize to a bare `scheme://host[:port]` origin so trailing slashes, paths
 * or casing in configuration can't silently produce a never-matching entry.
 */
function normalizeOrigin(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return `${url.protocol}//${url.host}`.toLowerCase();
  } catch {
    logger.warn(`[cors] Ignoring malformed origin in configuration: "${raw}"`);
    return null;
  }
}

/** Comma-separated production origins, e.g. "https://placements.saitm.ac.in". */
function configuredOrigins(): string[] {
  return (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map(normalizeOrigin)
    .filter((o): o is string => o !== null);
}

/** The project's own Firebase Hosting domains — always ours, always safe. */
function firebaseHostingOrigins(): string[] {
  const projectId =
    process.env.GCLOUD_PROJECT ?? process.env.GOOGLE_CLOUD_PROJECT ?? "";
  if (!projectId) return [];
  return [
    `https://${projectId}.web.app`,
    `https://${projectId}.firebaseapp.com`,
  ];
}

/**
 * Vercel preview deployments get a fresh URL per commit, so they can only be
 * matched by pattern. Scoped to one project slug via
 * `CORS_VERCEL_PREVIEW_PROJECT` — never a blanket `*.vercel.app`, which would
 * let anybody's Vercel deployment call this API.
 */
function vercelPreviewPattern(): RegExp[] {
  const slug = (process.env.CORS_VERCEL_PREVIEW_PROJECT ?? "").trim();
  if (!slug) return [];
  if (!/^[a-z0-9-]+$/i.test(slug)) {
    logger.warn(`[cors] Ignoring invalid CORS_VERCEL_PREVIEW_PROJECT: "${slug}"`);
    return [];
  }
  return [new RegExp(`^https://${slug}-[a-z0-9-]+\\.vercel\\.app$`, "i")];
}

function buildAllowedOrigins(): Array<string | RegExp> {
  const allowLocalhost = process.env.CORS_ALLOW_LOCALHOST !== "false";
  const production = [...configuredOrigins(), ...firebaseHostingOrigins()];

  if (production.length === 0) {
    logger.warn(
      "[cors] No production origins configured. Set CORS_ALLOWED_ORIGINS " +
        "(comma-separated) to the deployed frontend origin(s), or browser " +
        "requests from production will be blocked."
    );
  }

  // De-duplicate exact origins; regex patterns are appended as-is.
  const exact = [...new Set([...(allowLocalhost ? DEV_ORIGINS : []), ...production])];
  return [...exact, ...vercelPreviewPattern()];
}

/** Origins permitted to call this API from a browser. */
export const ALLOWED_ORIGINS: Array<string | RegExp> = buildAllowedOrigins();

/** Baseline options for every callable in this codebase. */
export const CALLABLE_OPTIONS = {
  region: REGION,
  cors: ALLOWED_ORIGINS,
  maxInstances: 10,
} satisfies CallableOptions;
