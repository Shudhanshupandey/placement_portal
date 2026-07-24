import {
  Briefcase,
  CalendarClock,
  Trophy,
  Megaphone,
  FileText,
  FileWarning,
  Settings2,
  type LucideIcon,
} from "lucide-react";
import type { NotificationType } from "@/features/notifications/types";

export const NOTIFICATION_META: Record<
  NotificationType,
  { icon: LucideIcon; tint: string; label: string }
> = {
  drive: { icon: Briefcase, tint: "bg-primary/10 text-primary", label: "Placement Drive" },
  interview: { icon: CalendarClock, tint: "bg-info/10 text-info", label: "Interview" },
  selection: { icon: Trophy, tint: "bg-success/10 text-success", label: "Selection" },
  announcement: { icon: Megaphone, tint: "bg-gold/15 text-[#8A6D1E]", label: "Announcement" },
  application: { icon: FileText, tint: "bg-primary/10 text-primary", label: "Application" },
  document: { icon: FileWarning, tint: "bg-warning/15 text-[#B45309]", label: "Document" },
  system: { icon: Settings2, tint: "bg-muted text-muted-foreground", label: "System" },
};

/** Human-friendly relative time. */
export function timeAgo(ms: number): string {
  if (!ms) return "";
  const diff = Date.now() - ms;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(ms).toLocaleDateString();
}
