/** Public API for the "notifications" feature. */
export { NotificationBell } from "@/features/notifications/components/notification-bell";
export { NotificationItem } from "@/features/notifications/components/notification-item";
export { useNotifications } from "@/features/notifications/hooks/use-notifications";
export { NOTIFICATION_META, timeAgo } from "@/features/notifications/lib/notification-meta";
export type { AppNotification, NotificationType } from "@/features/notifications/types";
