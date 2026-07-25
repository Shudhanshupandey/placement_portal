import { IS_DEV_MODE } from "@/lib/dev-mode/flag";
import { onboardingService as firebaseOnboardingService } from "@/features/onboarding/services/onboarding.service";
import { onboardingService as mockOnboardingService } from "@/features/onboarding/services/onboarding.mock.service";

/** Implementation selector — see `features/auth/services/index.ts` for the rationale. */
export const onboardingService = IS_DEV_MODE
  ? mockOnboardingService
  : firebaseOnboardingService;
