export type ApplicationStatus =
  | "pending"
  | "under_review"
  | "shortlisted"
  | "interview_scheduled"
  | "selected"
  | "rejected"
  | "offer_released";

export interface StatusEvent {
  status: ApplicationStatus;
  atMs: number;
  note?: string;
}

/** Snapshot of the student's profile at apply time (recruiters read this). */
export interface ApplicantSnapshot {
  fullName: string;
  email: string;
  phone?: string;
  course?: string;
  branch?: string;
  currentYear?: string;
  cgpa?: string;
  resumeUrl?: string;
  skills?: string[];
  photoUrl?: string;
}

export interface Application {
  id: string; // `${studentId}_${driveId}`
  studentId: string;
  driveId: string;
  companyName: string;
  role: string;
  companyLogoUrl?: string;
  packageLabel: string;
  location: string;
  status: ApplicationStatus;
  appliedAtMs: number;
  updatedAtMs: number;
  timeline: StatusEvent[];
  applicant: ApplicantSnapshot;
}
