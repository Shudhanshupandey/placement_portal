import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { StudentProfile } from "@/types/models/student";
import type { FullStudentProfile, StudentSettings } from "@/features/profile/types";

export const profileService = {
  /** Load the student's four profile documents in parallel. */
  async getFull(uid: string): Promise<FullStudentProfile> {
    const [s, a, p, d] = await Promise.all([
      getDoc(doc(db, "students", uid)),
      getDoc(doc(db, "academicDetails", uid)),
      getDoc(doc(db, "professionalDetails", uid)),
      getDoc(doc(db, "documents", uid)),
    ]);

    return {
      student: s.exists() ? (s.data() as StudentProfile) : null,
      academic: a.exists() ? a.data() : {},
      professional: p.exists() ? p.data() : {},
      documents: d.exists() ? d.data() : {},
    };
  },

  /**
   * Persist the student's notification/visibility preferences.
   *
   * Lifted verbatim out of `app/(student)/settings/page.tsx`: the write itself
   * is unchanged, it simply lives in the data layer now, where CLAUDE.md
   * requires Firestore access to sit (components → hooks → services).
   */
  async updateSettings(uid: string, settings: StudentSettings): Promise<void> {
    await updateDoc(doc(db, "students", uid), { ...settings });
  },
};
