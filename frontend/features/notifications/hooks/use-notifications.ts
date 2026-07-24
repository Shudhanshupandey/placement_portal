"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/auth/use-auth";
import { notificationsService } from "@/features/notifications/services/notifications.service";
import type { AppNotification } from "@/features/notifications/types";

export function useNotifications() {
  const { user } = useAuth();
  const uid = user?.uid;
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications", uid],
    queryFn: () => notificationsService.list(uid as string),
    enabled: !!uid,
  });

  const notifications: AppNotification[] = query.data ?? [];
  // Only personal notifications count toward the unread badge (broadcasts are shared).
  const unreadCount = notifications.filter(
    (n) => !n.read && n.recipientId === uid
  ).length;

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications", uid] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () =>
      notificationsService.markAllRead(
        notifications.filter((n) => !n.read && n.recipientId === uid).map((n) => n.id)
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications", uid] }),
  });

  // Only the user's own unread notifications are writable — broadcasts ("all")
  // are shared docs and must not be updated per-user.
  const markRead = (id: string) => {
    const n = notifications.find((x) => x.id === id);
    if (n && n.recipientId === uid && !n.read) markReadMutation.mutate(id);
  };

  return {
    notifications,
    unreadCount,
    isLoading: query.isLoading,
    markRead,
    markAllRead: markAllReadMutation.mutate,
  };
}
