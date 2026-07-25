/**
 * Pure display formatters shared across the console pages.
 *
 * These run in client components that only render after auth resolves in the
 * browser, so locale/timezone-dependent output does not risk an SSR hydration
 * mismatch.
 */

const DATE_FMT = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const DATETIME_FMT = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(ms: number): string {
  return DATE_FMT.format(new Date(ms));
}

export function formatDateTime(ms: number): string {
  return DATETIME_FMT.format(new Date(ms));
}

/** "just now" / "3h ago" / "2d ago" / falls back to an absolute date. */
export function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60000);
  const suffix = diff >= 0 ? "ago" : "from now";
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ${suffix}`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ${suffix}`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ${suffix}`;
  return formatDate(ms);
}

/** Indian-grouped integer, e.g. 1284 → "1,284". */
export function inr(n: number): string {
  return n.toLocaleString("en-IN");
}
