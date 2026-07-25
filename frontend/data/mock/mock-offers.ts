import { companyLogo } from "@/data/mock/company-logos";
import { DEV_STUDENT_UID } from "@/data/mock/mock-accounts";
import { CURRENT_YEAR, daysAgo, daysFromNow } from "@/data/mock/mock-time";

/**
 * Offer letters.
 *
 * No production model exists yet (offer letters are documents — Firebase
 * Storage per the locked storage split), so this is a development contract.
 * `letterUrl` is a Storage-shaped placeholder; it renders the "download" state
 * correctly but does not resolve to a real file.
 */

export type OfferStatus = "released" | "accepted" | "declined" | "expired";

export interface MockOffer {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  companyName: string;
  companyLogoUrl: string;
  role: string;
  packageLabel: string;
  ctcLpa: number;
  location: string;
  employmentType: "Full-time" | "Internship";
  joiningDateMs: number;
  releasedAtMs: number;
  /** Acceptance deadline — drives the "expires in N days" copy. */
  respondByMs: number;
  status: OfferStatus;
  letterUrl: string;
  bondMonths?: number;
  notes?: string;
}

const letterUrl = (file: string) =>
  `https://firebasestorage.googleapis.com/v0/b/saitm-dev.appspot.com/o/${encodeURIComponent(
    `offers/${DEV_STUDENT_UID}/${file}`
  )}?alt=media`;

export const MOCK_OFFERS: MockOffer[] = [
  {
    id: "ofr-001",
    applicationId: `${DEV_STUDENT_UID}_drv-tcs-ninja`,
    studentId: DEV_STUDENT_UID,
    studentName: "Aarav Sharma",
    companyName: "Tata Consultancy Services",
    companyLogoUrl: companyLogo("Tata Consultancy Services", 1),
    role: "Ninja — Assistant System Engineer",
    packageLabel: "3.36 LPA",
    ctcLpa: 3.36,
    location: "Across India",
    employmentType: "Full-time",
    joiningDateMs: daysFromNow(190),
    releasedAtMs: daysAgo(70),
    respondByMs: daysAgo(56),
    status: "accepted",
    letterUrl: letterUrl("tcs-ninja-offer-letter.pdf"),
    bondMonths: 12,
    notes:
      "Accepted as a backup offer. The placement policy permits one further attempt at a higher cadre.",
  },
  {
    id: "ofr-002",
    applicationId: `${DEV_STUDENT_UID}_drv-demo-intern`,
    studentId: DEV_STUDENT_UID,
    studentName: "Aarav Sharma",
    companyName: "Demo Company Pvt Ltd",
    companyLogoUrl: companyLogo("Demo Company Pvt Ltd", 1),
    role: "Software Engineering Intern",
    packageLabel: "₹30,000 / month",
    ctcLpa: 3.6,
    location: "Gurugram, Haryana",
    employmentType: "Internship",
    joiningDateMs: daysAgo(40),
    releasedAtMs: daysAgo(44),
    respondByMs: daysAgo(37),
    status: "accepted",
    letterUrl: letterUrl("demo-company-internship-offer.pdf"),
    notes: "Winter internship completed with a pre-placement interview pending.",
  },
  {
    id: "ofr-003",
    applicationId: `${DEV_STUDENT_UID}_drv-hcl-intern`,
    studentId: DEV_STUDENT_UID,
    studentName: "Aarav Sharma",
    companyName: "HCLTech",
    companyLogoUrl: companyLogo("HCLTech", 4),
    role: "Cloud Engineering Intern",
    packageLabel: "₹25,000 / month",
    ctcLpa: 3,
    location: "Noida, Uttar Pradesh",
    employmentType: "Internship",
    joiningDateMs: daysFromNow(45),
    releasedAtMs: daysAgo(1),
    respondByMs: daysFromNow(13),
    status: "released",
    letterUrl: letterUrl("hcltech-internship-offer.pdf"),
    notes: `Provisional offer subject to clearing the ${CURRENT_YEAR} semester 7 examinations.`,
  },
];

/** Offers still awaiting a response — what the action-required widget shows. */
export const MOCK_PENDING_OFFERS = MOCK_OFFERS.filter((o) => o.status === "released");
