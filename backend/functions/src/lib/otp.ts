import { createHash, randomInt } from "crypto";
import { ALLOWED_EMAIL_DOMAINS } from "./admin";

/** OTP configuration. */
export const OTP_CONFIG = {
  length: 6,
  ttlMs: 10 * 60 * 1000, // valid 10 minutes
  resendCooldownMs: 45 * 1000, // min gap between sends
  maxSendsPerHour: 5,
  maxVerifyAttempts: 5,
};

/** Server-side pepper for OTP hashing. Override via env in production. */
const PEPPER = process.env.OTP_PEPPER ?? "saitm-portal-otp-pepper";

/** Generate a numeric OTP of the configured length (no leading-zero bias). */
export function generateOtp(): string {
  const max = 10 ** OTP_CONFIG.length;
  return randomInt(0, max).toString().padStart(OTP_CONFIG.length, "0");
}

/** Deterministic, salted hash of an OTP bound to the email. */
export function hashOtp(otp: string, email: string): string {
  return createHash("sha256")
    .update(`${otp}:${email.toLowerCase()}:${PEPPER}`)
    .digest("hex");
}

/** Firestore-safe document id derived from the email. */
export function emailKey(email: string): string {
  return createHash("sha256").update(email.toLowerCase()).digest("hex");
}

const DOMAIN_ALTERNATION = ALLOWED_EMAIL_DOMAINS.map((d) =>
  d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
).join("|");

const ALLOWED_EMAIL_RE = new RegExp(
  `^[a-z0-9._%+-]+@(${DOMAIN_ALTERNATION})$`,
  "i"
);

/** Validate the email against every permitted sign-in domain. */
export function isAllowedEmail(email: string): boolean {
  return ALLOWED_EMAIL_RE.test(email.trim().toLowerCase());
}

/** User-facing rejection message, always naming the domains actually allowed. */
export const EMAIL_DOMAIN_ERROR =
  ALLOWED_EMAIL_DOMAINS.length === 1
    ? `Only official SAITM college emails (@${ALLOWED_EMAIL_DOMAINS[0]}) are allowed.`
    : `Use an email from one of: ${ALLOWED_EMAIL_DOMAINS.map((d) => `@${d}`).join(", ")}.`;
