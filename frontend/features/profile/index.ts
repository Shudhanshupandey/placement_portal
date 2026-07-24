/** Public API for the "profile" feature. */
export { profileService } from "@/features/profile/services/profile.service";
export { useFullProfile } from "@/features/profile/hooks/use-full-profile";
export {
  getMissingItems,
  getApplyReadiness,
} from "@/features/profile/lib/missing-sections";
export type { ApplyReadiness } from "@/features/profile/lib/missing-sections";
export { SECTION_STEP } from "@/features/profile/types";
export type {
  FullStudentProfile,
  MissingItem,
  ProfileSection,
} from "@/features/profile/types";
