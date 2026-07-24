import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (getApps().length === 0) {
  initializeApp();
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();

/** True when running inside the local Firebase Emulator Suite. */
export const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";

/**
 * Email domains permitted to authenticate as a student.
 *
 * Comma-separated (`ALLOWED_EMAIL_DOMAIN=saitm.ac.in,gmail.com`). The first
 * entry is the institutional domain and is what user-facing copy names.
 */
export const ALLOWED_EMAIL_DOMAINS: string[] = (() => {
  const parsed = (process.env.ALLOWED_EMAIL_DOMAIN ?? "saitm.ac.in")
    .split(",")
    .map((d) => d.trim().toLowerCase().replace(/^@/, ""))
    .filter(Boolean);
  return parsed.length > 0 ? parsed : ["saitm.ac.in"];
})();

/** Primary (institutional) domain — used in messages and placeholders. */
export const ALLOWED_DOMAIN = ALLOWED_EMAIL_DOMAINS[0];
