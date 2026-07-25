import { companyLogo } from "@/data/mock/company-logos";
import { DEV_STUDENT_UID } from "@/data/mock/mock-accounts";
import { daysAgo, daysFromNow } from "@/data/mock/mock-time";

/**
 * Interview schedule.
 *
 * `features/interviews` has no service or model yet — the student portal
 * currently derives its interview list from applications with the
 * `interview_scheduled` status. This fixture describes the richer schedule the
 * dedicated module will need (round, mode, panel, venue/link), so the shape is
 * a development contract rather than a production one.
 */

export type InterviewMode = "online" | "offline" | "telephonic";
export type InterviewOutcome = "scheduled" | "completed" | "cleared" | "rejected" | "no_show";

export interface MockInterview {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  driveId: string;
  companyName: string;
  companyLogoUrl: string;
  role: string;
  /** e.g. "Technical Round 1", "HR Round". */
  round: string;
  roundNumber: number;
  totalRounds: number;
  mode: InterviewMode;
  /** Meeting link for online rounds, campus venue for offline ones. */
  location: string;
  scheduledAtMs: number;
  durationMinutes: number;
  panel: string[];
  outcome: InterviewOutcome;
  feedback?: string;
  instructions?: string;
}

export const MOCK_INTERVIEWS: MockInterview[] = [
  {
    id: "int-001",
    applicationId: `${DEV_STUDENT_UID}_drv-hcl-intern`,
    studentId: DEV_STUDENT_UID,
    studentName: "Aarav Sharma",
    driveId: "drv-hcl-intern",
    companyName: "HCLTech",
    companyLogoUrl: companyLogo("HCLTech", 4),
    role: "Cloud Engineering Intern",
    round: "Technical Round 1",
    roundNumber: 1,
    totalRounds: 3,
    mode: "online",
    location: "https://meet.example.com/hcltech-campus-r1",
    scheduledAtMs: daysFromNow(2),
    durationMinutes: 45,
    panel: ["Rohit Anand — Engineering Manager", "Priya Nair — Senior SRE"],
    outcome: "scheduled",
    instructions:
      "Join five minutes early with a stable connection. Keep your college ID and a copy of your resume handy. The round covers Linux fundamentals, networking basics and one scripting exercise.",
  },
  {
    id: "int-002",
    applicationId: `${DEV_STUDENT_UID}_drv-zoho-sde`,
    studentId: DEV_STUDENT_UID,
    studentName: "Aarav Sharma",
    driveId: "drv-zoho-sde",
    companyName: "Zoho Corporation",
    companyLogoUrl: companyLogo("Zoho Corporation", 3),
    role: "Member Technical Staff",
    round: "Advanced Programming Round",
    roundNumber: 2,
    totalRounds: 4,
    mode: "offline",
    location: "Computer Lab 3, Block B — SAITM Campus",
    scheduledAtMs: daysFromNow(9),
    durationMinutes: 180,
    panel: ["Zoho Campus Panel"],
    outcome: "scheduled",
    instructions:
      "Pen-and-paper design round followed by machine coding. Laptops are not permitted; systems are provided.",
  },
  {
    id: "int-003",
    applicationId: `${DEV_STUDENT_UID}_drv-demo-intern`,
    studentId: DEV_STUDENT_UID,
    studentName: "Aarav Sharma",
    driveId: "drv-demo-intern",
    companyName: "Demo Company Pvt Ltd",
    companyLogoUrl: companyLogo("Demo Company Pvt Ltd", 1),
    role: "Software Engineering Intern",
    round: "HR Round",
    roundNumber: 2,
    totalRounds: 2,
    mode: "telephonic",
    location: "Scheduled call — +91 124 400 0000",
    scheduledAtMs: daysAgo(46),
    durationMinutes: 30,
    panel: ["Neha Verma — Talent Acquisition"],
    outcome: "cleared",
    feedback:
      "Clear communication and a strong sense of ownership. Recommended for the winter cohort.",
  },
  {
    id: "int-004",
    applicationId: `${DEV_STUDENT_UID}_drv-tcs-ninja`,
    studentId: DEV_STUDENT_UID,
    studentName: "Aarav Sharma",
    driveId: "drv-tcs-ninja",
    companyName: "Tata Consultancy Services",
    companyLogoUrl: companyLogo("Tata Consultancy Services", 1),
    role: "Ninja — Assistant System Engineer",
    round: "Technical + Managerial",
    roundNumber: 1,
    totalRounds: 2,
    mode: "online",
    location: "TCS iON Digital Proctored Platform",
    scheduledAtMs: daysAgo(86),
    durationMinutes: 60,
    panel: ["TCS iON Panel 14"],
    outcome: "cleared",
    feedback: "Solid fundamentals in DBMS and OOP. Cleared to the HR round.",
  },
  {
    id: "int-005",
    applicationId: `${DEV_STUDENT_UID}_drv-wipro-elite`,
    studentId: DEV_STUDENT_UID,
    studentName: "Aarav Sharma",
    driveId: "drv-wipro-elite",
    companyName: "Wipro",
    companyLogoUrl: companyLogo("Wipro", 0),
    role: "Project Engineer — Elite NTH",
    round: "Aptitude Round",
    roundNumber: 1,
    totalRounds: 3,
    mode: "online",
    location: "Wipro Elite NTH Assessment Platform",
    scheduledAtMs: daysAgo(28),
    durationMinutes: 90,
    panel: ["Automated Assessment"],
    outcome: "rejected",
    feedback: "Verbal reasoning score below the qualifying cut-off.",
  },
];

/** Upcoming rounds only, soonest first — what a schedule widget renders. */
export const MOCK_UPCOMING_INTERVIEWS = MOCK_INTERVIEWS.filter(
  (i) => i.outcome === "scheduled"
).sort((a, b) => a.scheduledAtMs - b.scheduledAtMs);
