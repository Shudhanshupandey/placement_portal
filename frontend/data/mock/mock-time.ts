/**
 * Relative-time helpers for the development fixtures.
 *
 * Fixtures MUST be expressed relative to "now" — hard-coded dates rot, and a
 * placement drive whose deadline passed six months ago renders every card as
 * "Closed", which hides the UI the fixtures exist to exercise.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

/** Epoch ms, `n` days in the past. */
export const daysAgo = (n: number): number => Date.now() - n * DAY_MS;

/** Epoch ms, `n` days in the future. */
export const daysFromNow = (n: number): number => Date.now() + n * DAY_MS;

/** Epoch ms, `n` hours in the past. */
export const hoursAgo = (n: number): number => Date.now() - n * HOUR_MS;

/** ISO `yyyy-mm-dd`, `n` years in the past (used for dates of birth). */
export function yearsAgoIso(n: number, month = 5, day = 14): string {
  const d = new Date();
  return `${d.getFullYear() - n}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** The current calendar year — keeps admission/passing years plausible. */
export const CURRENT_YEAR = new Date().getFullYear();
