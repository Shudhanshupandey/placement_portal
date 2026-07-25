import type { RecruiterRegisterValues } from "@/features/auth/schemas/credentials.schema";
import { simulateLatency } from "@/lib/dev-mode/latency";
import { mockDb } from "@/lib/dev-mode/mock-db";
import { mockSession } from "@/lib/dev-mode/mock-session";
import { signInMockAccount, signOutMock } from "@/lib/dev-mode/mock-auth";
import type { MockAccount } from "@/data/mock";

/**
 * Development recruiter authentication — the mock counterpart of
 * `recruiter-auth.service.ts`.
 *
 * Registration reproduces the production lifecycle that the `registerRecruiter`
 * Cloud Function implements: the account is created with `role=recruiter` and
 * `approvalStatus=pending`, and email verification starts unconfirmed. That
 * matters — it is the only way to exercise the "waiting for approval" and
 * "verify your email" screens, which a shortcut straight to `approved` would
 * hide.
 *
 * Seeded account → recruiter@saitm.demo / Recruiter@123 (verified, approved).
 */
export const recruiterAuthService = {
  async register(values: RecruiterRegisterValues): Promise<void> {
    await simulateLatency(600);

    const email = values.email.trim().toLowerCase();
    if (mockDb.accounts.findByEmail(email)) {
      throw new Error("An account with this email already exists.");
    }

    const account: MockAccount = {
      uid: `dev-recruiter-${email.split("@")[0].replace(/[^a-z0-9]+/g, "-")}`,
      email,
      role: "recruiter",
      displayName: values.fullName,
      // New registrations start unverified and unapproved, exactly as in prod.
      emailVerified: false,
      password: values.password,
      companyName: values.companyName,
      designation: values.designation,
      phone: values.phone,
      status: {
        role: "recruiter",
        profileCompleted: true,
        verificationStatus: "unverified",
        approvalStatus: "pending",
        isActive: true,
      },
      statusLabel: `Pending approval · ${values.companyName}`,
    };

    mockDb.accounts.upsert(account);
    console.info(
      `[dev-mode] Recruiter registered: ${email}. Sign in with the password you chose; ` +
        "the account starts unverified and awaiting admin approval."
    );
  },

  async login(email: string, password: string): Promise<{ emailVerified: boolean }> {
    await simulateLatency();

    const account = mockDb.accounts.findByEmail(email);
    if (!account || account.password !== password) {
      throw new Error("Incorrect email or password.");
    }

    signInMockAccount(account);

    if (account.role !== "recruiter") {
      signOutMock();
      throw new Error("This account is not registered as a recruiter.");
    }

    return { emailVerified: account.emailVerified };
  },

  async resendVerification(): Promise<void> {
    const identity = mockSession.get();
    if (!identity) throw new Error("You must be signed in.");
    await simulateLatency();

    // No mailbox to check in dev mode, so confirm the address immediately —
    // otherwise the recruiter portal is unreachable behind a link that can
    // never arrive. The screen it unblocks is still rendered on first login.
    mockDb.accounts.patch(identity.uid, { emailVerified: true });
    mockSession.set({ ...identity, emailVerified: true });
    console.info(
      `[dev-mode] Email verification auto-confirmed for ${identity.email} ` +
        "(no message is sent). Use Refresh to continue."
    );
  },
};
