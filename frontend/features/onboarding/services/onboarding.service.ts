import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { computeCompletion } from "@/features/onboarding/lib/profile-completion";
import type { OnboardingData } from "@/features/onboarding/schemas";

/** Recursively drop `undefined` and empty-string values (Firestore rejects undefined). */
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
  /**
   * Persist all collected onboarding data across the four Firestore collections,
   * keyed by the student's Firebase UID. Skipped sections are stored as-is
   * (incomplete) and reflected in `sections` + `completionPercentage`.
   */
  async save(
    uid: string,
    email: string,
    data: OnboardingData
  ): Promise<{ completionPercentage: number }> {
    const { percentage, sections } = computeCompletion(data);
    const batch = writeBatch(db);

    // students/{uid} — identity + personal details + onboarding meta
    batch.set(
      doc(db, "students", uid),
      sanitize({
        uid,
        email,
        role: "student",
        ...data.personal,
        profileCompleted: true,
        completionPercentage: percentage,
        sections,
        updatedAt: serverTimestamp(),
      }),
      { merge: true }
    );

    // users/{uid} — canonical identity: mark profile complete and move the
    // student into "pending" admin verification (placement access is gated on it).
    batch.set(
      doc(db, "users", uid),
      {
        uid,
        email,
        role: "student",
        profileCompleted: true,
        verificationStatus: "pending",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // academicDetails/{uid}
    batch.set(
      doc(db, "academicDetails", uid),
      sanitize({ uid, ...data.academic, updatedAt: serverTimestamp() }),
      { merge: true }
    );

    // professionalDetails/{uid}
    batch.set(
      doc(db, "professionalDetails", uid),
      sanitize({ uid, ...data.professional, updatedAt: serverTimestamp() }),
      { merge: true }
    );

    // documents/{uid}
    batch.set(
      doc(db, "documents", uid),
      sanitize({ uid, ...data.documents, updatedAt: serverTimestamp() }),
      { merge: true }
    );

    await batch.commit();
    return { completionPercentage: percentage };
  },
};
