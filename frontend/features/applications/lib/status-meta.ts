import {
  Clock,
  Search,
  ListChecks,
  CalendarClock,
  Trophy,
  XCircle,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";
import type { ApplicationStatus } from "@/features/applications/types";
import type { BadgeProps } from "@/components/ui/badge";

interface StatusMeta {
  label: string;
  icon: LucideIcon;
  badge: NonNullable<BadgeProps["variant"]>;
  /** Donut/segment color — a reserved STATUS color, always shown with a label. */
  color: string;
  order: number;
}

export const STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  pending: { label: "Pending", icon: Clock, badge: "secondary", color: "#6B7280", order: 0 },
  under_review: { label: "Under Review", icon: Search, badge: "info", color: "#3B82F6", order: 1 },
  shortlisted: { label: "Shortlisted", icon: ListChecks, badge: "gold", color: "#D8AE3E", order: 2 },
  interview_scheduled: { label: "Interview Scheduled", icon: CalendarClock, badge: "default", color: "#18305F", order: 3 },
  selected: { label: "Selected", icon: Trophy, badge: "success", color: "#22C55E", order: 4 },
  offer_released: { label: "Offer Released", icon: BadgeCheck, badge: "success", color: "#059669", order: 5 },
  rejected: { label: "Rejected", icon: XCircle, badge: "error", color: "#EF4444", order: 6 },
};

export const ALL_STATUSES: ApplicationStatus[] = [
  "pending",
  "under_review",
  "shortlisted",
  "interview_scheduled",
  "selected",
  "offer_released",
  "rejected",
];
