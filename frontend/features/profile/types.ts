import type { StudentProfile } from "@/types/models/student";
import type {
  AcademicFormValues,
  ProfessionalFormValues,
  DocumentsFormValues,
} from "@/features/onboarding/schemas";

export interface FullStudentProfile {
  student: StudentProfile | null;
  academic: Partial<AcademicFormValues>;
  professional: Partial<ProfessionalFormValues>;
  documents: Partial<DocumentsFormValues>;
}

/** Student-controlled preferences stored on `students/{uid}`. */
export interface StudentSettings {
  notificationPrefs: Record<string, boolean>;
  /** Opt out of appearing in recruiter candidate searches. */
  recruiterVisible: boolean;
}

export type ProfileSection = "personal" | "academic" | "professional" | "documents";

export interface MissingItem {
  key: string;
  label: string;
  section: ProfileSection;
  /** Blocks placement-drive applications when missing. */
  critical: boolean;
}

/** section → onboarding wizard step index for deep-linking. */
export const SECTION_STEP: Record<ProfileSection, number> = {
  personal: 0,
  academic: 1,
  professional: 2,
  documents: 3,
};
