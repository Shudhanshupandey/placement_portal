import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  BarChart3,
  Bell,
  Building,
  UserCog,
  FileBarChart,
  Download,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

/**
 * Navigation for the management consoles (recruiter + admin).
 *
 * Kept separate from `student-nav.ts` so the student portal is never touched.
 * `group` is a free string here (each console defines its own sections) rather
 * than the student portal's fixed union.
 */
export interface ConsoleNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  group: string;
}

export interface ConsoleNavGroup {
  key: string;
  label: string;
}

// ── Recruiter console ────────────────────────────────────────────────────────

export const RECRUITER_NAV: ConsoleNavItem[] = [
  { label: "Dashboard", href: ROUTES.recruiter.home, icon: LayoutDashboard, group: "overview" },
  { label: "Analytics", href: ROUTES.recruiter.analytics, icon: BarChart3, group: "overview" },
  { label: "Placement Drives", href: ROUTES.recruiter.drives, icon: Briefcase, group: "hiring" },
  { label: "Applicants", href: ROUTES.recruiter.applicants, icon: Users, group: "hiring" },
  { label: "Company Profile", href: ROUTES.recruiter.company, icon: Building2, group: "company" },
  { label: "Notifications", href: ROUTES.recruiter.notifications, icon: Bell, group: "account" },
];

export const RECRUITER_NAV_GROUPS: ConsoleNavGroup[] = [
  { key: "overview", label: "Overview" },
  { key: "hiring", label: "Hiring" },
  { key: "company", label: "Company" },
  { key: "account", label: "Account" },
];

// ── Admin console ────────────────────────────────────────────────────────────

export const ADMIN_NAV: ConsoleNavItem[] = [
  { label: "Dashboard", href: ROUTES.admin.home, icon: LayoutDashboard, group: "overview" },
  { label: "Analytics", href: ROUTES.admin.analytics, icon: BarChart3, group: "overview" },
  { label: "Students", href: ROUTES.admin.students, icon: GraduationCap, group: "people" },
  { label: "Recruiters", href: ROUTES.admin.recruiters, icon: UserCog, group: "people" },
  { label: "Companies", href: ROUTES.admin.companies, icon: Building, group: "placements" },
  { label: "Placement Drives", href: ROUTES.admin.drives, icon: Briefcase, group: "placements" },
  { label: "Reports", href: ROUTES.admin.reports, icon: FileBarChart, group: "insights" },
  { label: "Downloads", href: ROUTES.admin.downloads, icon: Download, group: "insights" },
  { label: "Notifications", href: ROUTES.admin.notifications, icon: Bell, group: "account" },
];

export const ADMIN_NAV_GROUPS: ConsoleNavGroup[] = [
  { key: "overview", label: "Overview" },
  { key: "people", label: "People" },
  { key: "placements", label: "Placements" },
  { key: "insights", label: "Insights" },
  { key: "account", label: "Account" },
];
