"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useDrives, DriveCard } from "@/features/placement-drives";
import { ApplyButton } from "@/features/applications";

function DrivesInner() {
  const sp = useSearchParams();
  const [q, setQ] = React.useState(sp.get("q") ?? "");
  const { data: drives, isLoading } = useDrives();

  const needle = q.trim().toLowerCase();
  const filtered = (drives ?? []).filter(
    (d) => !needle || `${d.companyName} ${d.role} ${d.location}`.toLowerCase().includes(needle)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Placement Drives</h1>
          <p className="text-sm text-muted-foreground">
            Opportunities approved by the SAITM TPO office.
          </p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search company, role, location…"
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={q ? "No drives match your search" : "No active placement drives"}
          description={
            q
              ? "Try a different company, role or location."
              : "When the TPO office approves a placement drive, it will appear here instantly."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((drive) => (
            <DriveCard key={drive.id} drive={drive} renderApply={(d) => <ApplyButton drive={d} />} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PlacementDrivesPage() {
  return (
    <Suspense fallback={null}>
      <DrivesInner />
    </Suspense>
  );
}
