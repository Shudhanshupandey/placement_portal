import type { StudentProfile, StudentProfileMeta } from "@/types/models/student";
import type { FullStudentProfile } from "@/features/profile";
import { avatarFor } from "@/data/mock/mock-avatars";
import {
  DEV_STUDENT_UID,
  MOCK_STUDENT_ACCOUNT,
} from "@/data/mock/mock-accounts";
import { CURRENT_YEAR, yearsAgoIso } from "@/data/mock/mock-time";

/**
 * The seeded student's four profile documents — the development stand-in for
 * `students/{uid}`, `academicDetails/{uid}`, `professionalDetails/{uid}` and
 * `documents/{uid}`.
 *
 * These use the REAL production types (`StudentProfile`, `FullStudentProfile`),
 * so a field that does not exist in Firestore cannot exist here either.
 *
 * Note on document URLs: they are Firebase-Storage-shaped placeholders. They
 * render every "uploaded" state correctly but do not resolve to a real file —
 * uploading through the onboarding wizard in dev mode produces working local
 * URLs instead (see `lib/storage/upload.mock.ts`).
 */

const STORAGE_HOST = "https://firebasestorage.googleapis.com/v0/b/saitm-dev.appspot.com/o";
const docUrl = (path: string) =>
  `${STORAGE_HOST}/${encodeURIComponent(`students/${DEV_STUDENT_UID}/${path}`)}?alt=media`;

export const MOCK_STUDENT_PROFILE: StudentProfile = {
  uid: DEV_STUDENT_UID,
  email: MOCK_STUDENT_ACCOUNT.email,
  role: "student",

  fullName: MOCK_STUDENT_ACCOUNT.displayName,
  gender: "male",
  dateOfBirth: yearsAgoIso(21, 8, 12),
  mobileNumber: "9876543210",
  alternateMobileNumber: "9812345678",
  aadhaarNumber: "123456789012",
  category: "general",
  bloodGroup: "O+",
  address: "House 214, Sector 45, Sushant Lok Phase II",
  city: "Gurugram",
  state: "Haryana",
  pincode: "122003",
  photoUrl: avatarFor(MOCK_STUDENT_ACCOUNT.displayName),

  profileCompleted: true,
  completionPercentage: 100,
  sections: {
    personal: true,
    academic: true,
    professional: true,
    documents: true,
  },
};

export const MOCK_STUDENT_ACADEMIC: FullStudentProfile["academic"] = {
  enrollmentNumber: `SAITM/${CURRENT_YEAR - 3}/CSE/0214`,
  universityRollNumber: "21001002214",
  course: "B.Tech",
  branch: "Computer Science & Engineering",
  currentYear: "4",
  currentSemester: "7",
  section: "A",
  admissionYear: String(CURRENT_YEAR - 3),
  expectedPassingYear: String(CURRENT_YEAR + 1),
  tenthPercentage: "92.4",
  twelfthPercentage: "88.6",
  currentCgpa: "8.72",
  activeBacklogs: "0",
  totalBacklogsHistory: "0",
  academicGap: "no",
  academicStatus: "regular",
};

export const MOCK_STUDENT_PROFESSIONAL: FullStudentProfile["professional"] = {
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "SQL",
    "Data Structures",
    "Algorithms",
    "Git",
    "REST APIs",
  ],
  programmingLanguages: ["JavaScript", "TypeScript", "Python", "Java", "C++"],
  frameworks: ["React", "Next.js", "Express", "Tailwind CSS", "Django"],
  technologies: ["Firebase", "PostgreSQL", "Docker", "AWS EC2", "Redis"],
  certifications: [
    "AWS Certified Cloud Practitioner",
    "Meta Front-End Developer (Coursera)",
    "NPTEL — Data Structures & Algorithms (Elite)",
  ],
  projects: [
    {
      title: "Campus Placement Portal",
      description:
        "Full-stack portal for the training & placement cell with role-based dashboards, eligibility-gated applications and interview scheduling. Built with Next.js, TypeScript and Firebase.",
      link: "https://github.com/aarav-sharma/campus-placement-portal",
    },
    {
      title: "MediTrack — Prescription Digitiser",
      description:
        "OCR pipeline that converts handwritten prescriptions into structured records, with a React dashboard for pharmacists. Placed 2nd at Smart India Hackathon internals.",
      link: "https://github.com/aarav-sharma/meditrack",
    },
    {
      title: "Transit Delay Predictor",
      description:
        "Gradient-boosted model predicting Delhi Metro delays from historical GTFS feeds, served through a FastAPI endpoint.",
      link: "https://github.com/aarav-sharma/transit-delay-predictor",
    },
  ],
  internshipExperience:
    "Software Engineering Intern, Nagarro (Jun–Aug " +
    String(CURRENT_YEAR - 1) +
    ") — built internal React dashboards consumed by 40+ delivery managers and cut report load time by 38% through query batching and memoisation.",
  workExperience:
    "Freelance web developer (" +
    String(CURRENT_YEAR - 2) +
    "–present) — delivered four small-business websites on Next.js with Cloudinary-backed media pipelines.",
  github: "https://github.com/aarav-sharma",
  linkedin: "https://linkedin.com/in/aarav-sharma-saitm",
  portfolio: "https://aaravsharma.dev",
  leetcode: "aarav_codes",
  hackerrank: "aarav_sharma",
  codechef: "aarav_21",
  codeforces: "aaravs",
};

export const MOCK_STUDENT_DOCUMENTS: FullStudentProfile["documents"] = {
  resumeUrl: docUrl("resume/aarav-sharma-resume.pdf"),
  passportPhotoUrl: avatarFor(MOCK_STUDENT_ACCOUNT.displayName),
  tenthMarksheetUrl: docUrl("marksheets/class-10-marksheet.pdf"),
  twelfthMarksheetUrl: docUrl("marksheets/class-12-marksheet.pdf"),
  semesterMarksheetUrls: [
    docUrl("marksheets/semester-1.pdf"),
    docUrl("marksheets/semester-2.pdf"),
    docUrl("marksheets/semester-3.pdf"),
    docUrl("marksheets/semester-4.pdf"),
    docUrl("marksheets/semester-5.pdf"),
    docUrl("marksheets/semester-6.pdf"),
  ],
  certificateUrls: [
    docUrl("certificates/aws-cloud-practitioner.pdf"),
    docUrl("certificates/meta-frontend-developer.pdf"),
    docUrl("certificates/nptel-dsa-elite.pdf"),
  ],
};

/** The complete profile the mock `profileService.getFull()` returns. */
export const MOCK_FULL_STUDENT_PROFILE: FullStudentProfile = {
  student: MOCK_STUDENT_PROFILE,
  academic: MOCK_STUDENT_ACADEMIC,
  professional: MOCK_STUDENT_PROFESSIONAL,
  documents: MOCK_STUDENT_DOCUMENTS,
};

/** The lightweight meta the AuthProvider exposes app-wide. */
export const MOCK_STUDENT_PROFILE_META: StudentProfileMeta = {
  exists: true,
  profileCompleted: true,
  completionPercentage: 100,
  fullName: MOCK_STUDENT_PROFILE.fullName,
  photoUrl: MOCK_STUDENT_PROFILE.photoUrl,
  sections: MOCK_STUDENT_PROFILE.sections,
};

/**
 * A brand-new student (any other @saitm.ac.in address in dev mode) starts with
 * nothing, so the onboarding wizard and every empty state stay testable.
 */
export function emptyStudentProfile(): FullStudentProfile {
  return { student: null, academic: {}, professional: {}, documents: {} };
}
