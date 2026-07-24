import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";
import { ALLOWED_DOMAIN, adminAuth, adminDb } from "../lib/admin";
import { sendRecruiterVerificationEmail } from "../lib/email";
import { CALLABLE_OPTIONS } from "../lib/https-options";
import { enforceRateLimit } from "../lib/rate-limit";

interface RegisterRecruiterInput {
  email: string;
  password: string;
  fullName: string;
  designation?: string;
  phone?: string;
  companyName: string;
  companyWebsite?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Public callable — registers a recruiter with role=recruiter (claim) and
 * approvalStatus=pending. The account is unusable for privileged actions until
 * an admin approves it. Role assignment happens server-side (never trust client).
 */
export const registerRecruiter = onCall(
  CALLABLE_OPTIONS,
  async (request) => {
    const data = (request.data ?? {}) as RegisterRecruiterInput;
    const email = String(data.email ?? "").trim().toLowerCase();
    const password = String(data.password ?? "");
    const fullName = String(data.fullName ?? "").trim();
    const companyName = String(data.companyName ?? "").trim();

    if (!EMAIL_RE.test(email)) {
      throw new HttpsError("invalid-argument", "Enter a valid work email address.");
    }
    if (email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      throw new HttpsError(
        "invalid-argument",
        `The @${ALLOWED_DOMAIN} domain is reserved for students. Use your work email.`
      );
    }

    // Throttle BEFORE creating anything. This endpoint is public and sends mail
    // through the same Gmail account as student OTPs, so unmetered signups
    // could exhaust the daily send quota and break student sign-in.
    // Per-address first (cheap, catches retry storms)…
    await enforceRateLimit({
      scope: "recruiter-signup-email",
      key: email,
      max: 3,
      windowMs: 60 * 60 * 1000,
      message: "Too many registration attempts for this email. Try again later.",
    });
    // …then per-caller, which is what actually stops address enumeration.
    const callerIp = request.rawRequest?.ip ?? "unknown";
    await enforceRateLimit({
      scope: "recruiter-signup-ip",
      key: callerIp,
      max: 10,
      windowMs: 60 * 60 * 1000,
      message: "Too many registration attempts. Please try again later.",
    });
    if (password.length < 8) {
      throw new HttpsError("invalid-argument", "Password must be at least 8 characters.");
    }
    if (fullName.length < 2 || companyName.length < 2) {
      throw new HttpsError("invalid-argument", "Name and company are required.");
    }

    // Reject duplicates.
    const existing = await adminAuth.getUserByEmail(email).catch(() => null);
    if (existing) {
      throw new HttpsError("already-exists", "An account with this email already exists.");
    }

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: fullName,
      emailVerified: false,
    });

    await adminAuth.setCustomUserClaims(userRecord.uid, { role: "recruiter" });

    const batch = adminDb.batch();
    batch.set(adminDb.collection("users").doc(userRecord.uid), {
      uid: userRecord.uid,
      email,
      role: "recruiter",
      profileCompleted: true,
      approvalStatus: "pending",
      isActive: false, // activated on approval
      displayName: fullName,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    batch.set(adminDb.collection("recruiters").doc(userRecord.uid), {
      uid: userRecord.uid,
      email,
      fullName,
      designation: data.designation ?? "",
      phone: data.phone ?? "",
      companyName,
      companyWebsite: data.companyWebsite ?? "",
      emailVerified: false,
      approvalStatus: "pending",
      createdAt: FieldValue.serverTimestamp(),
    });
    await batch.commit();

    // Queue an email-verification link.
    try {
      const link = await adminAuth.generateEmailVerificationLink(email);
      await sendRecruiterVerificationEmail(email, link);
    } catch (err) {
      logger.warn("Failed to queue recruiter verification email", err);
    }

    return { success: true };
  }
);
