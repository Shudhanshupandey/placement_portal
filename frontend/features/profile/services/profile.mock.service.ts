import { simulateLatency } from "@/lib/dev-mode/latency";
import { mockDb } from "@/lib/dev-mode/mock-db";
import type { FullStudentProfile, StudentSettings } from "@/features/profile/types";

/**
 * Development profile access — the mock counterpart of `profile.service.ts`.
 *
 * `getFull` returns the same four-document shape the Firestore version
 * assembles, including the "document missing" case: an unknown uid yields
 * `{ student: null, academic: {}, professional: {}, documents: {} }` rather
 * than throwing, so every empty state on the profile pages stays reachable.
 */
export const profileService = {
  async getFull(uid: string): Promise<FullStudentProfile> {
    await simulateLatency();
    return mockDb.profiles.get(uid);
  },

  async updateSettings(uid: string, settings: StudentSettings): Promise<void> {
    await simulateLatency();
    mockDb.profiles.patchStudent(uid, settings);
  },
};
