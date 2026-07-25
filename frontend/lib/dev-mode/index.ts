/**
 * Development Mock Authentication Mode.
 *
 * A parallel implementation of the portal's data and auth boundary that runs
 * entirely in the browser, so the UI can be built and reviewed before Firebase
 * credentials exist. It is additive: not one line of the Firebase
 * implementation, the Firestore access layer, the middleware or the route
 * guards is modified or bypassed.
 *
 * How the swap works
 * ------------------
 * Every service keeps its production file untouched and gains a sibling
 * `*.mock.service.ts` implementing the identical interface. A `services/`
 * barrel picks between them:
 *
 *     export const jobsService = IS_DEV_MODE ? mockJobsService : firebaseJobsService;
 *
 * Hooks and components import the barrel, so nothing above the data layer knows
 * which implementation it is talking to. Going to production is one environment
 * variable — `NEXT_PUBLIC_DEV_MODE=false` — plus real credentials. No imports
 * to unwind, no code to rewrite.
 *
 * What is NOT bypassed
 * --------------------
 * `middleware.ts` still runs on every request and still reads the same
 * `saitm-auth` routing-hint cookie, which the mock provider writes exactly as
 * the Firebase provider does. `RequireAuth` still gates every portal layout.
 * A student still cannot reach `/admin`, an unapproved recruiter is still
 * confined to the pending screen, and an incomplete profile still redirects to
 * onboarding. Role separation behaves in dev precisely as it will in production.
 */

export {
  IS_DEV_MODE,
  IS_DEV_MODE_IN_PRODUCTION_BUILD,
  DEV_MODE_REASON,
} from "@/lib/dev-mode/flag";
export { simulateLatency } from "@/lib/dev-mode/latency";
export { mockDb } from "@/lib/dev-mode/mock-db";
export { mockSession } from "@/lib/dev-mode/mock-session";
export type { MockSessionIdentity } from "@/lib/dev-mode/mock-session";
export { createMockFirebaseUser } from "@/lib/dev-mode/mock-firebase-user";
export {
  resolveMockAuth,
  signInMockAccount,
  signOutMock,
} from "@/lib/dev-mode/mock-auth";
export type { ResolvedMockAuth } from "@/lib/dev-mode/mock-auth";
