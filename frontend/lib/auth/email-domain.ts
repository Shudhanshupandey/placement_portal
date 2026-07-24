import { env } from "@/config/env";

/**
 * Email domains allowed to sign in as a student.
 *
 * `NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN` is comma-separated and MUST mirror
 * `ALLOWED_EMAIL_DOMAIN` in `backend/functions/.env` — the client check is UX
 * only; `sendOtp`/`verifyOtp` re-validate server-side.
 */
export const ALLOWED_DOMAINS: string[] = (() => {
  const parsed = env.allowedEmailDomain
    .split(",")
    .map((d) => d.trim().toLowerCase().replace(/^@/, ""))
    .filter(Boolean);
  return parsed.length > 0 ? parsed : ["saitm.ac.in"];
})();

/** Primary (institutional) domain — used for placeholders and copy. */
export const ALLOWED_DOMAIN = ALLOWED_DOMAINS[0];

const ALLOWED_EMAIL_RE = new RegExp(
  `^[a-z0-9._%+-]+@(${ALLOWED_DOMAINS.map((d) =>
    d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  ).join("|")})$`,
  "i"
);

/** True when the address belongs to one of the permitted sign-in domains. */
export function isAllowedCollegeEmail(email: string): boolean {
  return ALLOWED_EMAIL_RE.test(email.trim().toLowerCase());
}

/** Human list of the permitted domains, e.g. "@saitm.ac.in or @gmail.com". */
export const ALLOWED_DOMAINS_LABEL =
  ALLOWED_DOMAINS.length === 1
    ? `@${ALLOWED_DOMAINS[0]}`
    : `${ALLOWED_DOMAINS.slice(0, -1)
        .map((d) => `@${d}`)
        .join(", ")} or @${ALLOWED_DOMAINS[ALLOWED_DOMAINS.length - 1]}`;

export const EMAIL_DOMAIN_ERROR =
  ALLOWED_DOMAINS.length === 1
    ? `Only official SAITM college emails are allowed (${ALLOWED_DOMAINS_LABEL}). Personal emails like Gmail or Yahoo cannot be used.`
    : `Enter an email ending in ${ALLOWED_DOMAINS_LABEL}.`;
