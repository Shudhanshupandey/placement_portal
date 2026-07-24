import path from "node:path";

/**
 * Content-Security-Policy sources the portal genuinely needs.
 *
 * `'unsafe-inline'` is unavoidable without a nonce pipeline: Next injects an
 * inline bootstrap script, and both Tailwind and next/font emit inline styles.
 * `'unsafe-eval'` is only reachable in dev (React Refresh); it is dropped from
 * the production policy below.
 */
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://firebasestorage.googleapis.com https://lh3.googleusercontent.com",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  // Firebase Auth/Firestore/Storage, callable Functions, Cloudinary uploads.
  "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://*.cloudfunctions.net https://api.cloudinary.com",
  // Firebase Auth renders its handler in an iframe on the auth domain.
  "frame-src 'self' https://*.firebaseapp.com",
  "upgrade-insecure-requests",
];

const scriptSrc =
  process.env.NODE_ENV === "production"
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

const contentSecurityPolicy = [...CSP_DIRECTIVES, scriptSrc].join("; ");

/**
 * Headers applied to every response.
 *
 * CSP ships in Report-Only mode on purpose. A mis-scoped policy silently breaks
 * sign-in for real students, so it must be observed in the browser console
 * against the deployed origin BEFORE it is enforced. To enforce it, rename the
 * key below to `Content-Security-Policy` — see docs/18_DEPLOYMENT_GUIDE.md.
 */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this app (several lockfiles exist on disk).
  outputFileTracingRoot: path.resolve(),
  // Don't advertise the framework/version to attackers.
  poweredByHeader: false,
  // gzip/brotli at the edge on Vercel; this covers self-hosted `next start`.
  compress: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    // Serve modern formats; Cloudinary transforms still apply upstream.
    formats: ["image/avif", "image/webp"],
  },
  typescript: {
    // Type errors DO fail the build — we want that safety.
    ignoreBuildErrors: false,
  },
  eslint: {
    // Lint runs separately via `npm run lint`; don't block production builds on style.
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
