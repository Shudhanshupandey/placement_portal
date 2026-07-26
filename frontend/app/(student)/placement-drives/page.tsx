"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { PageShell, PageHeader, SearchField } from "@/components/dashboard";
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
    <PageShell>
      <PageHeader
        title="Placement Drives"
        description="Opportunities approved by the SAITM TPO office."
        action={
          <SearchField
            value={q}
            onChange={setQ}
            label="Search drives by company, role or location"
            placeholder="Search company, role, location…"
            className="w-full sm:w-72"
          />
        }
      />

      <p className="sr-only" role="status">
        {filtered.length} placement drives match your search.
      </p>

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
    </PageShell>
  );
}

export default function PlacementDrivesPage() {
  return (
    <Suspense fallback={null}>
      <DrivesInner />
    </Suspense>
  );
}
