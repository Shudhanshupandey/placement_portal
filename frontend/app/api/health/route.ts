import { NextResponse } from "next/server";

/**
 * Liveness probe for uptime monitors and platform health checks.
 *
 * Deliberately dependency-free: it reports that the Next.js runtime is serving
 * traffic and whether the Firebase/Cloudinary env vars were present at build
 * time. It does NOT call Firestore — a probe that fans out to third parties
 * turns their outage into our "unhealthy", and gives unauthenticated callers a
 * free way to generate reads.
 *
 * Never returns secret VALUES, only whether each key is configured.
 */

// Always evaluated per-request; never captured into the static prerender.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET() {
  const configured = {
    firebase: Boolean(
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ),
    cloudinary: Boolean(
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    ),
  };

  return NextResponse.json(
    {
      status: "ok",
      service: "saitm-placement-portal-web",
      timestamp: new Date().toISOString(),
      configured,
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-store, max-age=0" },
    }
  );
}
