import {
  LayoutDashboard,
  User,
  Building2,
  Briefcase,
  FileText,
  FileUser,
  FolderOpen,
  CalendarClock,
  Bell,
  Megaphone,
  Award,
  Settings,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  group: "main" | "career" | "account";
}

export const STUDENT_NAV: NavItem[] = [
  { label: "Dashboard", href: ROUTES.student.dashboard, icon: LayoutDashboard, group: "main" },
  { label: "My Profile", href: ROUTES.student.profile, icon: User, group: "main" },
  { label: "Placement Drives", href: ROUTES.student.placementDrives, icon: Briefcase, group: "career" },
  { label: "Companies", href: ROUTES.student.companies, icon: Building2, group: "career" },
  { label: "My Applications", href: ROUTES.student.applications, icon: FileText, group: "career" },
  { label: "Interview Schedule", href: ROUTES.student.interviews, icon: CalendarClock, group: "career" },
  { label: "Resume", href: ROUTES.student.resume, icon: FileUser, group: "career" },
  { label: "Documents", href: ROUTES.student.documents, icon: FolderOpen, group: "career" },
  { label: "Skills & Certifications", href: ROUTES.student.skills, icon: Award, group: "career" },
  { label: "Notifications", href: ROUTES.student.notifications, icon: Bell, group: "account" },
  { label: "Announcements", href: ROUTES.student.announcements, icon: Megaphone, group: "account" },
  { label: "Settings", href: ROUTES.student.settings, icon: Settings, group: "account" },
  { label: "Help & Support", href: ROUTES.student.help, icon: LifeBuoy, group: "account" },
];

export const NAV_GROUPS: { key: NavItem["group"]; label: string }[] = [
  { key: "main", label: "Overview" },
  { key: "career", label: "Placements" },
  { key: "account", label: "Account" },
];
