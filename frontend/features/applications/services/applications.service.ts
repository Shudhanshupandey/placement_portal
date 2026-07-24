import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
  writeBatch,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { FullStudentProfile } from "@/features/profile";
import type { PlacementDrive } from "@/features/placement-drives";
import type { Application, ApplicantSnapshot } from "@/features/applications/types";

function toMs(value: unknown): number {
  if (!value) return 0;
  if (typeof value === "number") return value;
  const ts = value as Timestamp;
  return typeof ts.toMillis === "function" ? ts.toMillis() : 0;
}

function clean<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === "") continue;
    out[k] = v;
  }
  return out as T;
}

function buildSnapshot(full: FullStudentProfile): ApplicantSnapshot {
  const s = full.student;
  const a = full.academic;
  const p = full.professional;
  const d = full.documents;
  return clean({
    fullName: s?.fullName ?? "",
    email: s?.email ?? "",
    phone: s?.mobileNumber,
    course: a.course,
    branch: a.branch,
    currentYear: a.currentYear,
    cgpa: a.currentCgpa,
    resumeUrl: d.resumeUrl,
    skills: p.skills,
    photoUrl: s?.photoUrl,
  }) as ApplicantSnapshot;
}

export const applicationsService = {
  /** One-click apply using stored profile data. Idempotent per (student, drive). */
  async apply(uid: string, full: FullStudentProfile, drive: PlacementDrive): Promise<void> {
    const id = `${uid}_${drive.id}`;
    const ref = doc(db, "applications", id);
    const existing = await getDoc(ref);
    if (existing.exists()) {
      throw new Error("You have already applied to this drive.");
    }

    const batch = writeBatch(db);
    batch.set(
      ref,
      clean({
        id,
        studentId: uid,
        driveId: drive.id,
        companyName: drive.companyName,
        role: drive.role,
        companyLogoUrl: drive.companyLogoUrl,
        packageLabel: drive.packageLabel,
        location: drive.location,
        status: "pending",
        appliedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        timeline: [{ status: "pending", atMs: Date.now() }],
        applicant: buildSnapshot(full),
      })
    );

    // Self-notification so the activity feed reflects the action immediately.
    batch.set(doc(collection(db, "notifications")), {
      recipientId: uid,
      type: "application",
      title: "Application submitted",
      message: `Your application to ${drive.companyName} for ${drive.role} was submitted.`,
      read: false,
      link: "/applications",
      createdAt: serverTimestamp(),
    });

    await batch.commit();
  },

  async listMine(uid: string): Promise<Application[]> {
    const q = query(collection(db, "applications"), where("studentId", "==", uid));
    const snap = await getDocs(q);
    return snap.docs
      .map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          studentId: data.studentId,
          driveId: data.driveId,
          companyName: data.companyName ?? "",
          role: data.role ?? "",
          companyLogoUrl: data.companyLogoUrl,
          packageLabel: data.packageLabel ?? "—",
          location: data.location ?? "—",
          status: data.status ?? "pending",
          appliedAtMs: toMs(data.appliedAt),
          updatedAtMs: toMs(data.updatedAt),
          timeline: Array.isArray(data.timeline) ? data.timeline : [],
          applicant: data.applicant ?? { fullName: "", email: "" },
        } as Application;
      })
      .sort((x, y) => y.appliedAtMs - x.appliedAtMs);
  },
};
