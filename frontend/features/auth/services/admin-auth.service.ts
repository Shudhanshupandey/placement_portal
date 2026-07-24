import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

function friendly(err: unknown): Error {
  const code = (err as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return new Error("Incorrect email or password.");
    case "auth/too-many-requests":
      return new Error("Too many attempts. Please try again later.");
    default:
      return new Error((err as { message?: string })?.message ?? "Sign-in failed.");
  }
}

export const adminAuthService = {
  /** Secure admin sign-in with strict role validation. */
  async login(email: string, password: string): Promise<void> {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdTokenResult(true);
      if (token.claims.role !== "admin") {
        await signOut(auth);
        throw new Error("You are not authorized to access the admin console.");
      }
    } catch (err) {
      throw friendly(err);
    }
  },
};

export const passwordAuthService = {
  /** Send a password-reset email (recruiter/admin). */
  async sendReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      // Do not reveal whether the account exists.
      const code = (err as { code?: string })?.code ?? "";
      if (code === "auth/invalid-email") {
        throw new Error("Enter a valid email address.");
      }
      // Silently succeed for user-not-found to avoid account enumeration.
    }
  },
};
