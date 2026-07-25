import { simulateLatency } from "@/lib/dev-mode/latency";
import { mockDb } from "@/lib/dev-mode/mock-db";
import { signInMockAccount, signOutMock } from "@/lib/dev-mode/mock-auth";

/**
 * Development admin authentication — the mock counterpart of
 * `admin-auth.service.ts`.
 *
 * The role check is the part that matters and it is preserved exactly: an
 * account whose role is not `admin` is signed straight back out with the same
 * message the production service uses. Recruiter credentials can no more unlock
 * the admin console here than they can against Firebase.
 *
 * Seeded account → admin@saitm.org / Admin@123
 */
export const adminAuthService = {
  async login(email: string, password: string): Promise<void> {
    await simulateLatency();

    const account = mockDb.accounts.findByEmail(email);
    if (!account || account.password !== password) {
      throw new Error("Incorrect email or password.");
    }

    signInMockAccount(account);

    // Same post-sign-in role validation as production: authenticate first, then
    // reject on the claim. Anything weaker would let this flow drift apart.
    if (account.role !== "admin") {
      signOutMock();
      throw new Error("You are not authorized to access the admin console.");
    }

    if (!account.status.isActive) {
      signOutMock();
      throw new Error("This account has been deactivated.");
    }
  },
};

export const passwordAuthService = {
  async sendReset(email: string): Promise<void> {
    await simulateLatency();
    if (!email.includes("@")) {
      throw new Error("Enter a valid email address.");
    }
    // Production deliberately succeeds even for unknown addresses to avoid
    // account enumeration. Mirror that silence exactly.
    console.info(`[dev-mode] Password-reset email suppressed for ${email}.`);
  },
};
