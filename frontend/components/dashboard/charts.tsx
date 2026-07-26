"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { SeriesPoint } from "@/data/mock";

/**
 * Lightweight, dependency-free charts.
 *
 * CLAUDE.md locks the tech stack with no charting library, so these render with
 * plain SVG/CSS and the locked palette tokens. They consume the fixture
 * `SeriesPoint[]` shape ({ label, value }) directly.
 *
 * Every chart is a `role="img"` with an accessible name plus a visually-hidden
 * text version of the series, so screen readers get the data rather than a
 * silent graphic.
 */

const fmt = (n: number) => n.toLocaleString("en-IN");

/** Screen-reader-only readout of a series. */
function SeriesDescription({
  data,
  valueSuffix = "",
}: {
  data: SeriesPoint[];
  valueSuffix?: string;
}) {
  return (
    <p className="sr-only">
      {data.map((d) => `${d.label}: ${fmt(d.value)}${valueSuffix}`).join(", ")}
    </p>
  );
}

// ── Horizontal bar list ──────────────────────────────────────────────────────

export function BarList({
  data,
  className,
  valueSuffix = "",
}: {
  data: SeriesPoint[];
  className?: string;
  valueSuffix?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className={cn("space-y-3", className)}>
      {data.map((d) => (
        <li key={d.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 truncate font-medium text-foreground">{d.label}</span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {fmt(d.value)}
              {valueSuffix}
            </span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-section"
            role="img"
            aria-label={`${d.label}: ${fmt(d.value)}${valueSuffix}`}
          >
            <div
              className="h-full rounded-full bg-gold-gradient transition-[width] duration-500 ease-premium"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

// ── Funnel (monotonic decreasing stages) ─────────────────────────────────────

export function Funnel({ data }: { data: SeriesPoint[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="space-y-3">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const conv = i === 0 ? 100 : Math.round((d.value / data[0].value) * 100);
        return (
          <li
            key={d.label}
            // Below `sm` the label sits ABOVE the bar: a fixed label column
            // would leave the bar unreadably narrow on a 360px phone.
            className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3"
          >
            <div className="flex items-center justify-between gap-2 sm:w-28 sm:shrink-0 sm:justify-start">
              <span className="truncate text-sm font-medium text-foreground">{d.label}</span>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground sm:hidden">
                {conv}%
              </span>
            </div>
            <div className="relative h-8 flex-1 overflow-hidden rounded-lg bg-section">
              <div
                className="flex h-full items-center rounded-lg bg-primary-gradient px-2.5 text-xs font-semibold text-primary-foreground transition-[width] duration-500 ease-premium"
                style={{ width: `${Math.max(pct, 12)}%` }}
              >
                {fmt(d.value)}
              </div>
            </div>
            <span className="hidden w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground sm:block">
              {conv}%
            </span>
          </li>
        );
      })}
    </ul>
  );
}

// ── Trend area/line ──────────────────────────────────────────────────────────

export function TrendArea({
  data,
  height = 180,
  valueSuffix = "",
  label = "Trend over time",
}: {
  data: SeriesPoint[];
  height?: number;
  valueSuffix?: string;
  label?: string;
}) {
  // `useId` keeps the gradient unique — two TrendAreas on one page would
  // otherwise emit duplicate DOM ids and cross-reference each other's <defs>.
  const gradientId = `trend-fill-${React.useId().replace(/:/g, "")}`;

  const w = 100; // viewBox width (percent-like units)
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const span = max - min || 1;
  const stepX = data.length > 1 ? w / (data.length - 1) : w;
  const pad = 8;
  const usableH = 100 - pad * 2;

  const pts = data.map((d, i) => {
    const x = i * stepX;
    const y = pad + usableH - ((d.value - min) / span) * usableH;
    return { x, y, ...d };
  });

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${line} L ${w} 100 L 0 100 Z`;

  return (
    <div>
      <svg
        viewBox={`0 0 ${w} 100`}
        preserveAspectRatio="none"
        style={{ height }}
        className="w-full"
        role="img"
        aria-label={label}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--primary-light))" stopOpacity="0.28" />
            <stop offset="100%" stopColor="rgb(var(--primary-light))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradientId})`} />
        <path
          d={line}
          fill="none"
          className="stroke-primary"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pts.map((p) => (
          <circle
            key={p.label}
            cx={p.x}
            cy={p.y}
            r="1.6"
            className="fill-gold"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {/* Labels are spread edge-to-edge to line up with the plotted points;
          `text-center` + equal flex basis stops the end labels overhanging. */}
      <div className="mt-2 flex text-[11px] text-muted-foreground" aria-hidden="true">
        {data.map((d, i) => (
          <span
            key={d.label}
            className={cn(
              "flex-1 tabular-nums",
              i === 0 ? "text-left" : i === data.length - 1 ? "text-right" : "text-center"
            )}
          >
            {d.label}
          </span>
        ))}
      </div>
      <SeriesDescription data={data} valueSuffix={valueSuffix} />
    </div>
  );
}

// ── Donut (single ratio) ─────────────────────────────────────────────────────

export function Donut({
  value,
  label,
  sublabel,
}: {
  value: number; // 0-100
  label: string;
  sublabel?: string;
}) {
  const r = 15.9155; // circumference ≈ 100
  const dash = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-24 w-24 shrink-0">
        <svg
          viewBox="0 0 36 36"
          className="h-24 w-24 -rotate-90"
          role="img"
          aria-label={`${label}: ${Math.round(value)}%`}
        >
          <circle cx="18" cy="18" r={r} fill="none" className="stroke-border" strokeWidth="3.5" />
          <circle
            cx="18"
            cy="18"
            r={r}
            fill="none"
            className="stroke-gold"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={`${dash} 100`}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-lg font-bold text-heading"
          aria-hidden="true"
        >
          {Math.round(value)}%
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-heading">{label}</p>
        {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
      </div>
    </div>
  );
}
