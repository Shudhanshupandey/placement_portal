"use client";

import * as React from "react";
import type { User } from "firebase/auth";
import { AuthContext, type AuthContextValue } from "@/contexts/auth-context";
import type { StudentProfileMeta } from "@/types/models/student";
import type { AuthStatus } from "@/types/models/user";
import type { Role } from "@/constants/roles";
import { writeRouteHint, clearRouteHint } from "@/lib/auth/route-hint";
import {
  createMockFirebaseUser,
  mockSession,
  resolveMockAuth,
  signOutMock,
  DEV_MODE_REASON,
  IS_DEV_MODE_IN_PRODUCTION_BUILD,
} from "@/lib/dev-mode";

/**
 * Development counterpart of `providers/auth-provider.tsx`.
 *
 * Same context, same `AuthContextValue`, same `User` type, same routing-hint
 * cookie — the only difference is where the session comes from. Read the two
 * files side by side: the structure is intentionally identical so that a change
 * to one is obviously required in the other.
 *
 * Mounted only when `IS_DEV_MODE` is true (see `providers/app-providers.tsx`).
 * With the flag off this component is never rendered and tree-shakes away.
 */

interface Resolved {
  role: Role | null;
  status: AuthStatus | null;
  profile: StudentProfileMeta | null;
}

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [role, setRole] = React.useState<Role | null>(null);
  const [status, setStatus] = React.useState<AuthStatus | null>(null);
  const [profile, setProfile] = React.useState<StudentProfileMeta | null>(null);
  const [loading, setLoading] = React.useState(true);

  const applyResolved = React.useCallback((r: Resolved) => {
    setRole(r.role);
    setStatus(r.status);
    setProfile(r.profile);
    // Same non-sensitive hint the Firebase provider writes — this is what keeps
    // the untouched edge middleware working identically in dev mode.
    if (r.role) {
      writeRouteHint({
        role: r.role,
        profileCompleted: r.status?.profileCompleted ?? r.profile?.profileCompleted ?? false,
        verificationStatus: r.status?.verificationStatus ?? "unverified",
        approvalStatus: r.status?.approvalStatus ?? null,
      });
    }
  }, []);

  const sync = React.useCallback(() => {
    const identity = mockSession.get();
    if (identity) {
      setUser(createMockFirebaseUser(identity));
      applyResolved(resolveMockAuth(identity));
    } else {
      setUser(null);
      setRole(null);
      setStatus(null);
      setProfile(null);
      clearRouteHint();
    }
    setLoading(false);
  }, [applyResolved]);

  // Subscribe first, then read — the same order `onAuthStateChanged` guarantees,
  // so a sign-in that lands between mount and subscribe is never missed.
  React.useEffect(() => {
    const unsubscribe = mockSession.subscribe(sync);
    sync();
    return unsubscribe;
  }, [sync]);

  // One loud line in the console. A production build running on fabricated
  // credentials must never be a silent condition.
  React.useEffect(() => {
    if (IS_DEV_MODE_IN_PRODUCTION_BUILD) {
      console.warn(
        "[dev-mode] Mock authentication is ACTIVE in a production build " +
          `(${DEV_MODE_REASON}). Sign-in accepts seeded credentials and all data ` +
          "is fabricated. Set NEXT_PUBLIC_DEV_MODE=false before shipping to users."
      );
    } else {
      console.info(
        `[dev-mode] Mock authentication active (${DEV_MODE_REASON}). ` +
          "Firebase is untouched — set NEXT_PUBLIC_DEV_MODE=false to use it."
      );
    }
  }, []);

  const refreshProfile = React.useCallback(async () => {
    const identity = mockSession.get();
    if (identity) {
      setUser(createMockFirebaseUser(identity));
      applyResolved(resolveMockAuth(identity));
    }
  }, [applyResolved]);

  const signOut = React.useCallback(async () => {
    clearRouteHint();
    signOutMock();
  }, []);

  const value: AuthContextValue = React.useMemo(
    () => ({ user, loading, role, status, profile, refreshProfile, signOut }),
    [user, loading, role, status, profile, refreshProfile, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
