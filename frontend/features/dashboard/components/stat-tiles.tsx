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
    { label: "Active Drives", value: drivesCount, icon: Briefcase, tint: "bg-gold/15 text-[#8A6D1E]" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {tiles.map(({ label, value, icon: Icon, tint }) => (
        <div
          key={label}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-card"
        >
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tint}`}>
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-2xl font-bold leading-none text-heading">{value}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
