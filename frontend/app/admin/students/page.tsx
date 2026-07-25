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
import type { VerificationStatus } from "@/constants/roles";

const VERIF_TONE: Record<VerificationStatus, PillTone> = {
  verified: "success",
  pending: "warning",
  unverified: "neutral",
  rejected: "error",
};

const PLACE_TONE: Record<MockStudentRow["placementState"], PillTone> = {
  placed: "success",
  in_process: "info",
  not_placed: "neutral",
  opted_out: "warning",
};
const PLACE_LABEL: Record<MockStudentRow["placementState"], string> = {
  placed: "Placed",
  in_process: "In process",
  not_placed: "Not placed",
  opted_out: "Opted out",
};

const FILTERS: { key: MockStudentRow["placementState"] | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "placed", label: "Placed" },
  { key: "in_process", label: "In process" },
  { key: "not_placed", label: "Not placed" },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function AdminStudentsPage() {
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
        r.enrollmentNumber.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  const cols: Column<MockStudentRow>[] = [
    {
      key: "name",
      header: "Student",
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
      key: "verif",
      header: "Verification",
      hideOnMobile: true,
      render: (r) => <StatusPill tone={VERIF_TONE[r.verificationStatus]}>{r.verificationStatus}</StatusPill>,
    },
    {
      key: "offers",
      header: "Offers",
      align: "right",
      hideOnMobile: true,
      render: (r) => r.offersCount,
    },
    {
      key: "state",
      header: "Placement",
      render: (r) => <StatusPill tone={PLACE_TONE[r.placementState]}>{PLACE_LABEL[r.placementState]}</StatusPill>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Students"
        description={`${MOCK_STUDENT_DIRECTORY.length} registered students across all branches.`}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, enrollment or branch…"
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
        emptyMessage="No students match your search."
      />
    </div>
  );
}
