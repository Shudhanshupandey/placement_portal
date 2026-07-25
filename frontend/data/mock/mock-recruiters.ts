import type { ApprovalStatus } from "@/constants/roles";
import { avatarFor } from "@/data/mock/mock-avatars";
import {
  DEV_RECRUITER_UID,
  MOCK_RECRUITER_ACCOUNT,
} from "@/data/mock/mock-accounts";
import { daysAgo } from "@/data/mock/mock-time";

/**
 * Recruiter accounts — what the admin "Recruiters" module lists and approves.
 *
 * `approvalStatus` uses the production `ApprovalStatus` union so the approval
 * queue, the rejection-reason surface and the pending/approved badges all
 * behave exactly as they will against Firestore.
 */
export interface MockRecruiter {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  photoUrl: string;
  companyId: string;
  companyName: string;
  designation: string;
  companyWebsite: string;
  approvalStatus: ApprovalStatus;
  emailVerified: boolean;
  isActive: boolean;
  rejectionReason?: string;
  jobsPosted: number;
  candidatesShortlisted: number;
  registeredAtMs: number;
  lastActiveAtMs: number;
}

export const MOCK_RECRUITERS: MockRecruiter[] = [
  {
    uid: DEV_RECRUITER_UID,
    fullName: MOCK_RECRUITER_ACCOUNT.displayName,
    email: MOCK_RECRUITER_ACCOUNT.email,
    phone: MOCK_RECRUITER_ACCOUNT.phone ?? "9810045521",
    photoUrl: avatarFor(MOCK_RECRUITER_ACCOUNT.displayName),
    companyId: "cmp-demo",
    companyName: "Demo Company Pvt Ltd",
    designation: MOCK_RECRUITER_ACCOUNT.designation ?? "Talent Acquisition",
    companyWebsite: "https://demo-company.example.com",
    approvalStatus: "approved",
    emailVerified: true,
    isActive: true,
    jobsPosted: 2,
    candidatesShortlisted: 14,
    registeredAtMs: daysAgo(120),
    lastActiveAtMs: daysAgo(1),
  },
  {
    uid: "rec-infosys-01",
    fullName: "Sandeep Iyer",
    email: "sandeep.iyer@infosys.example.com",
    phone: "9845012233",
    photoUrl: avatarFor("Sandeep Iyer"),
    companyId: "cmp-infosys",
    companyName: "Infosys",
    designation: "Campus Hiring Lead",
    companyWebsite: "https://www.infosys.com",
    approvalStatus: "approved",
    emailVerified: true,
    isActive: true,
    jobsPosted: 6,
    candidatesShortlisted: 96,
    registeredAtMs: daysAgo(430),
    lastActiveAtMs: daysAgo(3),
  },
  {
    uid: "rec-deloitte-01",
    fullName: "Ananya Bose",
    email: "ananya.bose@deloitte.example.com",
    phone: "9871223344",
    photoUrl: avatarFor("Ananya Bose"),
    companyId: "cmp-deloitte",
    companyName: "Deloitte India",
    designation: "Talent Acquisition Manager",
    companyWebsite: "https://www2.deloitte.com/in",
    approvalStatus: "approved",
    emailVerified: true,
    isActive: true,
    jobsPosted: 4,
    candidatesShortlisted: 41,
    registeredAtMs: daysAgo(210),
    lastActiveAtMs: daysAgo(2),
  },
  {
    uid: "rec-zoho-01",
    fullName: "Karthik Raman",
    email: "karthik.raman@zoho.example.com",
    phone: "9789001122",
    photoUrl: avatarFor("Karthik Raman"),
    companyId: "cmp-zoho",
    companyName: "Zoho Corporation",
    designation: "Engineering Recruiter",
    companyWebsite: "https://www.zoho.com",
    approvalStatus: "pending",
    emailVerified: true,
    isActive: true,
    jobsPosted: 0,
    candidatesShortlisted: 0,
    registeredAtMs: daysAgo(4),
    lastActiveAtMs: daysAgo(4),
  },
  {
    uid: "rec-brightedge-01",
    fullName: "Vikram Chauhan",
    email: "vikram@brightedge-staffing.example.com",
    phone: "9911223344",
    photoUrl: avatarFor("Vikram Chauhan"),
    companyId: "cmp-unverified",
    companyName: "BrightEdge Staffing Solutions",
    designation: "Consultant",
    companyWebsite: "https://brightedge-staffing.example.com",
    approvalStatus: "pending",
    emailVerified: false,
    isActive: true,
    jobsPosted: 0,
    candidatesShortlisted: 0,
    registeredAtMs: daysAgo(2),
    lastActiveAtMs: daysAgo(2),
  },
  {
    uid: "rec-quickhire-01",
    fullName: "Rakesh Malhotra",
    email: "rakesh@quickhire-jobs.example.com",
    phone: "9900112233",
    photoUrl: avatarFor("Rakesh Malhotra"),
    companyId: "cmp-rejected",
    companyName: "QuickHire Jobs",
    designation: "Owner",
    companyWebsite: "https://quickhire-jobs.example.com",
    approvalStatus: "rejected",
    emailVerified: true,
    isActive: false,
    rejectionReason:
      "Unverifiable company registration and no published corporate domain. Resubmit with GST and incorporation details.",
    jobsPosted: 0,
    candidatesShortlisted: 0,
    registeredAtMs: daysAgo(38),
    lastActiveAtMs: daysAgo(35),
  },
];

/** The approval queue the admin dashboard surfaces as "action required". */
export const MOCK_PENDING_RECRUITERS = MOCK_RECRUITERS.filter(
  (r) => r.approvalStatus === "pending"
);
