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
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft transition-shadow hover:shadow-card sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 text-xs font-medium text-muted-foreground sm:text-sm">
          {tile.label}
        </p>
        {/* The icon is decoration; at ~150px of cell width on a 360px phone it
            costs more than it adds, so it appears from `xs` up. */}
        {Icon && (
          <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary xs:flex">
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-end gap-x-2 gap-y-1">
        <p className="text-metric font-bold text-heading">{tile.value}</p>
        {hasDelta && (
          <span
            className={cn(
              "mb-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold",
              up ? "bg-success/10 text-success-ink" : "bg-error/10 text-error-ink"
            )}
          >
            {up ? (
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            ) : (
              <ArrowDownRight className="h-3 w-3" aria-hidden="true" />
            )}
            {Math.abs(delta ?? 0)}%
            <span className="sr-only">{up ? " increase" : " decrease"}</span>
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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {children}
    </div>
  );
}
