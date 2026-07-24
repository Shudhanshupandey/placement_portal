/**
 * Public API for the "onboarding" feature.
 * Import onboarding only through this barrel — never internal paths.
 */
export { OnboardingWizard } from "@/features/onboarding/components/onboarding-wizard";
export { useOnboarding, TOTAL_STEPS } from "@/features/onboarding/hooks/use-onboarding";
export { onboardingService } from "@/features/onboarding/services/onboarding.service";
export { computeCompletion } from "@/features/onboarding/lib/profile-completion";
export type { CompletionResult } from "@/features/onboarding/lib/profile-completion";
export type { OnboardingData } from "@/features/onboarding/schemas";
