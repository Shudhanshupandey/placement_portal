"use client";

import { toast } from "sonner";
import {
  Download,
  GraduationCap,
  UserCog,
  Building,
  Briefcase,
  BadgeCheck,
  FileBarChart,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard";
import { inr } from "@/utils/format";
import {
  MOCK_STUDENT_DIRECTORY,
  MOCK_RECRUITERS,
  MOCK_COMPANIES,
  MOCK_DRIVES,
  MOCK_OFFERS,
} from "@/data/mock";

interface ExportItem {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
  format: "CSV" | "XLSX" | "PDF";
  records: number;
}

const EXPORTS: ExportItem[] = [
  {
    key: "students",
    title: "Student directory",
    description: "All registered students with branch, CGPA and placement status.",
    icon: GraduationCap,
    format: "CSV",
    records: MOCK_STUDENT_DIRECTORY.length,
  },
  {
    key: "recruiters",
    title: "Recruiter accounts",
    description: "Recruiters with company, approval status and activity.",
    icon: UserCog,
    format: "CSV",
    records: MOCK_RECRUITERS.length,
  },
  {
    key: "companies",
    title: "Company master",
    description: "Recruiting partners with engagement and package data.",
    icon: Building,
    format: "XLSX",
    records: MOCK_COMPANIES.length,
  },
  {
    key: "drives",
    title: "Placement drives",
    description: "Every drive with role, package, eligibility and status.",
    icon: Briefcase,
    format: "CSV",
    records: MOCK_DRIVES.length,
  },
  {
    key: "offers",
    title: "Offers released",
    description: "Offer letters, CTC bands and acceptance status.",
    icon: BadgeCheck,
    format: "XLSX",
    records: MOCK_OFFERS.length,
  },
  {
    key: "placement-report",
    title: "Annual placement report",
    description: "Consolidated placement statistics for the current cycle.",
    icon: FileBarChart,
    format: "PDF",
    records: MOCK_STUDENT_DIRECTORY.length,
  },
];

export default function AdminDownloadsPage() {
  return (
    <div>
      <PageHeader
        title="Downloads"
        description="Export placement data for reporting, audits and NAAC submissions."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXPORTS.map((e) => (
          <article
            key={e.key}
            className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <e.icon className="h-5 w-5" />
              </span>
              <span className="rounded-md bg-section px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                {e.format}
              </span>
            </div>
            <h2 className="mt-3 font-semibold text-heading">{e.title}</h2>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{e.description}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs text-muted-foreground">{inr(e.records)} records</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success(`Exporting ${e.title} as ${e.format} (demo)`)}
              >
                <Download /> Export
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
