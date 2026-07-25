/**
 * Development fixtures — the single import surface for mock data.
 *
 * Nothing here is reachable in production: every consumer sits behind an
 * `IS_DEV_MODE` branch (see `lib/dev-mode/flag.ts`), which Next inlines to a
 * literal `false` at build time so these modules tree-shake out of the bundle.
 *
 * Fixtures typed with PRODUCTION models (they cannot drift from Firestore):
 *   • student profile / academic / professional / documents → `FullStudentProfile`
 *   • placement drives  → `PlacementDrive`
 *   • applications      → `Application`
 *   • notifications     → `AppNotification`
 *
 * Fixtures typed with DEVELOPMENT contracts (no production model exists yet —
 * these modules are unbuilt, so the shape here is a proposal, not a promise):
 *   • companies · recruiters · student directory · interviews · offers
 *   • analytics · reports · activity timeline
 */

export * from "@/data/mock/mock-time";
export * from "@/data/mock/company-logos";
export * from "@/data/mock/mock-avatars";
export * from "@/data/mock/mock-accounts";
export * from "@/data/mock/mock-student";
export * from "@/data/mock/mock-student-directory";
export * from "@/data/mock/mock-companies";
export * from "@/data/mock/mock-recruiters";
export * from "@/data/mock/mock-drives";
export * from "@/data/mock/mock-applications";
export * from "@/data/mock/mock-interviews";
export * from "@/data/mock/mock-offers";
export * from "@/data/mock/mock-notifications";
export * from "@/data/mock/mock-analytics";
export * from "@/data/mock/mock-activity";
