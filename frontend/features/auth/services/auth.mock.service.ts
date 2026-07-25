import { isAllowedCollegeEmail } from "@/lib/auth/email-domain";
import { EmailDomainError } from "@/features/auth/services/auth.service";
import { simulateLatency } from "@/lib/dev-mode/latency";
import { mockDb } from "@/lib/dev-mode/mock-db";
import { signInMockAccount } from "@/lib/dev-mode/mock-auth";
import { DEV_OTP, MOCK_STUDENT_ACCOUNT, type MockAccount } from "@/data/mock";

/**
 * Development student authentication — the mock counterpart of
 * `auth.service.ts`. Identical method names, arguments, return shapes and
 * error semantics; the OTP is verified locally instead of by the `sendOtp` /
 * `verifyOtp` Cloud Functions.
 *
 * `EmailDomainError` is imported from the real service rather than redeclared,
 * so `instanceof` checks in the UI behave the same under both implementations.
 *
 * Seeded student  → student@saitm.ac.in, complete profile, straight to the dashboard.
 * Any other @saitm.ac.in address → treated as a first-time student, so the
 * onboarding wizard and every empty state stay reachable without editing data.
 */

interface SendOtpResponse {
  success: boolean;
  cooldownSeconds: number;
}

const DEV_COOLDOWN_SECONDS = 30;

/** Stable, readable uid for an ad-hoc development student. */
function uidForEmail(email: string): string {
  const local = email.trim().toLowerCase().split("@")[0].replace(/[^a-z0-9]+/g, "-");
  return `dev-student-${local}`;
}

function ensureAccount(email: string): { account: MockAccount; isNewUser: boolean } {
  const existing = mockDb.accounts.findByEmail(email);
  if (existing) {
    // "New" means onboarding is unfinished, which is what the caller routes on.
    const profile = mockDb.profiles.get(existing.uid);
    return { account: existing, isNewUser: !profile.student?.profileCompleted };
  }

  const normalised = email.trim().toLowerCase();
  const account: MockAccount = {
    uid: uidForEmail(normalised),
    email: normalised,
    role: "student",
    displayName: normalised.split("@")[0].replace(/[._-]+/g, " "),
    emailVerified: true,
    status: {
      role: "student",
      profileCompleted: false,
      verificationStatus: "unverified",
      approvalStatus: null,
      isActive: true,
    },
    statusLabel: "New student · Onboarding pending",
  };
  mockDb.accounts.upsert(account);
  return { account, isNewUser: true };
}

export const authService = {
  async requestOtp(email: string): Promise<SendOtpResponse> {
    if (!isAllowedCollegeEmail(email)) throw new EmailDomainError();
    await simulateLatency();

    // The code is fixed in dev mode; print it so nobody has to read the source.
    console.info(
      `[dev-mode] OTP for ${email.trim().toLowerCase()} is ${DEV_OTP} (no email is sent).`
    );

    return { success: true, cooldownSeconds: DEV_COOLDOWN_SECONDS };
  },

  async verifyOtp(email: string, otp: string): Promise<{ isNewUser: boolean }> {
    if (!isAllowedCollegeEmail(email)) throw new EmailDomainError();
    await simulateLatency();

    if (otp.trim() !== DEV_OTP) {
      throw new Error(
        `Incorrect code. In development mode the only valid OTP is ${DEV_OTP}.`
      );
    }

    const normalised = email.trim().toLowerCase();
    const { account, isNewUser } =
      normalised === MOCK_STUDENT_ACCOUNT.email
        ? { account: mockDb.accounts.findByEmail(normalised) ?? MOCK_STUDENT_ACCOUNT, isNewUser: false }
        : ensureAccount(normalised);

    signInMockAccount(account);
    return { isNewUser };
  },
};
