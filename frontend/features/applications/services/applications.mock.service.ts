import type { FullStudentProfile } from "@/features/profile";
import type { PlacementDrive } from "@/features/placement-drives";
import type { Application, ApplicantSnapshot } from "@/features/applications/types";
import { simulateLatency } from "@/lib/dev-mode/latency";
import { mockDb } from "@/lib/dev-mode/mock-db";

/**
 * Development application access — the mock counterpart of
 * `applications.service.ts`.
 *
 * Mirrors the production write in full: the deterministic
 * `${studentId}_${driveId}` id (which is what makes applying idempotent), the
 * profile snapshot taken at submit time, the seeded status timeline, and the
 * self-notification the real service writes in the same batch. Without that
 * last one the activity feed would silently diverge between the two
 * implementations.
 */

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
  async apply(
    uid: string,
    full: FullStudentProfile,
    drive: PlacementDrive
  ): Promise<void> {
    await simulateLatency(500);

    const id = `${uid}_${drive.id}`;
    if (mockDb.applications.get(id)) {
      throw new Error("You have already applied to this drive.");
    }

    const now = Date.now();
    const application: Application = {
      id,
      studentId: uid,
      driveId: drive.id,
      companyName: drive.companyName,
      role: drive.role,
      companyLogoUrl: drive.companyLogoUrl,
      packageLabel: drive.packageLabel,
      location: drive.location,
      status: "pending",
      appliedAtMs: now,
      updatedAtMs: now,
      timeline: [{ status: "pending", atMs: now }],
      applicant: buildSnapshot(full),
    };

    mockDb.applications.add(application);

    mockDb.notifications.add({
      id: `ntf-dev-${now}`,
      recipientId: uid,
      type: "application",
      title: "Application submitted",
      message: `Your application to ${drive.companyName} for ${drive.role} was submitted.`,
      read: false,
      link: "/applications",
      createdAtMs: now,
    });
  },

  async listMine(uid: string): Promise<Application[]> {
    await simulateLatency();
    return mockDb.applications
      .listByStudent(uid)
      .slice()
      .sort((x, y) => y.appliedAtMs - x.appliedAtMs);
  },
};
