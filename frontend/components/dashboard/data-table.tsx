import { cn } from "@/lib/utils";

/**
 * The typed table primitive for every console list page.
 *
 * Responsive strategy, in order of preference:
 *  1. Supply `renderMobileCard` — below `sm` the rows render as stacked cards.
 *     A six-column table forced through a 360px viewport is a horizontal-scroll
 *     puzzle; a card per row is what a phone actually wants.
 *  2. Otherwise the table keeps its min-width inside a scroll container that
 *     fades at both edges, so it's at least obvious there is more to the right.
 *
 * Either way the markup stays a real `<table>` with scoped headers and a
 * caption, so screen readers and keyboard users get proper table semantics.
 */

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  /** Hide below the `sm` breakpoint to keep mobile tables readable. */
  hideOnMobile?: boolean;
  className?: string;
}

const alignClass = { left: "text-left", right: "text-right", center: "text-center" } as const;

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  /** Describes the table for assistive tech. Visually hidden. */
  caption?: string;
  /** Opt into the stacked-card layout below `sm`. */
  renderMobileCard?: (row: T) => React.ReactNode;
  /**
   * `embedded` drops the table's own border, radius and shadow — use it when the
   * table sits inside a SectionCard, which already supplies that chrome (two
   * nested bordered boxes read as a mistake).
   */
  variant?: "standalone" | "embedded";
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = "Nothing to show yet.",
  caption,
  renderMobileCard,
  variant = "standalone",
}: DataTableProps<T>) {
  const isEmpty = rows.length === 0;
  const embedded = variant === "embedded";

  return (
    <>
      {/* ── Mobile: stacked cards ─────────────────────────────────────────── */}
      {renderMobileCard && (
        <div className={cn("space-y-3 sm:hidden", embedded && "p-3")}>
          {isEmpty ? (
            <p className="rounded-2xl border border-dashed border-border bg-section/50 px-4 py-10 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          ) : (
            rows.map((row) => (
              <div
                key={rowKey(row)}
                className={cn(
                  "rounded-2xl bg-card p-4",
                  embedded ? "border border-border" : "border border-border shadow-soft"
                )}
              >
                {renderMobileCard(row)}
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "overflow-x-auto overscroll-x-contain bg-card",
          !embedded && "rounded-2xl border border-border shadow-soft",
          renderMobileCard && "hidden sm:block"
        )}
      >
        <table className="w-full min-w-[640px] border-collapse text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b border-border bg-section">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    alignClass[c.align ?? "left"],
                    c.hideOnMobile && "hidden sm:table-cell"
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="border-b border-border transition-colors last:border-0 hover:bg-section/60"
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        "px-4 py-3 text-foreground",
                        alignClass[c.align ?? "left"],
                        c.hideOnMobile && "hidden sm:table-cell",
                        c.className
                      )}
                    >
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
