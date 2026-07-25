import {
  FileText,
  Briefcase,
  CalendarClock,
  BadgeCheck,
  ShieldCheck,
  CheckCircle2,
  UserCog,
  Bell,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/utils/format";
import type { MockActivity, ActivityKind } from "@/data/mock";

/**
 * Chronological feed of {@link MockActivity} events — used by the console
 * notification pages and the admin dashboard. Icon and tint per event kind are
 * chosen here (from the locked palette), never baked into the fixture data.
 */

const KIND: Record<ActivityKind, { icon: LucideIcon; tint: string }> = {
  application: { icon: FileText, tint: "bg-info/10 text-info" },
  drive: { icon: Briefcase, tint: "bg-gold/15 text-gold-foreground" },
  interview: { icon: CalendarClock, tint: "bg-info/10 text-info" },
  offer: { icon: BadgeCheck, tint: "bg-success/10 text-success" },
  approval: { icon: ShieldCheck, tint: "bg-success/10 text-success" },
  verification: { icon: CheckCircle2, tint: "bg-success/10 text-success" },
  account: { icon: UserCog, tint: "bg-section text-muted-foreground" },
  system: { icon: Bell, tint: "bg-section text-muted-foreground" },
};

export function ActivityFeed({
  items,
  className,
}: {
  items: MockActivity[];
  className?: string;
}) {
  return (
    <ul className={cn("space-y-1", className)}>
      {items.map((a) => {
        const { icon: Icon, tint } = KIND[a.kind];
        return (
          <li key={a.id} className="flex gap-3 rounded-xl p-2.5 transition-colors hover:bg-section/60">
            <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", tint)}>
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">
                <span className="font-semibold text-heading">{a.actorName}</span> {a.action}
                {a.target && <span className="font-medium text-heading"> {a.target}</span>}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(a.atMs)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
