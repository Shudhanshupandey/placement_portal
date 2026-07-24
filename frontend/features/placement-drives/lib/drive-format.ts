import type { DriveEligibility } from "@/features/placement-drives/types";

export function formatDate(ms: number): string {
  if (!ms) return "TBA";
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function daysLeft(ms: number): number {
  if (!ms) return Infinity;
  return Math.ceil((ms - Date.now()) / (24 * 3600 * 1000));
}

export function isDeadlinePassed(ms: number): boolean {
  return ms > 0 && ms < Date.now();
}

export function deadlineLabel(ms: number): { text: string; urgent: boolean; closed: boolean } {
  const d = daysLeft(ms);
  if (isDeadlinePassed(ms)) return { text: "Applications closed", urgent: false, closed: true };
  if (d === 0) return { text: "Closes today", urgent: true, closed: false };
  if (d === 1) return { text: "Closes tomorrow", urgent: true, closed: false };
  if (d <= 3) return { text: `Closes in ${d} days`, urgent: true, closed: false };
  return { text: `Closes in ${d} days`, urgent: false, closed: false };
}

const shortBranch = (b: string) =>
  b
    .replace("Computer Science & Engineering", "CSE")
    .replace("Information Technology", "IT")
    .replace("Electronics & Communication", "ECE")
    .replace("Electrical & Electronics", "EEE")
    .replace("Mechanical Engineering", "ME")
    .replace("Civil Engineering", "CE")
    .replace("Artificial Intelligence & Machine Learning", "AI/ML")
    .replace("Data Science", "DS");

/** Compact human-readable eligibility chips. */
export function eligibilitySummary(e: DriveEligibility): string[] {
  const out: string[] = [];
  if (e.courses?.length) out.push(e.courses.join(" / "));
  if (e.branches?.length) out.push(e.branches.map(shortBranch).join(" · "));
  if (typeof e.minCgpa === "number") out.push(`CGPA ≥ ${e.minCgpa}`);
  if (e.allowBacklogs === false || e.maxActiveBacklogs === 0) {
    out.push("No active backlogs");
  } else if (typeof e.maxActiveBacklogs === "number") {
    out.push(`≤ ${e.maxActiveBacklogs} backlogs`);
  }
  if (e.passingYears?.length) out.push(`Passing ${e.passingYears.join(", ")}`);
  return out;
}
