"use client";

import { Megaphone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useNotifications, NotificationItem } from "@/features/notifications";

export default function AnnouncementsPage() {
  const { notifications, isLoading, markRead } = useNotifications();
  const announcements = notifications.filter((n) => n.type === "announcement");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display-sm font-bold text-heading">Announcements</h1>
        <p className="text-sm text-muted-foreground">Official updates from the TPO office.</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : announcements.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements yet" description="Official notices will appear here." />
      ) : (
        <div className="rounded-2xl border border-border bg-card p-2 shadow-soft">
          {announcements.map((n) => (
            <NotificationItem key={n.id} notification={n} onRead={markRead} />
          ))}
        </div>
      )}
    </div>
  );
}
