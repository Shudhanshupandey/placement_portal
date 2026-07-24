import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { PlacementDrive } from "@/features/placement-drives/types";

function toMs(value: unknown): number {
  if (!value) return 0;
  if (typeof value === "number") return value;
  const ts = value as Timestamp;
  return typeof ts.toMillis === "function" ? ts.toMillis() : 0;
}

function mapDrive(id: string, data: Record<string, unknown>): PlacementDrive {
  return {
    id,
    companyName: (data.companyName as string) ?? "Company",
    companyLogoUrl: data.companyLogoUrl as string | undefined,
    role: (data.role as string) ?? "Role",
    jobType: data.jobType as string | undefined,
    packageLabel: (data.packageLabel as string) ?? "—",
    location: (data.location as string) ?? "—",
    description: data.description as string | undefined,
    skills: (data.skills as string[]) ?? [],
    openings: data.openings as number | undefined,
    eligibility: (data.eligibility as PlacementDrive["eligibility"]) ?? {},
    status: (data.status as PlacementDrive["status"]) ?? "published",
    lastDateMs: toMs(data.lastDate),
    driveDateMs: toMs(data.driveDate),
    createdAtMs: toMs(data.createdAt),
  };
}

export const drivesService = {
  /** All admin-approved (published) drives, soonest deadline first. */
  async listPublished(): Promise<PlacementDrive[]> {
    const q = query(
      collection(db, "placementDrives"),
      where("status", "==", "published")
    );
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => mapDrive(d.id, d.data()))
      .sort((a, b) => (a.lastDateMs || Infinity) - (b.lastDateMs || Infinity));
  },

  async get(id: string): Promise<PlacementDrive | null> {
    const snap = await getDoc(doc(db, "placementDrives", id));
    return snap.exists() ? mapDrive(snap.id, snap.data()) : null;
  },
};
