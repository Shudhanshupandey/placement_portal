import type { VerificationStatus } from "@/constants/roles";
import { avatarFor } from "@/data/mock/mock-avatars";
import { DEV_STUDENT_UID } from "@/data/mock/mock-accounts";
import { CURRENT_YEAR, daysAgo } from "@/data/mock/mock-time";

/**
 * The student directory the admin "Students" module lists and the recruiter
 * "Candidate Search" module filters.
 *
 * This is a denormalised row — exactly the projection a paginated Firestore
 * query would return, rather than the four-document `FullStudentProfile` the
 * student's own pages load. Keeping the two shapes distinct is deliberate:
 * a directory that embedded the full profile would not scale past a few
 * hundred students.
 */

export type PlacementState = "placed" | "in_process" | "not_placed" | "opted_out";

export interface MockStudentRow {
  uid: string;
  fullName: string;
  email: string;
  photoUrl: string;
  enrollmentNumber: string;
  course: string;
  branch: string;
  currentYear: number;
  cgpa: number;
  activeBacklogs: number;
  passingYear: number;
  verificationStatus: VerificationStatus;
  placementState: PlacementState;
  applicationsCount: number;
  offersCount: number;
  highestOfferLpa?: number;
  placedAt?: string;
  skills: string[];
  registeredAtMs: number;
}

const BRANCHES = {
  cse: "Computer Science & Engineering",
  it: "Information Technology",
  ece: "Electronics & Communication",
  me: "Mechanical Engineering",
  ce: "Civil Engineering",
} as const;

