/**
 * SAITM Placement Portal — Cloud Functions entry point.
 *
 * Authentication & Authorization:
 *   sendOtp / verifyOtp     — student email-OTP → custom token (role: student)
 *   registerRecruiter       — self-serve recruiter signup (role: recruiter, pending)
 *   approveRecruiter        — admin approves/rejects a recruiter
 *   reviewStudent           — admin verifies/rejects a student profile
 */
import "./lib/admin";

export { sendOtp } from "./callable/send-otp";
export { verifyOtp } from "./callable/verify-otp";
export { registerRecruiter } from "./callable/register-recruiter";
export { approveRecruiter } from "./callable/approve-recruiter";
export { reviewStudent } from "./callable/review-student";
