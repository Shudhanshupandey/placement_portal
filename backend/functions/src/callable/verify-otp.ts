import { onCall, HttpsError } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "../lib/admin";
import {
  EMAIL_DOMAIN_ERROR,
  OTP_CONFIG,
  emailKey,
  hashOtp,
  isAllowedEmail,
} from "../lib/otp";
import { CALLABLE_OPTIONS } from "../lib/https-options";

interface OtpDoc {
  hashedOtp: string;
  expiresAt: number;
  attempts: number;
}

export const verifyOtp = onCall(
  CALLABLE_OPTIONS,
  async (request) => {
    const email = String(request.data?.email ?? "").trim().toLowerCase();
    const otp = String(request.data?.otp ?? "").trim();

    if (!email || !isAllowedEmail(email)) {
      throw new HttpsError("permission-denied", EMAIL_DOMAIN_ERROR);
    }
    if (!/^\d{6}$/.test(otp)) {
      throw new HttpsError("invalid-argument", "Enter the 6-digit code.");
    }

    const ref = adminDb.collection("otpRequests").doc(emailKey(email));
    const snap = await ref.get();
    if (!snap.exists) {
      throw new HttpsError("not-found", "No active code. Please request a new one.");
    }
    const data = snap.data() as OtpDoc;
    const now = Date.now();

    if (now > data.expiresAt) {
      await ref.delete();
      throw new HttpsError("deadline-exceeded", "Your code has expired.");
    }
    if ((data.attempts ?? 0) >= OTP_CONFIG.maxVerifyAttempts) {
      await ref.delete();
      throw new HttpsError(
        "resource-exhausted",
        "Too many incorrect attempts. Please request a new code."
      );
    }
    if (hashOtp(otp, email) !== data.hashedOtp) {
      await ref.update({ attempts: FieldValue.increment(1) });
      throw new HttpsError("invalid-argument", "Incorrect code. Please try again.");
    }

    // ── Verified ──
    await ref.delete();

    // Get or create the Firebase Auth user for this college email.
    const userRecord = await adminAuth
      .getUserByEmail(email)
      .catch(() =>
        adminAuth.createUser({ email, emailVerified: true })
      );

    const existingRole = (userRecord.customClaims as { role?: string } | undefined)?.role;

    // Once non-institutional domains (e.g. gmail.com) are permitted for
    // students, a recruiter/admin can share a sign-in domain with students.
    // Refuse to convert such an account: silently overwriting the claim below
    // would strip a recruiter of their role and hand student access to an
    // address that only proved control of an inbox.
    if (existingRole && existingRole !== "student") {
      throw new HttpsError(
        "permission-denied",
        `This email is already registered as a ${existingRole} account. Sign in through the management portal instead.`
      );
    }

    // Ensure the student role claim is present.
    if (existingRole !== "student") {
      await adminAuth.setCustomUserClaims(userRecord.uid, {
        ...(userRecord.customClaims ?? {}),
        role: "student",
      });
    }

    // Seed the students/{uid} doc on first login so the client can route.
    const studentRef = adminDb.collection("students").doc(userRecord.uid);
    const studentSnap = await studentRef.get();
    const isNewUser =
      !studentSnap.exists || studentSnap.data()?.profileCompleted !== true;

    const batch = adminDb.batch();

    if (!studentSnap.exists) {
      batch.set(
        studentRef,
        {
          uid: userRecord.uid,
          email,
          role: "student",
          profileCompleted: false,
          completionPercentage: 0,
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }

    // Canonical identity doc (users/{uid}) — created on first login, else touch lastLogin.
    const userRef = adminDb.collection("users").doc(userRecord.uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      batch.set(userRef, {
        uid: userRecord.uid,
        email,
        role: "student",
        profileCompleted: false,
        verificationStatus: "unverified",
        isActive: true,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        lastLogin: FieldValue.serverTimestamp(),
      });
    } else {
      batch.set(
        userRef,
        { lastLogin: FieldValue.serverTimestamp() },
        { merge: true }
      );
    }

    await batch.commit();

    const token = await adminAuth.createCustomToken(userRecord.uid, {
      role: "student",
    });

    return { token, isNewUser };
  }
);
