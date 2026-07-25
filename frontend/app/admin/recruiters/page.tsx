"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  PageHeader,
  DataTable,
  StatusPill,
  type Column,
  type PillTone,
} from "@/components/dashboard";
import { MOCK_RECRUITERS, type MockRecruiter } from "@/data/mock";
import type { ApprovalStatus } from "@/constants/roles";

function approvalTone(status: ApprovalStatus): PillTone {
  if (status === "approved") return "success";
  if (status === "rejected") return "error";
  if (status === "pending") return "warning";
  return "neutral";
}

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function AdminRecruitersPage() {
  const pendingCount = MOCK_RECRUITERS.filter((r) => r.approvalStatus === "pending").length;

  const cols: Column<MockRecruiter>[] = [
    {
      key: "name",
      header: "Recruiter",
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={r.photoUrl} alt="" />
            <AvatarFallback>{initials(r.fullName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-heading">{r.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">{r.designation}</p>
          </div>
        </div>
      ),
    },
    { key: "company", header: "Company", hideOnMobile: true, render: (r) => r.companyName },
    { key: "jobs", header: "Drives", align: "right", hideOnMobile: true, render: (r) => r.jobsPosted },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusPill tone={approvalTone(r.approvalStatus)}>{r.approvalStatus ?? "—"}</StatusPill>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) =>
        r.approvalStatus === "pending" ? (
          <div className="flex justify-end gap-1.5">
            <Button size="sm" variant="outline" onClick={() => toast.success(`Approved ${r.fullName} (demo)`)}>
              <Check /> Approve
            </Button>
            <Button size="sm" variant="ghost" onClick={() => toast(`Rejected ${r.fullName} (demo)`)}>
              <X />
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => toast(`Viewing ${r.fullName} (demo)`)}>
            View
          </Button>
        ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Recruiters"
        description={
          pendingCount > 0
            ? `${MOCK_RECRUITERS.length} recruiters · ${pendingCount} awaiting approval.`
            : `${MOCK_RECRUITERS.length} recruiters registered.`
        }
      />
      <DataTable columns={cols} rows={MOCK_RECRUITERS} rowKey={(r) => r.uid} />
    </div>
  );
}
