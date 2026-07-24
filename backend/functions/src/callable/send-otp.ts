import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { adminDb } from "../lib/admin";
import {
  EMAIL_DOMAIN_ERROR,
  OTP_CONFIG,
  emailKey,
  generateOtp,
  hashOtp,
  isAllowedEmail,
} from "../lib/otp";
import { sendOtpEmail } from "../lib/email";
import { CALLABLE_OPTIONS } from "../lib/https-options";

const HOUR_MS = 60 * 60 * 1000;

interface OtpDoc {
  hashedOtp: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
  windowStart: number;
  sendCount: number;
}

export const sendOtp = onCall(
  CALLABLE_OPTIONS,
  async (request) => {
    const email = String(request.data?.email ?? "").trim().toLowerCase();

    if (!email || !isAllowedEmail(email)) {
      throw new HttpsError("permission-denied", EMAIL_DOMAIN_ERROR);
    }

    const ref = adminDb.collection("otpRequests").doc(emailKey(email));
    const now = Date.now();
    const snap = await ref.get();
    const prev = (snap.exists ? snap.data() : undefined) as OtpDoc | undefined;

    // Cooldown between consecutive sends.
    if (prev?.lastSentAt && now - prev.lastSentAt < OTP_CONFIG.resendCooldownMs) {
      const wait = Math.ceil(
        (OTP_CONFIG.resendCooldownMs - (now - prev.lastSentAt)) / 1000
      );
      throw new HttpsError(
        "resource-exhausted",
        `Please wait ${wait}s before requesting another code.`
      );
    }

    // Rolling hourly cap.
    const withinWindow = prev?.windowStart && now - prev.windowStart < HOUR_MS;
    const windowStart = withinWindow ? prev!.windowStart : now;
    const sendCount = (withinWindow ? prev!.sendCount ?? 0 : 0) + 1;
    if (sendCount > OTP_CONFIG.maxSendsPerHour) {
      throw new HttpsError(
        "resource-exhausted",
        "Too many code requests. Please try again later."
      );
    }

    const otp = generateOtp();
    const doc: OtpDoc = {
      hashedOtp: hashOtp(otp, email),
      expiresAt: now + OTP_CONFIG.ttlMs,
      attempts: 0,
      lastSentAt: now,
      windowStart,
      sendCount,
    };
    await ref.set(doc);

    try {
      await sendOtpEmail(email, otp);
    } catch (err) {
      logger.error("Failed to queue OTP email", err);
      throw new HttpsError(
        "unavailable",
        "Unable to send the verification email right now."
      );
    }

    // The code is NEVER returned to or logged for the client — the emailed
    // message is the only channel that carries it.
    return {
      success: true,
      cooldownSeconds: OTP_CONFIG.resendCooldownMs / 1000,
    };
  }
);
