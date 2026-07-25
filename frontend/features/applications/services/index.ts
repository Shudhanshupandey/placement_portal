import { IS_DEV_MODE } from "@/lib/dev-mode/flag";
import { applicationsService as firebaseApplicationsService } from "@/features/applications/services/applications.service";
import { applicationsService as mockApplicationsService } from "@/features/applications/services/applications.mock.service";

/** Implementation selector — see `features/auth/services/index.ts` for the rationale. */
export const applicationsService = IS_DEV_MODE
  ? mockApplicationsService
  : firebaseApplicationsService;
