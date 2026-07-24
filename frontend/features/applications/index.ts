/** Public API for the "applications" feature. */
export { ApplyButton } from "@/features/applications/components/apply-button";
export { ApplyDialog } from "@/features/applications/components/apply-dialog";
export { ApplicationRow } from "@/features/applications/components/application-row";
export { ApplicationStats } from "@/features/applications/components/application-stats";
export { StatusBadge } from "@/features/applications/components/status-badge";
export { StatusTimeline } from "@/features/applications/components/status-timeline";
export {
  useMyApplications,
  useApplyToDrive,
} from "@/features/applications/hooks/use-applications";
export { checkEligibility } from "@/features/applications/lib/eligibility";
export type { EligibilityResult } from "@/features/applications/lib/eligibility";
export { STATUS_META, ALL_STATUSES } from "@/features/applications/lib/status-meta";
export type {
  Application,
  ApplicationStatus,
  StatusEvent,
} from "@/features/applications/types";
