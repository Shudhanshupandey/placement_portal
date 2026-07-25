import type { Role } from "@/constants/roles";
import type { AuthStatus } from "@/types/models/user";

/**
 * The three seeded development accounts.
 *
 * These exist ONLY to unblock UI work before real Firebase credentials are
 * provisioned. They are consumed exclusively by `*.mock.service.ts` files,
 * which are selected by `IS_DEV_MODE` — with the flag off, nothing in this
 * module is reachable from the running application.
 *
 * The passwords below are not secrets: they authenticate against an in-memory
 * fixture store, never against Firebase Authentication, and they grant access
 * to fabricated data only.
 */

export const DEV_STUDENT_UID = "dev-student-2101";
export const DEV_RECRUITER_UID = "dev-recruiter-4402";
export const DEV_ADMIN_UID = "dev-admin-0001";

/** The only OTP the development student portal accepts. */
export const DEV_OTP = "123456";

export interface MockAccount {
  uid: string;
  email: string;
  role: Role;
  displayName: string;
  photoUrl?: string;
  emailVerified: boolean;
  /** Management accounts only — students authenticate with {@link DEV_OTP}. */
  password?: string;
  /** Mirrors the resolved `users/{uid}` document in production. */
  status: AuthStatus;
  /** Recruiter-only company binding. */
  companyName?: string;
  designation?: string;
  phone?: string;
  /** Human label shown in the dev sign-in toolbar. */
  statusLabel: string;
}

export const MOCK_STUDENT_ACCOUNT: MockAccount = {
  uid: DEV_STUDENT_UID,
  email: "student@saitm.ac.in",
  role: "student",
  displayName: "Aarav Sharma",
  emailVerified: true,
  status: {
    role: "student",
    profileCompleted: true,
    verificationStatus: "verified",
    approvalStatus: null,
    isActive: true,
  },
  statusLabel: "Verified · Profile 100%",
};

export const MOCK_RECRUITER_ACCOUNT: MockAccount = {
  uid: DEV_RECRUITER_UID,
  email: "recruiter@saitm.org",
  role: "recruiter",
  displayName: "Neha Verma",
  emailVerified: true,
  password: "Recruiter@123",
  companyName: "Demo Company Pvt Ltd",
  designation: "Senior Talent Acquisition Partner",
  phone: "9810045521",
  status: {
    role: "recruiter",
    profileCompleted: true,
    verificationStatus: "verified",
    approvalStatus: "approved",
    isActive: true,
  },
  statusLabel: "Approved · Demo Company Pvt Ltd",
};

export const MOCK_ADMIN_ACCOUNT: MockAccount = {
  uid: DEV_ADMIN_UID,
  email: "admin@saitm.org",
  role: "admin",
  displayName: "Dr. R. K. Malhotra",
  emailVerified: true,
  password: "Admin@123",
  designation: "Training & Placement Officer",
  status: {
    role: "admin",
    profileCompleted: true,
    verificationStatus: "verified",
    approvalStatus: null,
    isActive: true,
  },
  statusLabel: "Super Admin",
};

export const MOCK_ACCOUNTS: MockAccount[] = [
  MOCK_STUDENT_ACCOUNT,
  MOCK_RECRUITER_ACCOUNT,
  MOCK_ADMIN_ACCOUNT,
];

/** Case-insensitive lookup, mirroring Firebase Auth's email handling. */
export function findMockAccount(
  email: string,
  accounts: MockAccount[] = MOCK_ACCOUNTS
): MockAccount | undefined {
  const needle = email.trim().toLowerCase();
  return accounts.find((a) => a.email.toLowerCase() === needle);
}
