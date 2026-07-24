"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { NOTIFICATION_META, timeAgo } from "@/features/notifications/lib/notification-meta";
import type { AppNotification } from "@/features/notifications/types";

interface NotificationItemProps {
  notification: AppNotification;
  onRead?: (id: string) => void;
  compact?: boolean;
}

export function NotificationItem({ notification, onRead, compact }: NotificationItemProps) {
  const meta = NOTIFICATION_META[notification.type];
  const Icon = meta.icon;
  const isUnread = !notification.read;

  const body = (
    <div
      className={cn(
        "flex gap-3 rounded-xl px-3 py-3 transition-colors",
        isUnread ? "bg-primary/5" : "hover:bg-section",
        compact ? "items-start" : "items-start"
      )}
    >
      <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", meta.tint)}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("truncate text-sm", isUnread ? "font-semibold text-heading" : "font-medium text-foreground")}>
            {notification.title}
          </p>
          {isUnread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" aria-label="Unread" />}
        </div>
        <p className={cn("text-sm text-muted-foreground", compact ? "line-clamp-1" : "line-clamp-2")}>
          {notification.message}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/80">{timeAgo(notification.createdAtMs)}</p>
      </div>
    </div>
  );

  const handleClick = () => onRead?.(notification.id);

  if (notification.link) {
    return (
      <Link href={notification.link} onClick={handleClick} className="block">
        {body}
      </Link>
    );
  }
  return (
    <button type="button" onClick={handleClick} className="block w-full text-left">
      {body}
    </button>
  );
}
