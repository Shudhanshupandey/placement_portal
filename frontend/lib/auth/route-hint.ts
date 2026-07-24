import type { Role, VerificationStatus, ApprovalStatus } from "@/constants/roles";

/**
 * A NON-sensitive routing hint stored in a readable cookie so edge middleware
 * can perform early redirects. This is NOT a security boundary — Firestore
 * Security Rules + custom claims enforce authorization. A forged cookie only
 * affects which page shell renders; data reads are still denied by rules and
 * client guards re-check on mount.
 */
export const ROUTE_HINT_COOKIE = "saitm-auth";

export interface RouteHint {
  role: Role;
  profileCompleted: boolean;
  verificationStatus: VerificationStatus;
  approvalStatus: ApprovalStatus | null;
}

export function writeRouteHint(hint: RouteHint): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify(hint));
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  document.cookie = `${ROUTE_HINT_COOKIE}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
}

export function clearRouteHint(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${ROUTE_HINT_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

/** Parse the cookie value (used by middleware). Returns null if invalid. */
export function parseRouteHint(raw: string | undefined): RouteHint | null {
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as RouteHint;
  } catch {
    return null;
  }
}
