"use client";

import * as React from "react";
import {
  onAuthStateChanged,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { AuthContext, type AuthContextValue } from "@/contexts/auth-context";
import type { StudentProfileMeta } from "@/types/models/student";
import type { AuthStatus } from "@/types/models/user";
import type { Role } from "@/constants/roles";
import { writeRouteHint, clearRouteHint } from "@/lib/auth/route-hint";

interface Resolved {
  role: Role | null;
  status: AuthStatus | null;
  profile: StudentProfileMeta | null;
}

async function resolveAuth(fbUser: User): Promise<Resolved> {
  // Role is authoritative from the custom claim.
  let role: Role | null = null;
  try {
    const token = await fbUser.getIdTokenResult();
    role = (token.claims.role as Role | undefined) ?? null;
  } catch {
    role = null;
  }

  // Canonical status from users/{uid}.
  let status: AuthStatus | null = null;
  try {
    const snap = await getDoc(doc(db, "users", fbUser.uid));
    if (snap.exists()) {
      const d = snap.data();
      status = {
        role: (d.role as Role) ?? role ?? "student",
        profileCompleted: Boolean(d.profileCompleted),
        verificationStatus: d.verificationStatus ?? "unverified",
        approvalStatus: d.approvalStatus ?? null,
        isActive: d.isActive !== false,
        rejectionReason: d.rejectionReason,
      };
      if (!role) role = status.role;
    }
  } catch {
    status = null;
  }

  // Student display meta (name/photo/completion) from students/{uid}.
  let profile: StudentProfileMeta | null = null;
  if ((role ?? status?.role) === "student") {
    try {
      const snap = await getDoc(doc(db, "students", fbUser.uid));
      if (snap.exists()) {
        const d = snap.data();
        profile = {
          exists: true,
          profileCompleted: Boolean(d.profileCompleted),
          completionPercentage: Number(d.completionPercentage ?? 0),
          fullName: d.fullName,
          photoUrl: d.photoUrl,
          sections: d.sections,
        };
      } else {
        profile = { exists: false, profileCompleted: false, completionPercentage: 0 };
      }
    } catch {
      profile = { exists: false, profileCompleted: false, completionPercentage: 0 };
    }
  }

  return { role, status, profile };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [role, setRole] = React.useState<Role | null>(null);
  const [status, setStatus] = React.useState<AuthStatus | null>(null);
  const [profile, setProfile] = React.useState<StudentProfileMeta | null>(null);
  const [loading, setLoading] = React.useState(true);

  const applyResolved = React.useCallback((r: Resolved) => {
    setRole(r.role);
    setStatus(r.status);
    setProfile(r.profile);
    // Write the (non-sensitive) routing hint for edge middleware.
    if (r.role) {
      writeRouteHint({
        role: r.role,
        profileCompleted: r.status?.profileCompleted ?? r.profile?.profileCompleted ?? false,
        verificationStatus: r.status?.verificationStatus ?? "unverified",
        approvalStatus: r.status?.approvalStatus ?? null,
      });
    }
  }, []);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        applyResolved(await resolveAuth(fbUser));
      } else {
        setRole(null);
        setStatus(null);
        setProfile(null);
        clearRouteHint();
      }
      setLoading(false);
    });
    return () => unsub();
  }, [applyResolved]);

  const refreshProfile = React.useCallback(async () => {
    if (auth.currentUser) {
      // Reload to pick up emailVerified / claim changes, then re-resolve.
      await auth.currentUser.reload().catch(() => {});
      setUser(auth.currentUser);
      applyResolved(await resolveAuth(auth.currentUser));
    }
  }, [applyResolved]);

  const signOut = React.useCallback(async () => {
    clearRouteHint();
    await fbSignOut(auth);
  }, []);

  const value: AuthContextValue = React.useMemo(
    () => ({ user, loading, role, status, profile, refreshProfile, signOut }),
    [user, loading, role, status, profile, refreshProfile, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
