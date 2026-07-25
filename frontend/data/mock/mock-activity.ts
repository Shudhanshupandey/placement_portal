import type { Role } from "@/constants/roles";
import { avatarFor } from "@/data/mock/mock-avatars";
import { daysAgo, hoursAgo } from "@/data/mock/mock-time";

/**
 * Activity timeline — the audit trail an admin dashboard renders as a feed.
 *
 * `actorRole` is the production `Role` union so a feed can be filtered by
 * audience without inventing a parallel vocabulary. `kind` maps to an icon and
 * a locked-palette tint chosen by the consuming component, never here.
 */

export type ActivityKind =
  | "application"
  | "drive"
  | "interview"
  | "offer"
  | "approval"
  | "verification"
  | "account"
  | "system";

export interface MockActivity {
  id: string;
  kind: ActivityKind;
  actorName: string;
  actorRole: Role | "system";
  actorPhotoUrl?: string;
  /** Past-tense summary, e.g. "approved Infosys drive". */
  action: string;
  target?: string;
  atMs: number;
}

export const MOCK_ACTIVITY_TIMELINE: MockActivity[] = [
  {
    id: "act-001",
    kind: "interview",
    actorName: "Neha Verma",
    actorRole: "recruiter",
    actorPhotoUrl: avatarFor("Neha Verma"),
    action: "scheduled a technical interview with",
    target: "Aarav Sharma — Cloud Engineering Intern",
    atMs: hoursAgo(3),
  },
  {
    id: "act-002",
    kind: "application",
    actorName: "Aarav Sharma",
    actorRole: "student",
    actorPhotoUrl: avatarFor("Aarav Sharma"),
    action: "applied to",
    target: "Infosys — Systems Engineer",
    atMs: hoursAgo(9),
  },
  {
    id: "act-003",
    kind: "approval",
    actorName: "Dr. R. K. Malhotra",
    actorRole: "admin",
    actorPhotoUrl: avatarFor("Dr. R. K. Malhotra"),
    action: "approved the recruiter account for",
    target: "Deloitte India",
    atMs: hoursAgo(22),
  },
  {
    id: "act-004",
    kind: "drive",
    actorName: "Dr. R. K. Malhotra",
    actorRole: "admin",
    actorPhotoUrl: avatarFor("Dr. R. K. Malhotra"),
    action: "published a placement drive for",
    target: "Deloitte India — Technology Analyst",
    atMs: daysAgo(3),
  },
  {
    id: "act-005",
    kind: "offer",
    actorName: "Sandeep Iyer",
    actorRole: "recruiter",
    actorPhotoUrl: avatarFor("Sandeep Iyer"),
    action: "released 12 offer letters for",
    target: "Infosys — Systems Engineer",
    atMs: daysAgo(4),
  },
  {
    id: "act-006",
    kind: "verification",
    actorName: "Dr. R. K. Malhotra",
    actorRole: "admin",
    actorPhotoUrl: avatarFor("Dr. R. K. Malhotra"),
    action: "verified the profile of",
    target: "Aditya Nair",
    atMs: daysAgo(5),
  },
  {
    id: "act-007",
    kind: "account",
    actorName: "Karthik Raman",
    actorRole: "recruiter",
    actorPhotoUrl: avatarFor("Karthik Raman"),
    action: "registered a recruiter account for",
    target: "Zoho Corporation",
    atMs: daysAgo(4),
  },
  {
    id: "act-008",
    kind: "system",
    actorName: "System",
    actorRole: "system",
    action: "generated the",
    target: "Unplaced Students — Intervention List",
    atMs: daysAgo(1),
  },
  {
    id: "act-009",
    kind: "application",
    actorName: "Ishita Rao",
    actorRole: "student",
    actorPhotoUrl: avatarFor("Ishita Rao"),
    action: "accepted an offer from",
    target: "Zoho Corporation — 14 LPA",
    atMs: daysAgo(6),
  },
  {
    id: "act-010",
    kind: "approval",
    actorName: "Dr. R. K. Malhotra",
    actorRole: "admin",
    actorPhotoUrl: avatarFor("Dr. R. K. Malhotra"),
    action: "rejected the recruiter account for",
    target: "QuickHire Jobs",
    atMs: daysAgo(35),
  },
];
