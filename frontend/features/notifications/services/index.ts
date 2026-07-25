import { IS_DEV_MODE } from "@/lib/dev-mode/flag";
import { notificationsService as firebaseNotificationsService } from "@/features/notifications/services/notifications.service";
import { notificationsService as mockNotificationsService } from "@/features/notifications/services/notifications.mock.service";

/** Implementation selector — see `features/auth/services/index.ts` for the rationale. */
export const notificationsService = IS_DEV_MODE
  ? mockNotificationsService
  : firebaseNotificationsService;
