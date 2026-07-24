export interface DriveEligibility {
  courses?: string[];
  branches?: string[];
  minYear?: number;
  minCgpa?: number;
  maxActiveBacklogs?: number;
  allowBacklogs?: boolean;
  passingYears?: number[];
  requiredSkills?: string[];
}

export type DriveStatus = "draft" | "published" | "closed";

export interface PlacementDrive {
  id: string;
  companyName: string;
  companyLogoUrl?: string;
  role: string;
  jobType?: string; // "Full-time" | "Internship"
  packageLabel: string; // e.g. "8.5 LPA"
  location: string;
  description?: string;
  skills?: string[];
  openings?: number;
  eligibility: DriveEligibility;
  status: DriveStatus;
  lastDateMs: number; // application deadline
  driveDateMs: number; // drive / interview date
  createdAtMs: number;
}
