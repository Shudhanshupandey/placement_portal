import type { PersonalFormValues } from "@/features/onboarding/schemas/personal.schema";
import type { AcademicFormValues } from "@/features/onboarding/schemas/academic.schema";
import type { ProfessionalFormValues } from "@/features/onboarding/schemas/professional.schema";
import type { DocumentsFormValues } from "@/features/onboarding/schemas/documents.schema";

export * from "@/features/onboarding/schemas/personal.schema";
export * from "@/features/onboarding/schemas/academic.schema";
export * from "@/features/onboarding/schemas/professional.schema";
export * from "@/features/onboarding/schemas/documents.schema";

/** Aggregated data collected across the whole wizard. */
export interface OnboardingData {
  personal: PersonalFormValues;
  academic: Partial<AcademicFormValues>;
  professional: Partial<ProfessionalFormValues>;
  documents: Partial<DocumentsFormValues>;
}

export type OnboardingSection = keyof OnboardingData;
