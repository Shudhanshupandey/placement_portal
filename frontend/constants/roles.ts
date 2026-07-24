export const ROLES = {
  student: "student",
  recruiter: "recruiter",
  admin: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Student profile review lifecycle (admin-gated placement access). */
export const VERIFICATION_STATUS = {
  unverified: "unverified", // profile not yet submitted
  pending: "pending", // submitted, awaiting admin review
  verified: "verified", // approved by admin — placement enabled
  rejected: "rejected", // rejected with a reason
} as const;

export type VerificationStatus =
  (typeof VERIFICATION_STATUS)[keyof typeof VERIFICATION_STATUS];

/** Recruiter approval lifecycle. */
export const APPROVAL_STATUS = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
} as const;

export type ApprovalStatus =
  (typeof APPROVAL_STATUS)[keyof typeof APPROVAL_STATUS];

export const ROLE_LABELS: Record<Role, string> = {
  student: "Student",
  recruiter: "Recruiter",
  admin: "Administrator",
};
