"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PageShell,
  PageHeader,
  DataTable,
  StatusPill,
  SearchField,
  FilterChips,
  ListToolbar,
  type Column,
  type PillTone,
} from "@/components/dashboard";
import { MOCK_STUDENT_DIRECTORY, type MockStudentRow } from "@/data/mock";

const TONE: Record<MockStudentRow["placementState"], PillTone> = {
  placed: "success",
  in_process: "info",
  not_placed: "neutral",
  opted_out: "warning",
};
const LABEL: Record<MockStudentRow["placementState"], string> = {
  placed: "Placed",
  in_process: "In process",
  not_placed: "Not placed",
  opted_out: "Opted out",
};

const FILTERS: { key: MockStudentRow["placementState"] | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "in_process", label: "In process" },
  { key: "placed", label: "Placed" },
  { key: "not_placed", label: "Not placed" },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function RecruiterApplicantsPage() {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<(typeof FILTERS)[number]["key"]>("all");

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_STUDENT_DIRECTORY.filter((r) => {
      const matchesFilter = filter === "all" || r.placementState === filter;
      const matchesQuery =
        !q ||
        r.fullName.toLowerCase().includes(q) ||
        r.branch.toLowerCase().includes(q) ||
        r.skills.some((s) => s.toLowerCase().includes(q));
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  const cols: Column<MockStudentRow>[] = [
    {
      key: "name",
      header: "Candidate",
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={r.photoUrl} alt="" />
            <AvatarFallback>{initials(r.fullName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-heading">{r.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">{r.enrollmentNumber}</p>
          </div>
        </div>
      ),
    },
    { key: "branch", header: "Branch", hideOnMobile: true, render: (r) => r.branch },
    { key: "cgpa", header: "CGPA", align: "right", render: (r) => r.cgpa.toFixed(2) },
    {
      key: "backlogs",
      header: "Backlogs",
      align: "right",
      hideOnMobile: true,
      render: (r) => r.activeBacklogs,
    },
    {
      key: "apps",
      header: "Apps",
      align: "right",
      hideOnMobile: true,
      render: (r) => r.applicationsCount,
    },
    {
      key: "state",
      header: "Status",
      render: (r) => <StatusPill tone={TONE[r.placementState]}>{LABEL[r.placementState]}</StatusPill>,
    },
  ];

  return (
    <PageShell>
      <PageHeader
        title="Applicants"
        description={`${MOCK_STUDENT_DIRECTORY.length} candidates in the SAITM talent pool.`}
      />

      <ListToolbar>
        <SearchField
          value={query}
          onChange={setQuery}
          label="Search candidates by name, branch or skill"
          placeholder="Search by name, branch or skill…"
        />
        <FilterChips
          options={FILTERS}
          value={filter}
          onChange={setFilter}
          label="Filter candidates by placement status"
        />
      </ListToolbar>

      <p className="sr-only" role="status">
        {rows.length} candidates match the current filters.
      </p>

      <DataTable
        columns={cols}
        rows={rows}
        rowKey={(r) => r.uid}
        caption="Candidate pool with branch, CGPA, backlogs, applications and status"
        emptyMessage="No candidates match your search."
        renderMobileCard={(r) => (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={r.photoUrl} alt="" />
                <AvatarFallback>{initials(r.fullName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-heading">{r.fullName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {r.enrollmentNumber} · {r.branch}
                </p>
              </div>
              <StatusPill tone={TONE[r.placementState]}>{LABEL[r.placementState]}</StatusPill>
            </div>
            <dl className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
              <div>
                <dt className="text-muted-foreground">CGPA</dt>
                <dd className="font-semibold text-heading">{r.cgpa.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Backlogs</dt>
                <dd className="font-semibold text-heading">{r.activeBacklogs}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Applications</dt>
                <dd className="font-semibold text-heading">{r.applicationsCount}</dd>
              </div>
            </dl>
          </div>
        )}
      />
    </PageShell>
  );
}