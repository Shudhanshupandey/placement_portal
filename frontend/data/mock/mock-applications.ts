import type { Application, ApplicantSnapshot } from "@/features/applications";
import { MOCK_DRIVES } from "@/data/mock/mock-drives";
import {
  MOCK_STUDENT_ACADEMIC,
  MOCK_STUDENT_DOCUMENTS,
  MOCK_STUDENT_PROFESSIONAL,
  MOCK_STUDENT_PROFILE,
} from "@/data/mock/mock-student";
import { DEV_STUDENT_UID } from "@/data/mock/mock-accounts";
import { daysAgo } from "@/data/mock/mock-time";

/**
 * Applications for the seeded student — the development stand-in for the
 * `applications` collection, typed with the production `Application` model.
 *
 * Between them these six cover every `ApplicationStatus` the UI can render, so
 * the status filter chips, the statistics tile, the timeline component and the
 * "already applied" branch of ApplyButton all have something to show. Two
 * eligible drives are deliberately left un-applied so the apply flow itself
 * stays testable.
 */

/** Exactly what `applicationsService.apply()` snapshots at submit time. */
export const MOCK_APPLICANT_SNAPSHOT: ApplicantSnapshot = {
  fullName: MOCK_STUDENT_PROFILE.fullName,
  email: MOCK_STUDENT_PROFILE.email,
  phone: MOCK_STUDENT_PROFILE.mobileNumber,
  course: MOCK_STUDENT_ACADEMIC.course,
  branch: MOCK_STUDENT_ACADEMIC.branch,
  currentYear: MOCK_STUDENT_ACADEMIC.currentYear,
  cgpa: MOCK_STUDENT_ACADEMIC.currentCgpa,
  resumeUrl: MOCK_STUDENT_DOCUMENTS.resumeUrl,
  skills: MOCK_STUDENT_PROFESSIONAL.skills,
  photoUrl: MOCK_STUDENT_PROFILE.photoUrl,
};

const driveById = (id: string) => {
  const drive = MOCK_DRIVES.find((d) => d.id === id);
  if (!drive) throw new Error(`[mock] unknown drive id: ${id}`);
  return drive;
};

/** Build an application from a drive so company/role/package never drift. */
function application(
  driveId: string,
  status: Application["status"],
  appliedDaysAgo: number,
  timeline: Application["timeline"]
): Application {
  const drive = driveById(driveId);
  return {
    id: `${DEV_STUDENT_UID}_${driveId}`,
    studentId: DEV_STUDENT_UID,
    driveId,
    companyName: drive.companyName,
    role: drive.role,
    companyLogoUrl: drive.companyLogoUrl,
    packageLabel: drive.packageLabel,
    location: drive.location,
    status,
    appliedAtMs: daysAgo(appliedDaysAgo),
    updatedAtMs: timeline[timeline.length - 1]?.atMs ?? daysAgo(appliedDaysAgo),
    timeline,
    applicant: MOCK_APPLICANT_SNAPSHOT,
  };
}

export const MOCK_APPLICATIONS: Application[] = [
  application("drv-infosys-se", "pending", 2, [
    { status: "pending", atMs: daysAgo(2) },
  ]),

  application("drv-deloitte-analyst", "under_review", 5, [
    { status: "pending", atMs: daysAgo(5) },
    {
      status: "under_review",
      atMs: daysAgo(3),
      note: "Profile forwarded to the Deloitte campus team for screening.",
    },
  ]),

  application("drv-zoho-sde", "shortlisted", 8, [
    { status: "pending", atMs: daysAgo(8) },
    { status: "under_review", atMs: daysAgo(6) },
    {
      status: "shortlisted",
      atMs: daysAgo(2),
      note: "Cleared the online programming assessment with 78/100.",
    },
  ]),

  application("drv-hcl-intern", "interview_scheduled", 12, [
    { status: "pending", atMs: daysAgo(12) },
    { status: "under_review", atMs: daysAgo(10) },
    { status: "shortlisted", atMs: daysAgo(6) },
    {
      status: "interview_scheduled",
      atMs: daysAgo(1),
      note: "Technical round scheduled — joining link shared over email.",
    },
  ]),

  application("drv-demo-intern", "selected", 62, [
    { status: "pending", atMs: daysAgo(62) },
    { status: "under_review", atMs: daysAgo(58) },
    { status: "shortlisted", atMs: daysAgo(54) },
    { status: "interview_scheduled", atMs: daysAgo(48) },
    {
      status: "selected",
      atMs: daysAgo(44),
      note: "Selected for the winter internship cohort. Offer letter to follow.",
    },
  ]),

  application("drv-tcs-ninja", "offer_released", 104, [
    { status: "pending", atMs: daysAgo(104) },
    { status: "under_review", atMs: daysAgo(99) },
    { status: "shortlisted", atMs: daysAgo(92) },
    { status: "interview_scheduled", atMs: daysAgo(86) },
    { status: "selected", atMs: daysAgo(79) },
    {
      status: "offer_released",
      atMs: daysAgo(70),
      note: "Offer letter released — acceptance window closes in 14 days.",
    },
  ]),

  application("drv-wipro-elite", "rejected", 34, [
    { status: "pending", atMs: daysAgo(34) },
    { status: "under_review", atMs: daysAgo(30) },
    {
      status: "rejected",
      atMs: daysAgo(24),
      note: "Not shortlisted after the aptitude round. Feedback: improve verbal reasoning.",
    },
  ]),
];
