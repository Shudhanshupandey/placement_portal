"use client";

import { STATUS_META, ALL_STATUSES } from "@/features/applications/lib/status-meta";
import type { Application } from "@/features/applications/types";

const R = 56;
const C = 2 * Math.PI * R;

export function ApplicationStats({ applications }: { applications: Application[] }) {
  const total = applications.length;
  const counts = ALL_STATUSES.map((status) => ({
    status,
    count: applications.filter((a) => a.status === status).length,
  })).filter((c) => c.count > 0);

  let cumulative = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      {/* Donut */}
      <div className="relative h-[160px] w-[160px] shrink-0">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle cx="80" cy="80" r={R} fill="none" stroke="#EEF1F6" strokeWidth="18" />
          {total > 0 &&
            counts.map(({ status, count }) => {
              const frac = count / total;
              const dash = Math.max(frac * C - (counts.length > 1 ? 3 : 0), 0);
              const seg = (
                <circle
                  key={status}
                  cx="80"
                  cy="80"
                  r={R}
                  fill="none"
                  stroke={STATUS_META[status].color}
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${C - dash}`}
                  strokeDashoffset={-cumulative * C}
                />
              );
              cumulative += frac;
              return seg;
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-heading">{total}</span>
          <span className="text-xs text-muted-foreground">
            {total === 1 ? "Application" : "Applications"}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full flex-1">
        {total === 0 ? (
          <p className="text-sm text-muted-foreground">
            No applications yet. Browse placement drives to get started.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {counts.map(({ status, count }) => {
              const meta = STATUS_META[status];
              const Icon = meta.icon;
              return (
                <li key={status} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: meta.color }}
                    />
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    {meta.label}
                  </span>
                  <span className="font-semibold text-heading">{count}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
