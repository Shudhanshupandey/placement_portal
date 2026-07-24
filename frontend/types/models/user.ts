import type { Timestamp } from "firebase/firestore";
import type {
  Role,
  VerificationStatus,
  ApprovalStatus,
} from "@/constants/roles";

/**
 * Firestore: users/{uid} — the canonical identity document.
 * The role here mirrors the Firebase custom claim (source of truth for authz).
 */
export interface AppUser {
  uid: string;
  email: string;
  role: Role;
  profileCompleted: boolean;
  /** Students: admin verification of the submitted profile. */
  verificationStatus: VerificationStatus;
  /** Recruiters: admin approval of the account. */
  approvalStatus?: ApprovalStatus;
  isActive: boolean;
  displayName?: string;
  photoUrl?: string;
  rejectionReason?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  lastLogin?: Timestamp;
}

/** Resolved auth status the AuthProvider exposes app-wide (role from claim). */
export interface AuthStatus {
  role: Role;
  profileCompleted: boolean;
  verificationStatus: VerificationStatus;
  approvalStatus: ApprovalStatus | null;
  isActive: boolean;
  rejectionReason?: string;
}
