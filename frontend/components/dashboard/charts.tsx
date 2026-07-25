import { cn } from "@/lib/utils";
import type { SeriesPoint } from "@/data/mock";

/**
 * Lightweight, dependency-free charts.
 *
 * CLAUDE.md locks the tech stack with no charting library, so these render with
 * plain SVG/CSS and the locked palette tokens. They consume the fixture
 * `SeriesPoint[]` shape ({ label, value }) directly.
 */

const fmt = (n: number) => n.toLocaleString("en-IN");

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
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">{d.label}</span>
            <span className="tabular-nums text-muted-foreground">
              {fmt(d.value)}
              {valueSuffix}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-section">
            <div
              className="h-full rounded-full bg-gold-gradient"
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
    <ul className="space-y-2">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const conv = i === 0 ? 100 : Math.round((d.value / data[0].value) * 100);
        return (
          <li key={d.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-sm font-medium text-foreground">{d.label}</span>
            <div className="relative h-8 flex-1 overflow-hidden rounded-lg bg-section">
              <div
                className="flex h-full items-center rounded-lg bg-primary-gradient px-2.5 text-xs font-semibold text-primary-foreground"
                style={{ width: `${Math.max(pct, 8)}%` }}
              >
                {fmt(d.value)}
              </div>
            </div>
            <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
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
}: {
  data: SeriesPoint[];
  height?: number;
  valueSuffix?: string;
}) {
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
      >
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#23488A" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#23488A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#trendFill)" />
        <path
          d={line}
          fill="none"
          stroke="#18305F"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pts.map((p) => (
          <circle key={p.label} cx={p.x} cy={p.y} r="1.6" fill="#D8AE3E" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
        {data.map((d) => (
          <span key={d.label} className="tabular-nums">
            {d.label}
          </span>
        ))}
      </div>
      <p className="sr-only">
        {data.map((d) => `${d.label}: ${d.value}${valueSuffix}`).join(", ")}
      </p>
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
        <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
          <circle cx="18" cy="18" r={r} fill="none" stroke="#E5E7EB" strokeWidth="3.5" />
          <circle
            cx="18"
            cy="18"
            r={r}
            fill="none"
            stroke="#D8AE3E"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={`${dash} 100`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-heading">
          {Math.round(value)}%
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold text-heading">{label}</p>
        {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
      </div>
    </div>
  );
}