export const MOCK_STUDENT_DIRECTORY: MockStudentRow[] = [
  {
    uid: DEV_STUDENT_UID,
    fullName: "Aarav Sharma",
    email: "student@saitm.ac.in",
    photoUrl: avatarFor("Aarav Sharma"),
    enrollmentNumber: `SAITM/${CURRENT_YEAR - 3}/CSE/0214`,
    course: "B.Tech",
    branch: BRANCHES.cse,
    currentYear: 4,
    cgpa: 8.72,
    activeBacklogs: 0,
    passingYear: CURRENT_YEAR + 1,
    verificationStatus: "verified",
    placementState: "in_process",
    applicationsCount: 7,
    offersCount: 2,
    highestOfferLpa: 3.36,
    placedAt: "Tata Consultancy Services",
    skills: ["React", "TypeScript", "Node.js", "Python", "SQL"],
    registeredAtMs: daysAgo(180),
  },
  {
    uid: "stu-2102",
    fullName: "Ishita Rao",
    email: "ishita.rao@saitm.ac.in",
    photoUrl: avatarFor("Ishita Rao"),
    enrollmentNumber: `SAITM/${CURRENT_YEAR - 3}/CSE/0187`,
    course: "B.Tech",
    branch: BRANCHES.cse,
    currentYear: 4,
    cgpa: 9.14,
    activeBacklogs: 0,
    passingYear: CURRENT_YEAR + 1,
    verificationStatus: "verified",
    placementState: "placed",
    applicationsCount: 5,
    offersCount: 2,
    highestOfferLpa: 14,
    placedAt: "Zoho Corporation",
    skills: ["Java", "Spring Boot", "Algorithms", "System Design"],
    registeredAtMs: daysAgo(176),
  },
  {
    uid: "stu-2103",
    fullName: "Mohd Faizan",
    email: "mohd.faizan@saitm.ac.in",
    photoUrl: avatarFor("Mohd Faizan"),
    enrollmentNumber: `SAITM/${CURRENT_YEAR - 3}/IT/0092`,
    course: "B.Tech",
    branch: BRANCHES.it,
    currentYear: 4,
    cgpa: 7.86,
    activeBacklogs: 0,
    passingYear: CURRENT_YEAR + 1,
    verificationStatus: "verified",
    placementState: "placed",
    applicationsCount: 6,
    offersCount: 1,
    highestOfferLpa: 7.8,
    placedAt: "Deloitte India",
    skills: ["SQL", "Power BI", "Python", "Cloud Fundamentals"],
    registeredAtMs: daysAgo(174),
  },
  {
    uid: "stu-2104",
    fullName: "Simran Kaur",
    email: "simran.kaur@saitm.ac.in",
    photoUrl: avatarFor("Simran Kaur"),
    enrollmentNumber: `SAITM/${CURRENT_YEAR - 3}/ECE/0051`,
    course: "B.Tech",
    branch: BRANCHES.ece,
    currentYear: 4,
    cgpa: 8.05,
    activeBacklogs: 1,
    passingYear: CURRENT_YEAR + 1,
    verificationStatus: "pending",
    placementState: "in_process",
    applicationsCount: 3,
    offersCount: 0,
    skills: ["VLSI", "Embedded C", "MATLAB"],
    registeredAtMs: daysAgo(41),
  },
  {
    uid: "stu-2105",
    fullName: "Rohan Gupta",
    email: "rohan.gupta@saitm.ac.in",
    photoUrl: avatarFor("Rohan Gupta"),
    enrollmentNumber: `SAITM/${CURRENT_YEAR - 3}/ME/0133`,
    course: "B.Tech",
    branch: BRANCHES.me,
    currentYear: 4,
    cgpa: 7.42,
    activeBacklogs: 0,
    passingYear: CURRENT_YEAR + 1,
    verificationStatus: "verified",
    placementState: "placed",
    applicationsCount: 4,
    offersCount: 1,
    highestOfferLpa: 8.2,
    placedAt: "Maruti Suzuki",
    skills: ["AutoCAD", "SolidWorks", "Quality Control"],
    registeredAtMs: daysAgo(168),
  },
  {
    uid: "stu-2106",
    fullName: "Priyanka Yadav",
    email: "priyanka.yadav@saitm.ac.in",
    photoUrl: avatarFor("Priyanka Yadav"),
    enrollmentNumber: `SAITM/${CURRENT_YEAR - 3}/CSE/0201`,
    course: "B.Tech",
    branch: BRANCHES.cse,
    currentYear: 4,
    cgpa: 6.48,
    activeBacklogs: 2,
    passingYear: CURRENT_YEAR + 1,
    verificationStatus: "rejected",
    placementState: "not_placed",
    applicationsCount: 1,
    offersCount: 0,
    skills: ["HTML", "CSS", "JavaScript"],
    registeredAtMs: daysAgo(58),
  },
  {
    uid: "stu-2107",
    fullName: "Aditya Nair",
    email: "aditya.nair@saitm.ac.in",
    photoUrl: avatarFor("Aditya Nair"),
    enrollmentNumber: `SAITM/${CURRENT_YEAR - 3}/IT/0118`,
    course: "B.Tech",
    branch: BRANCHES.it,
    currentYear: 4,
    cgpa: 8.91,
    activeBacklogs: 0,
    passingYear: CURRENT_YEAR + 1,
    verificationStatus: "verified",
    placementState: "placed",
    applicationsCount: 8,
    offersCount: 3,
    highestOfferLpa: 12,
    placedAt: "Deloitte India",
    skills: ["React", "Node.js", "AWS", "Docker"],
    registeredAtMs: daysAgo(171),
  },
  {
    uid: "stu-2108",
    fullName: "Tanvi Deshmukh",
    email: "tanvi.deshmukh@saitm.ac.in",
    photoUrl: avatarFor("Tanvi Deshmukh"),
    enrollmentNumber: `SAITM/${CURRENT_YEAR - 2}/CSE/0044`,
    course: "B.Tech",
    branch: BRANCHES.cse,
    currentYear: 3,
    cgpa: 8.33,
    activeBacklogs: 0,
    passingYear: CURRENT_YEAR + 2,
    verificationStatus: "verified",
    placementState: "in_process",
    applicationsCount: 2,
    offersCount: 0,
    skills: ["Python", "Machine Learning", "Pandas"],
    registeredAtMs: daysAgo(96),
  },
  {
    uid: "stu-2109",
    fullName: "Harsh Vardhan",
    email: "harsh.vardhan@saitm.ac.in",
    photoUrl: avatarFor("Harsh Vardhan"),
    enrollmentNumber: `SAITM/${CURRENT_YEAR - 3}/CE/0026`,
    course: "B.Tech",
    branch: BRANCHES.ce,
    currentYear: 4,
    cgpa: 7.11,
    activeBacklogs: 0,
    passingYear: CURRENT_YEAR + 1,
    verificationStatus: "verified",
    placementState: "opted_out",
    applicationsCount: 0,
    offersCount: 0,
    skills: ["STAAD Pro", "Surveying"],
    registeredAtMs: daysAgo(160),
  },
  {
    uid: "stu-2110",
    fullName: "Nikhil Chandra",
    email: "nikhil.chandra@saitm.ac.in",
    photoUrl: avatarFor("Nikhil Chandra"),
    enrollmentNumber: `SAITM/${CURRENT_YEAR - 3}/CSE/0165`,
    course: "B.Tech",
    branch: BRANCHES.cse,
    currentYear: 4,
    cgpa: 8.02,
    activeBacklogs: 0,
    passingYear: CURRENT_YEAR + 1,
    verificationStatus: "unverified",
    placementState: "not_placed",
    applicationsCount: 0,
    offersCount: 0,
    skills: [],
    registeredAtMs: daysAgo(9),
  },
];

/** Profiles waiting on TPO review — the admin dashboard's action queue. */
export const MOCK_PENDING_VERIFICATIONS = MOCK_STUDENT_DIRECTORY.filter(
  (s) => s.verificationStatus === "pending"
);
