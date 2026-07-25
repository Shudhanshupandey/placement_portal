import type { AppNotification } from "@/features/notifications/types";
import { simulateLatency } from "@/lib/dev-mode/latency";
import { mockDb } from "@/lib/dev-mode/mock-db";

/**
 * Development notification access — the mock counterpart of
 * `notifications.service.ts`.
 *
 * `list` reproduces the `recipientId in [uid, "all"]` query and the
 * newest-first ordering, so broadcasts and personal messages interleave here
 * exactly as they do in Firestore.
 */
export const notificationsService = {
  async list(uid: string): Promise<AppNotification[]> {
    await simulateLatency();
    return mockDb.notifications
      .listFor(uid)
      .slice()
      .sort((a, b) => b.createdAtMs - a.createdAtMs);
  },

  async markRead(id: string): Promise<void> {
    await simulateLatency(80);
    mockDb.notifications.markRead(id);
  },

  async markAllRead(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await simulateLatency(150);
    mockDb.notifications.markAllRead(ids);
  },
};
