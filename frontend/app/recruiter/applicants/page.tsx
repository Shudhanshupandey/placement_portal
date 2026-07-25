"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  PageHeader,
  DataTable,
  StatusPill,
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
    <div>
      <PageHeader
        title="Applicants"
        description={`${MOCK_STUDENT_DIRECTORY.length} candidates in the SAITM talent pool.`}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, branch or skill…"
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                filter === f.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-heading"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={cols}
        rows={rows}
        rowKey={(r) => r.uid}
        emptyMessage="No candidates match your search."
      />
    </div>
  );
}
