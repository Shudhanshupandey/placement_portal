import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KpiTile } from "@/data/mock";

/**
 * A single headline statistic — the building block of every console dashboard's
 * KPI row. Renders the `KpiTile` fixture shape (label, value, optional delta and
 * hint) with a locked-palette delta pill.
 */
export function KpiCard({ tile, icon: Icon }: { tile: KpiTile; icon?: LucideIcon }) {
  const delta = tile.deltaPct;
  const hasDelta = typeof delta === "number";
  const up = (delta ?? 0) >= 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{tile.label}</p>
        {Icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-[18px] w-[18px]" />
          </span>
        )}
      </div>

      <div className="mt-2 flex items-end gap-2">
        <p className="text-2xl font-bold tracking-tight text-heading">{tile.value}</p>
        {hasDelta && (
          <span
            className={cn(
              "mb-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold",
              up ? "bg-success/10 text-success" : "bg-error/10 text-error"
            )}
          >
            {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta ?? 0)}%
          </span>
        )}
      </div>

      {tile.hint && <p className="mt-1 text-xs text-muted-foreground">{tile.hint}</p>}
    </div>
  );
}

/** Responsive grid wrapper for a row of KPI cards. */
export function KpiGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{children}</div>
  );
}
