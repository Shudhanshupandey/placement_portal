import { httpsCallable, type HttpsCallableResult } from "firebase/functions";
import { signInWithCustomToken } from "firebase/auth";
import { auth, functions } from "@/lib/firebase/client";
import { isAllowedCollegeEmail, EMAIL_DOMAIN_ERROR } from "@/lib/auth/email-domain";

/** Thrown when the entered email is not a @saitm.ac.in address. */
export class EmailDomainError extends Error {
  constructor(message = EMAIL_DOMAIN_ERROR) {
    super(message);
    this.name = "EmailDomainError";
  }
}

interface SendOtpResponse {
  success: boolean;
  /** Seconds until a resend is permitted. */
  cooldownSeconds: number;
}

interface VerifyOtpResponse {
  token: string;
  isNewUser: boolean;
}

const sendOtpFn = httpsCallable<{ email: string }, SendOtpResponse>(
  functions,
  "sendOtp"
);
const verifyOtpFn = httpsCallable<{ email: string; otp: string }, VerifyOtpResponse>(
  functions,
  "verifyOtp"
);

/** Map opaque Firebase callable errors to human messages. */
function toFriendlyError(err: unknown): Error {
  const anyErr = err as { code?: string; message?: string; details?: unknown };
  const code = anyErr?.code ?? "";
  const detailMsg =
    typeof anyErr?.details === "string" ? anyErr.details : anyErr?.message;

  switch (code) {
    case "functions/invalid-argument":
      return new Error(detailMsg || "Invalid request. Please check your input.");
    case "functions/permission-denied":
      return new EmailDomainError();
    case "functions/resource-exhausted":
      return new Error(
        "Too many attempts. Please wait a moment before trying again."
      );
    case "functions/deadline-exceeded":
      return new Error("Your code has expired. Please request a new one.");
    case "functions/not-found":
      return new Error("No active code found. Please request a new one.");
    case "functions/unavailable":
      return new Error("Service temporarily unavailable. Please try again.");
    default:
      return new Error(detailMsg || "Something went wrong. Please try again.");
  }
}

export const authService = {
  /** Step 1–3: validate domain and email an OTP to the college address. */
  async requestOtp(email: string): Promise<SendOtpResponse> {
    if (!isAllowedCollegeEmail(email)) throw new EmailDomainError();
    try {
      const res: HttpsCallableResult<SendOtpResponse> = await sendOtpFn({ email });
      return res.data;
    } catch (err) {
      throw toFriendlyError(err);
    }
  },

  /** Step 4–6: verify the OTP, then sign in with the returned custom token. */
  async verifyOtp(email: string, otp: string): Promise<{ isNewUser: boolean }> {
    if (!isAllowedCollegeEmail(email)) throw new EmailDomainError();
    try {
      const res = await verifyOtpFn({ email, otp });
      const { token, isNewUser } = res.data;
      await signInWithCustomToken(auth, token);
      return { isNewUser };
    } catch (err) {
      throw toFriendlyError(err);
    }
  },
};
