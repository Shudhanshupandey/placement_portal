import { CURRENT_YEAR, daysAgo } from "@/data/mock/mock-time";

/**
 * Analytics, charts, dashboard cards and reports.
 *
 * No analytics service exists yet, so these are development contracts. They are
 * deliberately shaped as plain `{ label, value }` series rather than a specific
 * charting library's props — CLAUDE.md locks the tech stack, so nothing here
 * presumes a chart dependency that has not been approved. Any renderer (SVG,
 * CSS bars, or a future approved chart library) can consume these directly.
 *
 * Series colours are omitted on purpose: the consuming component must pull from
 * the locked palette tokens, never from a value baked into fixture data.
 */

export interface SeriesPoint {
  label: string;
  value: number;
}

export interface KpiTile {
  key: string;
  label: string;
  value: string;
  /** Percentage change vs the previous period; negative renders as a decline. */
  deltaPct?: number;
  hint?: string;
}

// ── Admin: headline statistics ───────────────────────────────────────────────

export const MOCK_ADMIN_STATS: KpiTile[] = [
  {
    key: "students",
    label: "Registered Students",
    value: "1,284",
    deltaPct: 12.4,
    hint: "Across all branches and batches",
  },
  {
    key: "placed",
    label: "Students Placed",
    value: "876",
    deltaPct: 8.1,
    hint: `${CURRENT_YEAR} placement cycle`,
  },
  {
    key: "companies",
    label: "Recruiting Companies",
    value: "63",
    deltaPct: 15.2,
    hint: "18 new this cycle",
  },
  {
    key: "drives",
    label: "Active Drives",
    value: "7",
    deltaPct: -12.5,
    hint: "Published and accepting applications",
  },
  {
    key: "avgPackage",
    label: "Average Package",
    value: "₹5.9 LPA",
    deltaPct: 6.8,
    hint: "Up from ₹5.5 LPA last cycle",
  },
  {
    key: "highestPackage",
    label: "Highest Package",
    value: "₹14 LPA",
    deltaPct: 21.7,
    hint: "Zoho Corporation",
  },
  {
    key: "pendingApprovals",
    label: "Pending Approvals",
    value: "2",
    hint: "Recruiter accounts awaiting review",
  },
  {
    key: "pendingVerifications",
    label: "Profiles To Verify",
    value: "1",
    hint: "Student profiles awaiting TPO review",
  },
];

/** Placement rate over the last six cycles. */
export const MOCK_PLACEMENT_TREND: SeriesPoint[] = [
  { label: String(CURRENT_YEAR - 5), value: 58 },
  { label: String(CURRENT_YEAR - 4), value: 61 },
  { label: String(CURRENT_YEAR - 3), value: 57 },
  { label: String(CURRENT_YEAR - 2), value: 66 },
  { label: String(CURRENT_YEAR - 1), value: 71 },
  { label: String(CURRENT_YEAR), value: 76 },
];

/** Students placed per branch, current cycle. */
export const MOCK_BRANCH_PLACEMENT: SeriesPoint[] = [
  { label: "CSE", value: 312 },
  { label: "IT", value: 198 },
  { label: "ECE", value: 141 },
  { label: "ME", value: 118 },
  { label: "EEE", value: 62 },
  { label: "CE", value: 45 },
];

/** Offer distribution by CTC band. */
export const MOCK_PACKAGE_DISTRIBUTION: SeriesPoint[] = [
  { label: "< 4 LPA", value: 214 },
  { label: "4 – 6 LPA", value: 331 },
  { label: "6 – 8 LPA", value: 187 },
  { label: "8 – 10 LPA", value: 96 },
  { label: "10 – 12 LPA", value: 34 },
  { label: "12+ LPA", value: 14 },
];

/** Applications received per month across the current cycle. */
export const MOCK_MONTHLY_APPLICATIONS: SeriesPoint[] = [
  { label: "Jul", value: 142 },
  { label: "Aug", value: 268 },
  { label: "Sep", value: 391 },
  { label: "Oct", value: 447 },
  { label: "Nov", value: 322 },
  { label: "Dec", value: 189 },
  { label: "Jan", value: 254 },
  { label: "Feb", value: 311 },
];

/** The hiring funnel — application → offer. */
export const MOCK_APPLICATION_FUNNEL: SeriesPoint[] = [
  { label: "Applied", value: 2324 },
  { label: "Under review", value: 1687 },
  { label: "Shortlisted", value: 942 },
  { label: "Interviewed", value: 611 },
  { label: "Selected", value: 231 },
  { label: "Offer released", value: 218 },
];

/** Top recruiters by students hired, current cycle. */
export const MOCK_TOP_RECRUITERS: SeriesPoint[] = [
  { label: "TCS", value: 112 },
  { label: "Infosys", value: 84 },
  { label: "HCLTech", value: 67 },
  { label: "Wipro", value: 58 },
  { label: "Maruti Suzuki", value: 38 },
  { label: "Deloitte", value: 31 },
];

