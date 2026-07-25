import type { PlacementDrive } from "@/features/placement-drives/types";
import { simulateLatency } from "@/lib/dev-mode/latency";
import { mockDb } from "@/lib/dev-mode/mock-db";

/**
 * Development placement-drive access — the mock counterpart of
 * `drives.service.ts`.
 *
 * The `status === "published"` filter and the soonest-deadline-first ordering
 * are reproduced exactly, so drafts stay invisible to students here just as the
 * Firestore query keeps them invisible in production.
 */
export const drivesService = {
  async listPublished(): Promise<PlacementDrive[]> {
    await simulateLatency();
    return mockDb.drives
      .list()
      .filter((d) => d.status === "published")
      .sort((a, b) => (a.lastDateMs || Infinity) - (b.lastDateMs || Infinity));
  },

  async get(id: string): Promise<PlacementDrive | null> {
    await simulateLatency();
    return mockDb.drives.get(id);
  },
};
