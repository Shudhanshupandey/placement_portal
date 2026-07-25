import { IS_DEV_MODE } from "@/lib/dev-mode/flag";

import {
  authService as firebaseAuthService,
  EmailDomainError,
} from "@/features/auth/services/auth.service";
import {
  adminAuthService as firebaseAdminAuthService,
  passwordAuthService as firebasePasswordAuthService,
} from "@/features/auth/services/admin-auth.service";
import { recruiterAuthService as firebaseRecruiterAuthService } from "@/features/auth/services/recruiter-auth.service";

import { authService as mockAuthService } from "@/features/auth/services/auth.mock.service";
import {
  adminAuthService as mockAdminAuthService,
  passwordAuthService as mockPasswordAuthService,
} from "@/features/auth/services/admin-auth.mock.service";
import { recruiterAuthService as mockRecruiterAuthService } from "@/features/auth/services/recruiter-auth.mock.service";

/**
 * Implementation selector for the auth data layer.
 *
 * Firebase is the default and the only implementation that ships: `IS_DEV_MODE`
 * folds to a literal `false` in a production build, so each ternary collapses
 * to the Firebase service and the mock modules tree-shake away.
 *
 * Consumers import from `@/features/auth/services` (or the feature barrel) and
 * never name an implementation, which is what makes the production switch a
 * one-line environment change.
 */

export const authService = IS_DEV_MODE ? mockAuthService : firebaseAuthService;

export const adminAuthService = IS_DEV_MODE
  ? mockAdminAuthService
  : firebaseAdminAuthService;

export const passwordAuthService = IS_DEV_MODE
  ? mockPasswordAuthService
  : firebasePasswordAuthService;

export const recruiterAuthService = IS_DEV_MODE
  ? mockRecruiterAuthService
  : firebaseRecruiterAuthService;

/** Thrown by both implementations — re-exported so `instanceof` still works. */
export { EmailDomainError };
