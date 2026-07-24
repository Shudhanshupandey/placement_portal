import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "@/lib/firebase/client";
import type { RecruiterRegisterValues } from "@/features/auth/schemas/credentials.schema";

const registerFn = httpsCallable<
  Omit<RecruiterRegisterValues, "confirmPassword" | "agree">,
  { success: boolean }
>(functions, "registerRecruiter");

function friendly(err: unknown): Error {
  const code = (err as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return new Error("Incorrect email or password.");
    case "auth/too-many-requests":
      return new Error("Too many attempts. Please try again later.");
    case "functions/already-exists":
      return new Error("An account with this email already exists.");
    case "functions/invalid-argument":
      return new Error((err as { message?: string }).message ?? "Invalid details.");
    default:
      return new Error((err as { message?: string })?.message ?? "Something went wrong.");
  }
}

export const recruiterAuthService = {
  /** Server-side account creation (role=recruiter, approvalStatus=pending). */
  async register(values: RecruiterRegisterValues): Promise<void> {
    try {
      await registerFn({
        fullName: values.fullName,
        email: values.email,
        companyName: values.companyName,
        designation: values.designation,
        phone: values.phone,
        companyWebsite: values.companyWebsite,
        password: values.password,
      });
    } catch (err) {
      throw friendly(err);
    }
  },

  /** Email + password sign-in; ensures the role claim is present. */
  async login(email: string, password: string): Promise<{ emailVerified: boolean }> {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Refresh the token so the role claim (set at registration) is loaded.
      const token = await cred.user.getIdTokenResult(true);
      if (token.claims.role !== "recruiter") {
        await signOut(auth);
        throw new Error("This account is not registered as a recruiter.");
      }
      return { emailVerified: cred.user.emailVerified };
    } catch (err) {
      throw friendly(err);
    }
  },

  /** Resend the email-verification link to the current user. */
  async resendVerification(): Promise<void> {
    if (!auth.currentUser) throw new Error("You must be signed in.");
    await sendEmailVerification(auth.currentUser);
  },
};
