import type { FullStudentProfile } from "@/features/profile";
import type { PlacementDrive } from "@/features/placement-drives";

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
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

/**
 * Deterministic eligibility engine — returns a clear reason for EVERY failed
 * criterion so the UI can explain *why*, never just disable the button.
 */
export function checkEligibility(
  full: FullStudentProfile,
  drive: PlacementDrive
): EligibilityResult {
  const e = drive.eligibility ?? {};
  const a = full.academic ?? {};
  const p = full.professional ?? {};
  const reasons: string[] = [];

  const cgpa = a.currentCgpa ? Number(a.currentCgpa) : NaN;
  const year = a.currentYear ? Number(a.currentYear) : NaN;
  const passingYear = a.expectedPassingYear ? Number(a.expectedPassingYear) : NaN;
  const activeBacklogs = a.activeBacklogs ? Number(a.activeBacklogs) : 0;

  // Course
  if (e.courses?.length && (!a.course || !e.courses.includes(a.course))) {
    reasons.push(`Open only to ${e.courses.join(" / ")} students.`);
  }

  // Branch
  if (e.branches?.length && (!a.branch || !e.branches.includes(a.branch))) {
    reasons.push(`Open only to ${e.branches.map(shortBranch).join(", ")} branch students.`);
  }

  // Current year
  if (typeof e.minYear === "number" && (Number.isNaN(year) || year < e.minYear)) {
    reasons.push(`Only ${e.minYear}${e.minYear >= 4 ? "th" : "rd"}+ year students can apply.`);
  }

  // CGPA
  if (typeof e.minCgpa === "number") {
    if (Number.isNaN(cgpa)) {
      reasons.push(`Minimum CGPA required is ${e.minCgpa} (add your CGPA to check).`);
    } else if (cgpa < e.minCgpa) {
      reasons.push(`Minimum CGPA required is ${e.minCgpa} — yours is ${cgpa}.`);
    }
  }

  // Backlogs
  const noBacklogsAllowed = e.allowBacklogs === false || e.maxActiveBacklogs === 0;
  if (noBacklogsAllowed && activeBacklogs > 0) {
    reasons.push("Active backlogs are not allowed for this drive.");
  } else if (
    typeof e.maxActiveBacklogs === "number" &&
    e.maxActiveBacklogs > 0 &&
    activeBacklogs > e.maxActiveBacklogs
  ) {
    reasons.push(`At most ${e.maxActiveBacklogs} active backlog(s) allowed — you have ${activeBacklogs}.`);
  }

  // Passing year
  if (e.passingYears?.length && (Number.isNaN(passingYear) || !e.passingYears.includes(passingYear))) {
    reasons.push(`Only the ${e.passingYears.join(" / ")} passing batch can apply.`);
  }

  // Required skills
  if (e.requiredSkills?.length) {
    const have = new Set((p.skills ?? []).map((s) => s.toLowerCase().trim()));
    const missing = e.requiredSkills.filter((s) => !have.has(s.toLowerCase().trim()));
    if (missing.length) {
      reasons.push(`Required skill(s) missing: ${missing.join(", ")}.`);
    }
  }

  return { eligible: reasons.length === 0, reasons };
}