// ── Recruiter: workspace statistics ──────────────────────────────────────────

export const MOCK_RECRUITER_STATS: KpiTile[] = [
  { key: "jobs", label: "Active Job Postings", value: "2", hint: "1 accepting applications" },
  { key: "applicants", label: "Total Applicants", value: "148", deltaPct: 23.5 },
  { key: "shortlisted", label: "Shortlisted", value: "34", deltaPct: 11.2 },
  { key: "interviews", label: "Interviews Scheduled", value: "12", hint: "3 in the next 7 days" },
  { key: "offers", label: "Offers Released", value: "7", deltaPct: 40 },
  { key: "acceptance", label: "Offer Acceptance", value: "86%", deltaPct: 4.1 },
];

/** Applicants per posting for the recruiter's own drives. */
export const MOCK_RECRUITER_PIPELINE: SeriesPoint[] = [
  { label: "Applied", value: 148 },
  { label: "Screened", value: 92 },
  { label: "Shortlisted", value: 34 },
  { label: "Interviewed", value: 19 },
  { label: "Offered", value: 7 },
];

// ── Student: dashboard cards ─────────────────────────────────────────────────

export const MOCK_STUDENT_STATS: KpiTile[] = [
  { key: "applications", label: "Applications", value: "7", hint: "Across 7 drives" },
  { key: "shortlisted", label: "Shortlisted", value: "1", hint: "Zoho Corporation" },
  { key: "interviews", label: "Interviews", value: "2", hint: "Next in 2 days" },
  { key: "offers", label: "Offers", value: "2", hint: "1 awaiting your response" },
];

// ── Reports ──────────────────────────────────────────────────────────────────

export type ReportFormat = "PDF" | "XLSX" | "CSV";
export type ReportStatus = "ready" | "generating" | "scheduled" | "failed";

export interface MockReport {
  id: string;
  title: string;
  description: string;
  category: "Placement" | "Company" | "Student" | "Compliance";
  format: ReportFormat;
  status: ReportStatus;
  /** Rows covered — shown next to the download action. */
  records: number;
  generatedAtMs: number;
  generatedBy: string;
  sizeLabel: string;
}

export const MOCK_REPORTS: MockReport[] = [
  {
    id: "rpt-001",
    title: `Annual Placement Report ${CURRENT_YEAR}`,
    description:
      "Consolidated placement statistics by branch, package band and recruiter for the current academic year.",
    category: "Placement",
    format: "PDF",
    status: "ready",
    records: 1284,
    generatedAtMs: daysAgo(2),
    generatedBy: "Dr. R. K. Malhotra",
    sizeLabel: "4.2 MB",
  },
  {
    id: "rpt-002",
    title: "Branch-wise Placement Summary",
    description:
      "Placement percentage, average CTC and highest CTC for every branch, ready for the NAAC submission.",
    category: "Compliance",
    format: "XLSX",
    status: "ready",
    records: 6,
    generatedAtMs: daysAgo(5),
    generatedBy: "Dr. R. K. Malhotra",
    sizeLabel: "182 KB",
  },
  {
    id: "rpt-003",
    title: "Company Engagement Report",
    description:
      "Drives conducted, offers rolled out and conversion ratio for every recruiting partner.",
    category: "Company",
    format: "PDF",
    status: "ready",
    records: 63,
    generatedAtMs: daysAgo(9),
    generatedBy: "Placement Cell",
    sizeLabel: "1.7 MB",
  },
  {
    id: "rpt-004",
    title: "Unplaced Students — Intervention List",
    description:
      "Final-year students with zero offers, sorted by CGPA, for targeted training and mock interviews.",
    category: "Student",
    format: "CSV",
    status: "ready",
    records: 408,
    generatedAtMs: daysAgo(1),
    generatedBy: "Placement Cell",
    sizeLabel: "96 KB",
  },
  {
    id: "rpt-005",
    title: "Offer Acceptance Audit",
    description:
      "Cross-check of released offers against student acceptances, flagging policy breaches.",
    category: "Compliance",
    format: "XLSX",
    status: "generating",
    records: 218,
    generatedAtMs: Date.now(),
    generatedBy: "Dr. R. K. Malhotra",
    sizeLabel: "—",
  },
  {
    id: "rpt-006",
    title: "Monthly Placement Digest",
    description:
      "Automated monthly summary emailed to the Director and department heads on the 1st.",
    category: "Placement",
    format: "PDF",
    status: "scheduled",
    records: 0,
    generatedAtMs: daysAgo(31),
    generatedBy: "System (scheduled)",
    sizeLabel: "—",
  },
];
