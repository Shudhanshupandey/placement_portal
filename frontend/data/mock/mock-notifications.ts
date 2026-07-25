import type { AppNotification } from "@/features/notifications";
import { ROUTES } from "@/constants/routes";
import { DEV_STUDENT_UID } from "@/data/mock/mock-accounts";
import { daysAgo, hoursAgo } from "@/data/mock/mock-time";

/**
 * Notifications — the development stand-in for the `notifications` collection.
 *
 * Covers every `NotificationType` (so each icon/tint in NOTIFICATION_META is
 * exercised), both recipients (`"all"` broadcasts and personal messages) and
 * both read states — the unread badge only counts personal unread items, so
 * the fixture keeps three of those.
 */
export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "ntf-001",
    title: "Interview scheduled — HCLTech",
    message:
      "Your technical round for the Cloud Engineering Intern role is scheduled for 11:00 AM. The meeting link has been emailed to you.",
    type: "interview",
    read: false,
    link: ROUTES.student.interviews,
    createdAtMs: hoursAgo(3),
    recipientId: DEV_STUDENT_UID,
  },
  {
    id: "ntf-002",
    title: "You've been shortlisted by Zoho Corporation",
    message:
      "Congratulations — you cleared the online programming assessment for Member Technical Staff and have moved to the interview stage.",
    type: "selection",
    read: false,
    link: ROUTES.student.applications,
    createdAtMs: daysAgo(2),
    recipientId: DEV_STUDENT_UID,
  },
  {
    id: "ntf-003",
    title: "New placement drive — Deloitte India",
    message:
      "Technology Analyst, 7.8 LPA, Gurugram / Bengaluru / Hyderabad. Applications close in 16 days.",
    type: "drive",
    read: false,
    link: ROUTES.student.placementDrives,
    createdAtMs: daysAgo(3),
    recipientId: "all",
  },
  {
    id: "ntf-004",
    title: "Pre-placement talk — Infosys",
    message:
      "The Infosys pre-placement talk will be held in the Main Auditorium at 2:00 PM this Friday. Attendance is mandatory for all registered final-year students.",
    type: "announcement",
    read: false,
    link: ROUTES.student.announcements,
    createdAtMs: daysAgo(4),
    recipientId: "all",
  },
  {
    id: "ntf-005",
    title: "Application submitted",
    message:
      "Your application to Infosys for the Systems Engineer role was submitted successfully.",
    type: "application",
    read: true,
    link: ROUTES.student.applications,
    createdAtMs: daysAgo(2),
    recipientId: DEV_STUDENT_UID,
  },
  {
    id: "ntf-006",
    title: "Profile verified by the TPO office",
    message:
      "Your profile has been reviewed and verified. You can now apply to every drive you are eligible for.",
    type: "system",
    read: true,
    link: ROUTES.student.profile,
    createdAtMs: daysAgo(9),
    recipientId: DEV_STUDENT_UID,
  },
  {
    id: "ntf-007",
    title: "Resume updated",
    message:
      "Your resume was replaced successfully. The new version will be attached to every future application.",
    type: "document",
    read: true,
    link: ROUTES.student.resume,
    createdAtMs: daysAgo(11),
    recipientId: DEV_STUDENT_UID,
  },
  {
    id: "ntf-008",
    title: "Placement policy — one offer per student",
    message:
      "Students holding a confirmed offer above 8 LPA are not eligible for further drives this cycle, in line with the SAITM placement policy. Contact the TPO office for exemptions.",
    type: "announcement",
    read: true,
    link: ROUTES.student.announcements,
    createdAtMs: daysAgo(15),
    recipientId: "all",
  },
  {
    id: "ntf-009",
    title: "Offer letter released — Tata Consultancy Services",
    message:
      "Your offer letter for the Ninja cadre is available. Please review and confirm your acceptance before the window closes.",
    type: "selection",
    read: true,
    link: ROUTES.student.applications,
    createdAtMs: daysAgo(70),
    recipientId: DEV_STUDENT_UID,
  },
  {
    id: "ntf-010",
    title: "Mock aptitude test — registrations open",
    message:
      "The placement cell is running a mock aptitude and group-discussion session next week. Register through the TPO office by Thursday.",
    type: "announcement",
    read: true,
    link: ROUTES.student.announcements,
    createdAtMs: daysAgo(21),
    recipientId: "all",
  },
  {
    id: "ntf-011",
    title: "Document verification pending",
    message:
      "Your semester 6 marksheet is awaiting verification by the examination cell. Applications remain unaffected.",
    type: "document",
    read: true,
    link: ROUTES.student.documents,
    createdAtMs: daysAgo(26),
    recipientId: DEV_STUDENT_UID,
  },
];
