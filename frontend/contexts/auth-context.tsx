"use client";

import { createContext } from "react";
import type { User } from "firebase/auth";
import type { StudentProfileMeta } from "@/types/models/student";
import type { AuthStatus } from "@/types/models/user";
import type { Role } from "@/constants/roles";

export interface AuthContextValue {
  /** Firebase auth user, or null when signed out. */
  user: User | null;
  /** True until the initial auth + role + status resolution completes. */
  loading: boolean;
  /** Role from the ID-token custom claim (authoritative), or null. */
  role: Role | null;
  /** Canonical auth status from users/{uid} (completion, verification, approval). */
  status: AuthStatus | null;
  /** Student display meta from students/{uid} (name, photo, completion %). */
  profile: StudentProfileMeta | null;
  /** Re-read role + status + student meta (e.g., after onboarding/approval). */
  refreshProfile: () => Promise<void>;
  /** Sign the current user out. */
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
