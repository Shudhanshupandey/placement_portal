/**
 * Public API for the "auth" feature.
 * Import auth only through this barrel — never internal paths.
 */

// Data layer — `services/` selects the Firebase or development implementation.
export {
  authService,
  adminAuthService,
  passwordAuthService,
  recruiterAuthService,
  EmailDomainError,
} from "@/features/auth/services";

// Student — email OTP
export { AuthCard } from "@/features/auth/components/auth-card";
export { useOtpAuth } from "@/features/auth/hooks/use-otp-auth";
export { emailSchema, otpSchema } from "@/features/auth/schemas/auth.schema";
export type {
  EmailFormValues,
  OtpFormValues,
} from "@/features/auth/schemas/auth.schema";

// Management Portal (recruiter + admin, role-selector login)
export { ManagementLoginForm } from "@/features/auth/components/management-login-form";

// Recruiter
export { RecruiterRegisterForm } from "@/features/auth/components/recruiter-register-form";
export { WaitingForApproval } from "@/features/auth/components/waiting-for-approval";
export { VerifyEmailNotice } from "@/features/auth/components/verify-email-notice";

// Shared credentials
export { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
export {
  loginSchema,
  forgotPasswordSchema,
  recruiterRegisterSchema,
} from "@/features/auth/schemas/credentials.schema";
export type {
  LoginFormValues,
  ForgotPasswordValues,
  RecruiterRegisterValues,
} from "@/features/auth/schemas/credentials.schema";
