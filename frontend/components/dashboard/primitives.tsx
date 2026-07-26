"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Consistent page title block for console pages.
 *
 * Carries no outer margin on purpose — vertical rhythm is the page layout's
 * job (every page that renders one wraps its content in a `space-y-*` stack).
 * A margin here would double up inside that stack.
 */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <h1 className="text-display-sm font-bold text-heading">{title}</h1>
        {description && (
          <p className="mt-1 max-w-prose text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {/* Actions stretch full-width on phones so they're a comfortable tap. */}
      {action && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 [&>*]:flex-1 sm:[&>*]:flex-none">
          {action}
        </div>
      )}
    </div>
  );
}

export type PillTone = "success" | "warning" | "error" | "info" | "neutral" | "gold";

/**
 * Tinted chip + a darkened ink of the same hue. The raw status colours are far
 * too light to sit as small text on their own 10% tint (#22C55E on pale green
 * is ~2.3:1); the `-ink` tokens bring every pill to WCAG AA.
 */
const TONE: Record<PillTone, string> = {
  success: "bg-success/10 text-success-ink",
  warning: "bg-warning/15 text-warning-ink",
  error: "bg-error/10 text-error-ink",
  info: "bg-info/10 text-info-ink",
  neutral: "bg-section text-muted-foreground",
  gold: "bg-gold/15 text-gold-ink",
};

/** Small tinted status pill using the locked palette tokens. */
export function StatusPill({
  tone = "neutral",
  children,
  className,
}: {
  tone?: PillTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold capitalize",
        TONE[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/** The console list-page search box. */
export function SearchField({
  value,
  onChange,
  placeholder = "Search…",
  label,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Accessible name — required, since the field has no visible label. */
  label: string;
  className?: string;
}) {
  const id = React.useId();
  return (
    <div className={cn("relative min-w-0 flex-1 sm:min-w-[240px]", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/25"
      />
    </div>
  );
}

/**
 * Single-select filter chips. Rendered as a radio group so arrow keys move
 * between options and the active filter is announced, and as a snap-scrolling
 * rail on mobile so a long filter set never wraps into three ragged lines.
 */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: { key: T; label: string; count?: number }[];
  value: T;
  onChange: (key: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "no-scrollbar -mx-1 flex snap-x-rail gap-2 overflow-x-auto px-1 pb-0.5 sm:flex-wrap sm:overflow-visible",
        className
      )}
    >
      {options.map((o) => {
        const active = value === o.key;
        return (
          <button
            key={o.key}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.key)}
            className={cn(
              "inline-flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-heading"
            )}
          >
            {o.label}
            {typeof o.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                  active ? "bg-white/20" : "bg-section text-muted-foreground"
                )}
              >
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Standard toolbar row: search on the left, filters on the right. */
export function ListToolbar({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3 lg:flex-row lg:items-center">{children}</div>;
}

/**
 * Root wrapper for a console page: sets the one vertical rhythm every page
 * shares, so headers, toolbars and content blocks never need their own margins.
 */
export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-5 sm:space-y-6", className)}>{children}</div>;
}
