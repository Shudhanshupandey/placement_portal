/** Public API for the "profile" feature. */
export { profileService } from "@/features/profile/services";
export { useFullProfile } from "@/features/profile/hooks/use-full-profile";
export { useUpdateSettings } from "@/features/profile/hooks/use-update-settings";
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
  StudentSettings,
} from "@/features/profile/types";
