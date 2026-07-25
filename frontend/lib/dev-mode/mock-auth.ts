import type { Role } from "@/constants/roles";
import type { AuthStatus } from "@/types/models/user";
import type { StudentProfileMeta } from "@/types/models/student";
import { mockDb } from "@/lib/dev-mode/mock-db";
import { mockSession, type MockSessionIdentity } from "@/lib/dev-mode/mock-session";
import type { MockAccount } from "@/data/mock";

/**
 * Resolution of a development session into the same three values the real
 * AuthProvider derives — role (from the token claim), status (from
 * `users/{uid}`) and student meta (from `students/{uid}`).
 *
 * Kept beside the session rather than inside the provider so the mock auth
 * services can establish a session and the provider can resolve it, without
 * either importing the other.
 */

export interface ResolvedMockAuth {
  role: Role | null;
  status: AuthStatus | null;
  profile: StudentProfileMeta | null;
}

/** Derive the student display meta from the live (mutable) profile document. */
function studentMeta(uid: string): StudentProfileMeta {
  const student = mockDb.profiles.get(uid).student;
  if (!student) {
    return { exists: false, profileCompleted: false, completionPercentage: 0 };
  }
  return {
    exists: true,
    profileCompleted: Boolean(student.profileCompleted),
    completionPercentage: Number(student.completionPercentage ?? 0),
    fullName: student.fullName,
    photoUrl: student.photoUrl,
    sections: student.sections,
  };
}

export function resolveMockAuth(identity: MockSessionIdentity): ResolvedMockAuth {
  const account = mockDb.accounts.get(identity.uid);
  const role = account?.role ?? identity.role;
  const profile = role === "student" ? studentMeta(identity.uid) : null;

  // `profileCompleted` must track the live profile, not the seeded snapshot —
  // otherwise finishing the onboarding wizard would not release the guard.
  const status: AuthStatus = account
    ? {
        ...account.status,
        profileCompleted:
          role === "student"
            ? (profile?.profileCompleted ?? false)
            : account.status.profileCompleted,
      }
    : {
        role,
        profileCompleted: profile?.profileCompleted ?? false,
        verificationStatus: "unverified",
        approvalStatus: null,
        isActive: true,
      };

  return { role, status, profile };
}

/** Establish a development session for an account. */
export function signInMockAccount(account: MockAccount): MockSessionIdentity {
  return mockSession.set({
    uid: account.uid,
    email: account.email,
    role: account.role,
    displayName: account.displayName,
    photoUrl: account.photoUrl,
    emailVerified: account.emailVerified,
  });
}

/** End the development session (the mock `signOut`). */
export function signOutMock(): void {
  mockSession.clear();
}
