"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PageShell,
  PageHeader,
  DataTable,
  StatusPill,
  type Column,
  type PillTone,
} from "@/components/dashboard";
import { formatDate } from "@/utils/format";
import { MOCK_DRIVES } from "@/data/mock";
import type { PlacementDrive } from "@/features/placement-drives";

function statusTone(status: PlacementDrive["status"]): PillTone {
  return status === "published" ? "success" : status === "closed" ? "neutral" : "warning";
}

function initials(name: string) {
  return name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function AdminDrivesPage() {
  const cols: Column<PlacementDrive>[] = [
    {
      key: "role",
      header: "Drive",
      render: (d) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 rounded-lg">
            <AvatarImage src={d.companyLogoUrl} alt="" />
            <AvatarFallback>{initials(d.companyName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-heading">{d.role}</p>
            <p className="truncate text-xs text-muted-foreground">{d.companyName}</p>
          </div>
        </div>
      ),
    },
    { key: "pkg", header: "Package", hideOnMobile: true, render: (d) => d.packageLabel },
    { key: "loc", header: "Location", hideOnMobile: true, render: (d) => d.location },
    { key: "openings", header: "Openings", align: "right", hideOnMobile: true, render: (d) => d.openings ?? "—" },
    {
      key: "deadline",
      header: "Deadline",
      align: "right",
      hideOnMobile: true,
      render: (d) => (d.lastDateMs ? formatDate(d.lastDateMs) : "—"),
    },
    { key: "status", header: "Status", align: "right", render: (d) => <StatusPill tone={statusTone(d.status)}>{d.status}</StatusPill> },
  ];

  return (
    <PageShell>
      <PageHeader
        title="Placement drives"
        description={`${MOCK_DRIVES.length} drives across the current cycle.`}
      />
      <DataTable
        columns={cols}
        rows={MOCK_DRIVES}
        rowKey={(d) => d.id}
        caption="Placement drives with package, location, openings, deadline and status"
        renderMobileCard={(d) => (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10 rounded-lg">
                <AvatarImage src={d.companyLogoUrl} alt="" />
                <AvatarFallback>{initials(d.companyName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-heading">{d.role}</p>
                <p className="truncate text-xs text-muted-foreground">{d.companyName}</p>
              </div>
              <StatusPill tone={statusTone(d.status)}>{d.status}</StatusPill>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-3 text-xs">
              <div className="min-w-0">
                <dt className="text-muted-foreground">Package</dt>
                <dd className="truncate font-medium text-heading">{d.packageLabel}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-muted-foreground">Location</dt>
                <dd className="truncate font-medium text-heading">{d.location}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-muted-foreground">Openings</dt>
                <dd className="font-medium text-heading">{d.openings ?? "—"}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-muted-foreground">Deadline</dt>
                <dd className="font-medium text-heading">
                  {d.lastDateMs ? formatDate(d.lastDateMs) : "—"}
                </dd>
              </div>
            </dl>
          </div>
        )}
      />
    </PageShell>
  );
}