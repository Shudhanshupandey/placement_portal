import { IS_DEV_MODE } from "@/lib/dev-mode/flag";
import { drivesService as firebaseDrivesService } from "@/features/placement-drives/services/drives.service";
import { drivesService as mockDrivesService } from "@/features/placement-drives/services/drives.mock.service";

/** Implementation selector — see `features/auth/services/index.ts` for the rationale. */
export const drivesService = IS_DEV_MODE ? mockDrivesService : firebaseDrivesService;
