import { cn } from "@/lib/utils";
import { STATUS_META } from "@/features/applications/lib/status-meta";
import type { StatusEvent } from "@/features/applications/types";

function fmt(ms: number) {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function StatusTimeline({ timeline }: { timeline: StatusEvent[] }) {
  const events = [...timeline].sort((a, b) => a.atMs - b.atMs);
  if (events.length === 0) return null;

  return (
    <ol className="relative space-y-4 pl-6">
      <span className="absolute left-[7px] top-1 bottom-1 w-px bg-border" aria-hidden />
      {events.map((ev, i) => {
        const meta = STATUS_META[ev.status];
        const Icon = meta.icon;
        const isLast = i === events.length - 1;
        return (
          <li key={`${ev.status}-${ev.atMs}-${i}`} className="relative">
            <span
              className={cn(
                "absolute -left-6 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-card"
              )}
              style={{ backgroundColor: meta.color }}
            />
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" style={{ color: meta.color }} />
              <p className={cn("text-sm font-medium", isLast ? "text-heading" : "text-foreground")}>
                {meta.label}
              </p>
            </div>
            {ev.note && <p className="mt-0.5 text-sm text-muted-foreground">{ev.note}</p>}
            <p className="text-xs text-muted-foreground/80">{fmt(ev.atMs)}</p>
          </li>
        );
      })}
    </ol>
  );
}
