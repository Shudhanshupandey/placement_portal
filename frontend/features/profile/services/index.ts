import { IS_DEV_MODE } from "@/lib/dev-mode/flag";
import { profileService as firebaseProfileService } from "@/features/profile/services/profile.service";
import { profileService as mockProfileService } from "@/features/profile/services/profile.mock.service";

/** Implementation selector — see `features/auth/services/index.ts` for the rationale. */
export const profileService = IS_DEV_MODE ? mockProfileService : firebaseProfileService;
