import type { OnboardingData } from "@/features/onboarding/schemas";

const has = (v: unknown): boolean => {
  if (v === undefined || v === null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return true;
};

const ratio = (values: unknown[]) =>
  values.length === 0 ? 0 : values.filter(has).length / values.length;

const SECTION_WEIGHTS = {
  personal: 40,
  academic: 25,
  professional: 20,
  documents: 15,
} as const;

export interface CompletionResult {
  percentage: number;
  sections: {
    personal: boolean;
    academic: boolean;
    professional: boolean;
    documents: boolean;
  };
}

/** Weighted profile-completion percentage + per-section completed flags. */
export function computeCompletion(data: Partial<OnboardingData>): CompletionResult {
  const p = data.personal ?? ({} as OnboardingData["personal"]);
  const a = data.academic ?? {};
  const pr = data.professional ?? {};
  const d = data.documents ?? {};

  const personalRatio = ratio([
    p.fullName, p.gender, p.dateOfBirth, p.mobileNumber, p.category,
    p.address, p.city, p.state, p.pincode, p.photoUrl,
  ]);
  const academicRatio = ratio([
    a.enrollmentNumber, a.universityRollNumber, a.course, a.branch,
    a.currentYear, a.currentSemester, a.admissionYear, a.expectedPassingYear,
    a.tenthPercentage, a.twelfthPercentage, a.currentCgpa, a.academicStatus,
  ]);
  const professionalRatio = ratio([
    pr.skills, pr.programmingLanguages, pr.projects, pr.github, pr.linkedin,
  ]);
  const documentsRatio = ratio([
    d.resumeUrl, d.passportPhotoUrl, d.tenthMarksheetUrl, d.twelfthMarksheetUrl,
  ]);

  const percentage = Math.round(
    SECTION_WEIGHTS.personal * personalRatio +
      SECTION_WEIGHTS.academic * academicRatio +
      SECTION_WEIGHTS.professional * professionalRatio +
      SECTION_WEIGHTS.documents * documentsRatio
  );

  const personalComplete =
    has(p.fullName) && has(p.gender) && has(p.dateOfBirth) &&
    has(p.mobileNumber) && has(p.category) && has(p.address) &&
    has(p.city) && has(p.state) && has(p.pincode);

  return {
    percentage: Math.min(100, percentage),
    sections: {
      personal: personalComplete,
      academic: academicRatio > 0,
      professional: professionalRatio > 0,
      documents: documentsRatio > 0,
    },
  };
}
