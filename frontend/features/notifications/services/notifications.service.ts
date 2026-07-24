import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { AppNotification } from "@/features/notifications/types";

function toMs(value: unknown): number {
  if (!value) return 0;
  if (typeof value === "number") return value;
  const ts = value as Timestamp;
  return typeof ts.toMillis === "function" ? ts.toMillis() : 0;
}

export const notificationsService = {
  /** Broadcasts ("all") + notifications addressed to this student, newest first. */
  async list(uid: string): Promise<AppNotification[]> {
    const q = query(
      collection(db, "notifications"),
      where("recipientId", "in", [uid, "all"])
    );
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title ?? "",
          message: data.message ?? "",
          type: (data.type ?? "system") as AppNotification["type"],
          read: Boolean(data.read),
          link: data.link,
          createdAtMs: toMs(data.createdAt),
          recipientId: data.recipientId ?? "all",
        } satisfies AppNotification;
      })
      .sort((a, b) => b.createdAtMs - a.createdAtMs);
  },

  async markRead(id: string): Promise<void> {
    await updateDoc(doc(db, "notifications", id), { read: true });
  },

  async markAllRead(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const batch = writeBatch(db);
    ids.forEach((id) => batch.update(doc(db, "notifications", id), { read: true }));
    await batch.commit();
  },
};
