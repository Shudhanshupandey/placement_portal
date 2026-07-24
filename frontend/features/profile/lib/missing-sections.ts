import type { FullStudentProfile, MissingItem } from "@/features/profile/types";

const filled = (v: unknown): boolean => {
  if (v === undefined || v === null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return true;
};

/**
 * Compute the list of missing/incomplete profile items.
 * `critical` items block placement-drive applications.
 */
export function getMissingItems(full: FullStudentProfile): MissingItem[] {
  const { student, academic, professional, documents } = full;
  const items: MissingItem[] = [];

  const add = (
    ok: boolean,
    key: string,
    label: string,
    section: MissingItem["section"],
    critical = false
  ) => {
    if (!ok) items.push({ key, label, section, critical });
  };

  // Personal
  add(filled(student?.photoUrl), "photo", "Profile Photo", "personal", false);

  // Academic (needed for eligibility)
  add(filled(academic.course), "course", "Course", "academic", true);
  add(filled(academic.branch), "branch", "Branch", "academic", true);
  add(filled(academic.currentCgpa), "cgpa", "Current CGPA", "academic", true);
  add(filled(academic.expectedPassingYear), "passingYear", "Passing Year", "academic", false);

  // Professional
  add(filled(professional.skills), "skills", "Skills", "professional", true);
  add(filled(professional.projects), "projects", "Projects", "professional", false);
  add(filled(professional.linkedin), "linkedin", "LinkedIn", "professional", false);

  // Documents
  add(filled(documents.resumeUrl), "resume", "Resume", "documents", true);
  add(
    filled(documents.semesterMarksheetUrls),
    "semesterMarksheets",
    "Semester Marksheets",
    "documents",
    false
  );

  return items;
}

export interface ApplyReadiness {
  ready: boolean;
  missing: MissingItem[];
  criticalMissing: MissingItem[];
}

/** Whether the student can apply to drives, plus what's blocking them. */
export function getApplyReadiness(full: FullStudentProfile): ApplyReadiness {
  const missing = getMissingItems(full);
  const criticalMissing = missing.filter((m) => m.critical);
  const profileCompleted = full.student?.profileCompleted === true;
  return {
    ready: profileCompleted && criticalMissing.length === 0,
    missing,
    criticalMissing,
  };
}
