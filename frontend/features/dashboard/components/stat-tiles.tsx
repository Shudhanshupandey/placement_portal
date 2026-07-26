import { FileText, CalendarClock, Trophy, Briefcase, type LucideIcon } from "lucide-react";
import type { Application } from "@/features/applications";

interface Tile {
  label: string;
  value: number;
  icon: LucideIcon;
  tint: string;
}

export function StatTiles({
  applications,
  drivesCount,
}: {
  applications: Application[];
  drivesCount: number;
}) {
  const interviews = applications.filter((a) => a.status === "interview_scheduled").length;
  const selected = applications.filter(
    (a) => a.status === "selected" || a.status === "offer_released"
  ).length;

  const tiles: Tile[] = [
    { label: "Applications", value: applications.length, icon: FileText, tint: "bg-primary/10 text-primary" },
    { label: "Interviews", value: interviews, icon: CalendarClock, tint: "bg-info/10 text-info" },
    { label: "Selected / Offers", value: selected, icon: Trophy, tint: "bg-success/10 text-success" },
    { label: "Active Drives", value: drivesCount, icon: Briefcase, tint: "bg-gold/15 text-gold-ink" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {tiles.map(({ label, value, icon: Icon, tint }) => (
        <div
          key={label}
          // Icon above the figure on narrow phones; side-by-side from `xs` up.
          // A 44px icon plus a 2xl number will not fit on one line at 360px.
          className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-4 shadow-soft transition-shadow hover:shadow-card xs:flex-row xs:items-center xs:gap-4 sm:p-5"
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${tint}`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-metric font-bold text-heading">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
