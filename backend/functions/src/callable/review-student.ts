import { onCall, HttpsError } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "../lib/admin";
import { CALLABLE_OPTIONS } from "../lib/https-options";

/** Admin-only — verify or reject a student's submitted profile. */
export const reviewStudent = onCall(
  CALLABLE_OPTIONS,
  async (request) => {
    if (request.auth?.token?.role !== "admin") {
      throw new HttpsError("permission-denied", "Admins only.");
    }
    const uid = String(request.data?.uid ?? "");
    const verified = Boolean(request.data?.verified);
    const reason = String(request.data?.reason ?? "");
    if (!uid) throw new HttpsError("invalid-argument", "uid is required.");

    const verificationStatus = verified ? "verified" : "rejected";
    await adminDb.collection("users").doc(uid).set(
      {
        verificationStatus,
        ...(verified ? { rejectionReason: FieldValue.delete() } : { rejectionReason: reason }),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // Notify the student.
    await adminDb.collection("notifications").add({
      recipientId: uid,
      type: "system",
      title: verified ? "Profile verified" : "Profile needs changes",
      message: verified
        ? "Your profile has been verified. You can now apply to placement drives."
        : `Your profile was not approved. Reason: ${reason || "Please review your details."}`,
      read: false,
      link: verified ? "/dashboard" : "/profile",
      createdAt: FieldValue.serverTimestamp(),
    });

    return { success: true, verificationStatus };
  }
);
