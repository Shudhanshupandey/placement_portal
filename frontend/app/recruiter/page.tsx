"use client";

import * as React from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  UserCheck,
  CalendarClock,
  FileCheck2,
  BadgeCheck,
  Plus,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";
import {
  KpiCard,
  KpiGrid,
  Funnel,
  Donut,
  DataTable,
  StatusPill,
  type Column,
  type PillTone,
} from "@/components/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/utils/format";
import {
  MOCK_RECRUITER_STATS,
  MOCK_RECRUITER_PIPELINE,
  MOCK_STUDENT_DIRECTORY,
  MOCK_DRIVES,
  MOCK_INTERVIEWS,
  type MockStudentRow,
} from "@/data/mock";
import type { PlacementDrive } from "@/features/placement-drives";

const STAT_ICON: Record<string, LucideIcon> = {
  jobs: Briefcase,
  applicants: Users,
  shortlisted: UserCheck,
  interviews: CalendarClock,
  offers: FileCheck2,
  acceptance: BadgeCheck,
};

const PLACEMENT_TONE: Record<MockStudentRow["placementState"], PillTone> = {
  placed: "success",
  in_process: "info",
  not_placed: "neutral",
  opted_out: "warning",
};
const PLACEMENT_LABEL: Record<MockStudentRow["placementState"], string> = {
  placed: "Placed",
  in_process: "In process",
  not_placed: "Not placed",
  opted_out: "Opted out",
};

function DriveStatus({ status }: { status: PlacementDrive["status"] }) {
  const tone: PillTone =
    status === "published" ? "success" : status === "closed" ? "neutral" : "warning";
  return <StatusPill tone={tone}>{status}</StatusPill>;
}

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function RecruiterDashboardPage() {
  const applicants = MOCK_STUDENT_DIRECTORY.slice(0, 5);
  const drives = MOCK_DRIVES.slice(0, 4);
  const interviews = MOCK_INTERVIEWS.filter((i) => i.outcome === "scheduled").slice(0, 4);

  const applicantCols: Column<MockStudentRow>[] = [
    {
      key: "name",
      header: "Candidate",
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={r.photoUrl} alt="" />
            <AvatarFallback>{initials(r.fullName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-heading">{r.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">{r.branch}</p>
          </div>
        </div>
      ),
    },
    { key: "cgpa", header: "CGPA", align: "right", render: (r) => r.cgpa.toFixed(2) },
    {
      key: "apps",
      header: "Applications",
      align: "right",
      hideOnMobile: true,
      render: (r) => r.applicationsCount,
    },
    {
      key: "state",
      header: "Status",
      render: (r) => (
        <StatusPill tone={PLACEMENT_TONE[r.placementState]}>
          {PLACEMENT_LABEL[r.placementState]}
        </StatusPill>
      ),
    },
  ];

  const driveCols: Column<PlacementDrive>[] = [
    {
      key: "role",
      header: "Role",
      render: (d) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-heading">{d.role}</p>
          <p className="truncate text-xs text-muted-foreground">{d.companyName}</p>
        </div>
      ),
    },
    { key: "pkg", header: "Package", hideOnMobile: true, render: (d) => d.packageLabel },
    {
      key: "openings",
      header: "Openings",
      align: "right",
      hideOnMobile: true,
      render: (d) => d.openings ?? "—",
    },
    {
      key: "deadline",
      header: "Deadline",
      align: "right",
      hideOnMobile: true,
      render: (d) => (d.lastDateMs ? formatDate(d.lastDateMs) : "—"),
    },
    {
      key: "status",
      header: "Status",
      align: "right",
      render: (d) => <DriveStatus status={d.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-display-sm font-bold text-heading">Recruiter workspace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your postings, applicants and interviews at a glance.
          </p>
        </div>
        <Button asChild className="w-full shrink-0 sm:w-auto">
          <Link href={ROUTES.recruiter.drives}>
            <Plus /> Post a drive
          </Link>
        </Button>
      </div>

      <KpiGrid>
        {MOCK_RECRUITER_STATS.map((tile) => (
          <KpiCard key={tile.key} tile={tile} icon={STAT_ICON[tile.key]} />
        ))}
      </KpiGrid>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Hiring pipeline"
          description="Applicants across your current drives"
          className="lg:col-span-2"
        >
          <Funnel data={MOCK_RECRUITER_PIPELINE} />
        </SectionCard>

        <SectionCard title="Offer acceptance" description="Candidates accepting your offers">
          <Donut value={86} label="Acceptance rate" sublabel="6 of 7 offers accepted" />
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Offers released</dt>
              <dd className="font-semibold text-heading">7</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Accepted</dt>
              <dd className="font-semibold text-heading">6</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Awaiting response</dt>
              <dd className="font-semibold text-heading">1</dd>
            </div>
          </dl>
        </SectionCard>
      </div>

      <SectionCard
        title="Recent applicants"
        description="Latest candidates to apply to your drives"
        action={
          <Button asChild variant="ghost" size="sm">
            <Link href={ROUTES.recruiter.applicants}>
              View all <ArrowRight />
            </Link>
          </Button>
        }
        bodyClassName="p-0"
      >
        <DataTable
          variant="embedded"
          columns={applicantCols}
          rows={applicants}
          rowKey={(r) => r.uid}
          caption="Most recent candidates to apply to your drives"
          renderMobileCard={(r) => (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={r.photoUrl} alt="" />
                <AvatarFallback>{initials(r.fullName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-heading">{r.fullName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {r.branch} · CGPA {r.cgpa.toFixed(2)}
                </p>
              </div>
              <StatusPill tone={PLACEMENT_TONE[r.placementState]}>
                {PLACEMENT_LABEL[r.placementState]}
              </StatusPill>
            </div>
          )}
        />
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Your placement drives"
          action={
            <Button asChild variant="ghost" size="sm">
              <Link href={ROUTES.recruiter.drives}>
                Manage <ArrowRight />
              </Link>
            </Button>
          }
          bodyClassName="p-0"
        >
          <DataTable
            variant="embedded"
            columns={driveCols}
            rows={drives}
            rowKey={(d) => d.id}
            caption="Your placement drives with package, openings, deadline and status"
            renderMobileCard={(d) => (
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-heading">{d.role}</p>
                    <p className="truncate text-xs text-muted-foreground">{d.companyName}</p>
                  </div>
                  <DriveStatus status={d.status} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {d.packageLabel} · {d.openings ?? "—"} openings
                  {d.lastDateMs ? ` · closes ${formatDate(d.lastDateMs)}` : ""}
                </p>
              </div>
            )}
          />
        </SectionCard>

        <SectionCard title="Upcoming interviews" description="Scheduled rounds with your candidates">
          <ul className="space-y-3">
            {interviews.map((i) => (
              <li key={i.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarClock className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-heading">{i.studentName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {i.round} · {i.role}
                  </p>
                </div>
                <span className="shrink-0 text-right text-xs text-muted-foreground">
                  {formatDate(i.scheduledAtMs)}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
