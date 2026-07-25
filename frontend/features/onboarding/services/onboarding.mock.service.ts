import type { StudentProfile } from "@/types/models/student";
import type { FullStudentProfile } from "@/features/profile";
import { computeCompletion } from "@/features/onboarding/lib/profile-completion";
import type { OnboardingData } from "@/features/onboarding/schemas";
import { simulateLatency } from "@/lib/dev-mode/latency";
import { mockDb } from "@/lib/dev-mode/mock-db";

/**
 * Development onboarding persistence — the mock counterpart of
 * `onboarding.service.ts`.
 *
 * Writes the same four documents into the mock store, runs the same
 * `computeCompletion` logic (imported, not reimplemented — completion
 * percentages must never diverge between the two paths) and applies the same
 * side effect on the user record: `profileCompleted = true` and
 * `verificationStatus = "pending"`, which is what moves a student into the
 * admin review queue in production.
 */

/** Drop `undefined`/`""` recursively — mirrors the Firestore-safe sanitiser. */
function sanitize<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => sanitize(v)).filter((v) => v !== undefined) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === undefined || v === "") continue;
      out[k] = sanitize(v);
    }
    return out as T;
  }
  return value;
}

export const onboardingService = {
  async save(
    uid: string,
    email: string,
    data: OnboardingData
  ): Promise<{ completionPercentage: number }> {
    await simulateLatency(700);

    const { percentage, sections } = computeCompletion(data);

    // Cast once, deliberately: the wizard's form values carry `"" | undefined`
    // unions that Zod allows but `StudentProfile` does not. `sanitize` removes
    // exactly those, which is why Firestore accepts the same object upstream.
    const student = {
      uid,
      email,
      role: "student",
      ...sanitize(data.personal),
      profileCompleted: true,
      completionPercentage: percentage,
      sections,
    } as unknown as StudentProfile;

    const profile: FullStudentProfile = {
      student,
      academic: sanitize(data.academic),
      professional: sanitize(data.professional),
      documents: sanitize(data.documents),
    };

    mockDb.profiles.save(uid, profile);

    // users/{uid} equivalent: completing onboarding submits the profile for
    // admin verification. Placement access is gated on this in production.
    const account = mockDb.accounts.get(uid);
    if (account) {
      mockDb.accounts.patch(uid, {
        displayName: student.fullName || account.displayName,
        photoUrl: student.photoUrl ?? account.photoUrl,
        status: {
          ...account.status,
          profileCompleted: true,
          verificationStatus: "pending",
        },
        statusLabel: `Pending verification · Profile ${percentage}%`,
      });
    }

    return { completionPercentage: percentage };
  },
};
