import { onCall, HttpsError } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "../lib/admin";
import { sendRecruiterApprovedEmail } from "../lib/email";
import { CALLABLE_OPTIONS } from "../lib/https-options";

/** Admin-only — approve or reject a recruiter account. */
export const approveRecruiter = onCall(
  CALLABLE_OPTIONS,
  async (request) => {
    if (request.auth?.token?.role !== "admin") {
      throw new HttpsError("permission-denied", "Admins only.");
    }
    const uid = String(request.data?.uid ?? "");
    const approve = Boolean(request.data?.approve);
    const reason = String(request.data?.reason ?? "");
    if (!uid) throw new HttpsError("invalid-argument", "uid is required.");

    const status = approve ? "approved" : "rejected";
    const batch = adminDb.batch();
    batch.set(
      adminDb.collection("users").doc(uid),
      {
        approvalStatus: status,
        isActive: approve,
        ...(approve ? {} : { rejectionReason: reason }),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    batch.set(
      adminDb.collection("recruiters").doc(uid),
      {
        approvalStatus: status,
        approvedBy: request.auth?.uid ?? null,
        approvedAt: FieldValue.serverTimestamp(),
        ...(approve ? {} : { rejectionReason: reason }),
      },
      { merge: true }
    );
    await batch.commit();

    if (approve) {
      const snap = await adminDb.collection("users").doc(uid).get();
      const email = snap.data()?.email as string | undefined;
      if (email) await sendRecruiterApprovedEmail(email);
    }

    return { success: true, status };
  }
);
