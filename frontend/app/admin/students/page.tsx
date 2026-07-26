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
    <PageShell>
      <PageHeader
        title="Students"
        description={`${MOCK_STUDENT_DIRECTORY.length} registered students across all branches.`}
      />

      <ListToolbar>
        <SearchField
          value={query}
          onChange={setQuery}
          label="Search students by name, enrollment number or branch"
          placeholder="Search by name, enrollment or branch…"
        />
        <FilterChips
          options={FILTERS}
          value={filter}
          onChange={setFilter}
          label="Filter students by placement status"
        />
      </ListToolbar>

      <p className="sr-only" role="status">
        {rows.length} students match the current filters.
      </p>

      <DataTable
        columns={cols}
        rows={rows}
        rowKey={(r) => r.uid}
        caption="Registered students with branch, CGPA, verification and placement status"
        emptyMessage="No students match your search."
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
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone={PLACE_TONE[r.placementState]}>
                {PLACE_LABEL[r.placementState]}
              </StatusPill>
              <StatusPill tone={VERIF_TONE[r.verificationStatus]}>
                {r.verificationStatus}
              </StatusPill>
              <span className="ml-auto text-xs text-muted-foreground">
                CGPA <span className="font-semibold text-heading">{r.cgpa.toFixed(2)}</span>
                <span className="mx-1.5 text-border">|</span>
                {r.offersCount} {r.offersCount === 1 ? "offer" : "offers"}
              </span>
            </div>
          </div>
        )}
      />
    </PageShell>
  );
}