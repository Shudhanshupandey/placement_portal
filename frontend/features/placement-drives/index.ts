/** Public API for the "placement-drives" feature. */
export { DriveCard } from "@/features/placement-drives/components/drive-card";
export { useDrives, useDrive } from "@/features/placement-drives/hooks/use-drives";
export { drivesService } from "@/features/placement-drives/services";
export {
  formatDate,
  daysLeft,
  deadlineLabel,
  isDeadlinePassed,
  eligibilitySummary,
} from "@/features/placement-drives/lib/drive-format";
export type {
  PlacementDrive,
  DriveEligibility,
  DriveStatus,
} from "@/features/placement-drives/types";
