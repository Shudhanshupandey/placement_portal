import type { Role } from "@/constants/roles";

/**
 * Typed route map — never hard-code path strings in components.
 *
 * Two isolated portals:
 *  • Student Portal   → /student  (email OTP, @saitm.ac.in only)
 *  • Management Portal → /portal   (Recruiter | Admin role selector, email + password)
 */
export const ROUTES = {
  home: "/",

  // ── Student Portal (public entry) ──
  studentLogin: "/student", // email OTP — students only

  // ── Management Portal (public entry — recruiters & admins) ──
  portal: "/portal", // role selector (Recruiter | Admin) + password
  portalRegister: "/portal/register", // recruiter self-registration

  // ── Shared credential flows ──
  forgotPassword: "/forgot-password", // password reset (management accounts)
  verifyEmail: "/verify-email",
  unauthorized: "/unauthorized",

  // ── Student (protected) ──
  onboarding: "/onboarding",
  student: {
    dashboard: "/dashboard",
    profile: "/profile",
    placementDrives: "/placement-drives",
    companies: "/companies",
    applications: "/applications",
    resume: "/resume",
    documents: "/documents",
    interviews: "/interviews",
    notifications: "/notifications",
    announcements: "/announcements",
    skills: "/skills",
    settings: "/settings",
    help: "/help",
  },

  // ── Recruiter (protected) ──
  recruiter: {
    home: "/recruiter",
    pending: "/recruiter/pending",
  },

  // ── Admin (protected) ──
  admin: {
    home: "/admin",
  },
} as const;

/** Where each role should land after authentication. */
export function homeForRole(role: Role): string {
  switch (role) {
    case "recruiter":
      return ROUTES.recruiter.home;
    case "admin":
      return ROUTES.admin.home;
    default:
      return ROUTES.student.dashboard;
  }
}

/** The correct sign-in entry point for a given role. */
export function loginForRole(role: Role): string {
  switch (role) {
    case "recruiter":
    case "admin":
      return ROUTES.portal; // management portal (recruiter + admin)
    default:
      return ROUTES.studentLogin; // student portal (OTP)
  }
}
